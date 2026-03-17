import { ObjectId } from "mongoose";
import FileHelper from "../fileService/fileHelper";
import FileService from "../fileService/fileService";
import ApiError from "../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../utils/constants";
import QuickLink from "../../models/QuickLinks";
import { IQuickLinkBody } from "../../types/requests";
import { toObjectId } from "../../utils/helper";
import { ILink, IQuickLink } from "../../types/models";
import path from "path";

export class QuickLinkService {

  fileHelper = new FileHelper();
  fileService = new FileService();


  async createQuickLink(payload: any, userId: ObjectId, file: any) {
    const { Title, Links } = payload;

    // Validate required fields
    if (!Title || !Array.isArray(Links) || Links.length === 0) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
    }

    // Validate each link in the array
    for (const link of Links) {
      if (!link.title || !link.url) {
        throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Each link must have a title and URL");
      }
    }

    // Create new QuickLink entry
    const newQuickLink = new QuickLink({
      Icon: file?.filename || "", // Store file name if uploaded, else empty string
      Title,
      Links,
      CreatedBy: userId, // Add createdBy if needed
    });

    await newQuickLink.save();

    return newQuickLink;
  }

  async updateQuickLink(
    payload: Partial<IQuickLinkBody>,
    quickLinkId: string,
    file: any
  ): Promise<IQuickLinkBody> {
    console.log(file, "Received file object");

    // Find existing quick link
    const quickLink = await QuickLink.findById(toObjectId(quickLinkId));
    if (!quickLink) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Quick Link not found",
        {},
        false
      );
    }

    // Handle icon update
    let newIcon = quickLink.Icon;
    if (file) {
      newIcon = file.filename;
      // Delete old icon if it exists
      if (quickLink.Icon) {
        const oldFilePath = `uploads/quickLinkIcon/${quickLink.CreatedBy}/${quickLink.Icon}`;
        try {
          await this.fileHelper.deleteFile(oldFilePath);
        } catch (error) {
          console.error("Error deleting old icon:", error);
          // Continue with update even if file deletion fails
        }
      }
    }

    // Prepare update payload
    const updateData: Partial<IQuickLink> = {
      ...payload,
      Icon: newIcon
    };

    // Handle Links array separately to ensure proper updating
    if (payload.Links) {
      // Links array is provided in payload, completely replace the existing links
      updateData.Links = payload.Links.map(link => ({
        title: link.title,
        url: link.url
      }));
    }

    // Update quick link in database
    const updatedQuickLink = await QuickLink.findByIdAndUpdate(
      quickLinkId,
      updateData,
      { new: true }
    ).lean() as IQuickLink;

    if (!updatedQuickLink) {
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        "Failed to update Quick Link",
        {},
        false
      );
    }

    return updatedQuickLink;
  }

  async getQuickLinkList(): Promise<any> {
    try {
      // Fetch all Quick Links
      const quickLinkList = await QuickLink.find().lean();

      if (!quickLinkList.length) {
        return { message: "No Quick Links found." };
      }

      // Prepare the response
      const response = quickLinkList.map(quickLink => ({
        quickLinkId: quickLink._id,
        Title: quickLink.Title,
        Icon: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.QUICKLINKICON, [quickLink.CreatedBy.toString(), quickLink.Icon]),
        CreatedBy: quickLink.CreatedBy,
        Links: quickLink.Links.map(link => ({
          id: link._id,
          title: link.title,
          url: link.url
        })),

      }));

      return response;
    } catch (error) {
      console.error("Error fetching Quick Link list:", error);
      throw new ApiError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to fetch Quick Links", {}, false);
    }
  }

  async deleteQuickLink(quickLinkId: string): Promise<any> {
    // Fetch the QuickLink document
    const quickLink = await QuickLink.findById(quickLinkId);

    if (!quickLink) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Quick Link not found",
        {},
        false
      );
    }

    // Extract the user ID from the QuickLink document
    const userId = quickLink.CreatedBy.toString();

    // Construct the file path for the icon
    const filePath = path.join("uploads", "quickLinkIcon", userId, quickLink.Icon);

    // Delete the icon file from the file system
    await this.fileHelper.deleteFile(filePath);

    // Delete the QuickLink document from the database
    await QuickLink.deleteOne({ _id: quickLinkId });

    return {
      success: true,
      message: "Quick Link and its associated icon have been deleted successfully",
    };
  }







}