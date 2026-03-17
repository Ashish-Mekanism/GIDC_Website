import { ObjectId } from "mongoose";
import { IOverviewBody } from "../../types/requests";
import Overview from "../../models/Overview";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import { toObjectId } from "../../utils/helper";
import { IOverview } from "../../types/models";
import AboutUs from "../../models/AboutUsImages";
import path from "path";
import FileService from "../fileService/fileService";
import FileHelper from "../fileService/fileHelper";

export class OverviewService {
  fileHelper = new FileHelper();
  fileService = new FileService();


  async createOverview(payload: Partial<IOverviewBody>, userId: ObjectId) {
    const existingOverview = await Overview.findOne();

    if (existingOverview) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        "A 'Overview' entry already exists. You cannot create another one."
      );
    }

    const { NoOfIndustriesInOdhav, NoOfMembers, AreaOfIndustrialEstate } =
      payload;

    // Prepare the new businessBulletin document
    const newOverview = new Overview({
      NoOfIndustriesInOdhav,
      NoOfMembers,
      AreaOfIndustrialEstate,
      CreatedBy: userId,
    });

    // Save the document
    await newOverview.save();

    return newOverview;
  }

  async getOverview(): Promise<any> {
    // Fetch all Quick Links
    const overview = await Overview.find().lean();

    if (!overview) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "A 'Overview Not Found.");
    }

    // Prepare the response
    const response = overview;

    return response;
  }

  async updateOverview(
    payload: Partial<IOverviewBody>,
    overviewId: string
  ): Promise<IOverviewBody> {
    // Find existing business card
    const overview = await Overview.findById(toObjectId(overviewId));
    if (!overview) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Overview not found",
        {},
        false
      );
    }

    // Update payload
    const updatedPayload = {
      ...payload,
    };

    // Update business card in database
    const updatedOverview = (await Overview.findByIdAndUpdate(
      overviewId,
      updatedPayload,
      { new: true }
    ).lean()) as IOverview;

    return updatedOverview;
  }

    async createAboutUsImages(userId: ObjectId, files: any): Promise<any> {
      console.log(files, "imagessssssssss");

      const { overviewImage, corpoImage } = files;

      const overviewImagesArray = overviewImage
        ? overviewImage.map((file: Express.Multer.File) => ({
            fileName: file.filename,
          }))
        : [];

      const csrImagesArray = corpoImage
        ? corpoImage.map((file: Express.Multer.File) => ({
            fileName: file.filename,
          }))
        : [];

      const updateData: any = {
        CreatedBy: userId,
      };

      // ✅ Update only what is provided
      if (overviewImagesArray.length > 0) {
        updateData.OverviewImage = overviewImagesArray;
      }

      if (csrImagesArray.length > 0) {
        updateData.CorporateSocialResponsibilityImage = csrImagesArray;
      }

      const aboutUsImages = await AboutUs.findOneAndUpdate(
        { CreatedBy: userId }, // 🔑 single document condition
        { $set: updateData },
        {
          new: true,
          upsert: true, // ✅ create if not exists
        }
      );

      return aboutUsImages;
    }

 async updateAboutUsImages(

  payload: {
    deleteOverviewImageIds?: any;
    deleteCSRImageIds?:any;
    aboutUsId?: any,
  },
  files: any
): Promise<any> {



    if (!payload.aboutUsId) {
    throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "AboutUs ID is required", {}, false);
  }

  const aboutUs = await AboutUs.findById(payload.aboutUsId);

  if (!aboutUs) {
    throw new ApiError(RESPONSE_CODE.NOT_FOUND, "AboutUs not found", {}, false);
  }


  const createdById = aboutUs.CreatedBy.toString();

  // ===============================
  // 1️⃣ DELETE OVERVIEW IMAGES
  // ===============================
  if (payload.deleteOverviewImageIds) {

    const deleteIds = payload.deleteOverviewImageIds
      .replace(/[\[\]\{\}]/g, "")
      .split(",")
      .map((id:any) => id.trim())
      .filter(Boolean);

    if (deleteIds.length > 0) {

      const imagesToDelete = aboutUs.OverviewImage.filter(
        (img: any) => deleteIds.includes(img._id.toString())
      );

      for (const img of imagesToDelete) {
        const filePath = path.join(
          "uploads",
          "overview",
          createdById,
          img.fileName
        );
        await this.fileHelper.deleteFile(filePath);
      }

      aboutUs.OverviewImage = aboutUs.OverviewImage.filter(
        (img: any) => !deleteIds.includes(img._id.toString())
      );

      aboutUs.markModified("OverviewImage");
    }
  }

  // ===============================
  // 2️⃣ DELETE CSR IMAGES
  // ===============================
  if (payload.deleteCSRImageIds) {

    const deleteIds = payload.deleteCSRImageIds
      .replace(/[\[\]\{\}]/g, "")
      .split(",")
      .map((id:any) => id.trim())
      .filter(Boolean);

    if (deleteIds.length > 0) {

      const imagesToDelete = aboutUs.CorporateSocialResponsibilityImage.filter(
        (img: any) => deleteIds.includes(img._id.toString())
      );

      for (const img of imagesToDelete) {
        const filePath = path.join(
          "uploads",
          "overview",
          createdById,
          img.fileName
        );
        await this.fileHelper.deleteFile(filePath);
      }

      aboutUs.CorporateSocialResponsibilityImage =
        aboutUs.CorporateSocialResponsibilityImage.filter(
          (img: any) => !deleteIds.includes(img._id.toString())
        );

      aboutUs.markModified("CorporateSocialResponsibilityImage");
    }
  }

  // ===============================
  // 3️⃣ ADD NEW UPLOADED FILES
  // ===============================
  if (files?.overviewImage?.length > 0) {
    const newOverviewImages = files.overviewImage.map((file: any) => ({
      fileName: file.filename,
    }));

    aboutUs.OverviewImage.push(...newOverviewImages);
    aboutUs.markModified("OverviewImage");
  }

  if (files?.corpoImage?.length > 0) {
    const newCSRImages = files.corpoImage.map((file: any) => ({
      fileName: file.filename,
    }));

    aboutUs.CorporateSocialResponsibilityImage.push(...newCSRImages);
    aboutUs.markModified("CorporateSocialResponsibilityImage");
  }

  // ===============================
  // 4️⃣ SAVE (NO NEW RECORD)
  // ===============================
  await aboutUs.save();

  return aboutUs;
}


async getAboutUsImages(): Promise<any> {
  // Fetch single AboutUs document
  const aboutUs = await AboutUs.findOne().lean();

  if (!aboutUs) {
    throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'About Us data not found');
  }

  const createdByIdString = aboutUs.CreatedBy?.toString();

  // ===============================
  // Map Overview Images
  // ===============================
  aboutUs.OverviewImage = aboutUs.OverviewImage.map((img: any) => ({
    ...img,
    imageUrl: this.fileService.getFilePathFromDatabase(
      FOLDER_NAMES.OVERVIEW,
      [createdByIdString, img.fileName]
    ),
  }));

  // ===============================
  // Map CSR Images
  // ===============================
  aboutUs.CorporateSocialResponsibilityImage =
    aboutUs.CorporateSocialResponsibilityImage.map((img: any) => ({
      ...img,
      imageUrl: this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.OVERVIEW,
        [createdByIdString, img.fileName]
      ),
    }));

  return aboutUs;
}


}
