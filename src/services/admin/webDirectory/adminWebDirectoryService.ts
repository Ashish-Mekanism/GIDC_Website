import mongoose, { ObjectId } from "mongoose";
import WebDirectoryModel from "../../../models/WebDirectory";
import { IProduct, IUpdateWebDirectoryBody, IWebDirectoryBody } from "../../../types/requests";
import { FOLDER_NAMES, RESPONSE_CODE, WEBDIRECTORY_STATUS } from "../../../utils/constants";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import { toObjectId } from "../../../utils/helper";
import ApiError from "../../../utils/ApiError";
import Config from "../../../config";

export class AdminWebDirectoryService {

  fileHelper = new FileHelper();
  fileService = new FileService();

  async adminCreateWebDirectory(
    payload: Partial<IWebDirectoryBody>,
    user_id: ObjectId,
    files: any
  ): Promise<IWebDirectoryBody> {
    // Type-cast or assert product to IProduct[] if needed:
    const products: IProduct[] = (payload.product as IProduct[]) || [];
    // Map over the products to attach the corresponding file name.
    const mappedProducts = products.map((prod, index) => {
      // Get the product image filename from files.
      const productImage =
        files.productImage && files.productImage[index]
          ? files.productImage[index].filename
          : undefined;

      return {
        ...prod, // Spread the product fields
        productImage, // Attach the file name
      };
    });

    // Get company logo filename from files.
    const companyLogo =
      files.companyLogo && files.companyLogo.length > 0
        ? files.companyLogo[0].filename
        : undefined;

    // Map the 'location' field from payload to 'locationDetails'
    const locationDetails = payload.location || {};

    // Build the final data object ensuring the key matches the schema.
    const webDirectoryData = {
      ...payload, // Spread the remaining fields
      companyLogo,
      product: mappedProducts,
      created_by: user_id,
      userId: user_id,
      location: locationDetails, // Use locationDetails instead of location
      active:WEBDIRECTORY_STATUS.ACTIVE,
    };

    // Save to database using your Mongoose model
    const createdDocument = await WebDirectoryModel.create(webDirectoryData);
    return createdDocument;
  }


//   async getWebDirectoryList(): Promise<any> {
//     // Fetch all entries from the WebDirectoryModel collection
//     const directories = await WebDirectoryModel.aggregate([
//         {
//             $lookup: {
//                 from: "users", // The name of the collection
//                 localField: "userId",
//                 foreignField: "_id",
//                 as: "creator",
//             },
//         },
//         {
//             $unwind: { path: "$creator", preserveNullAndEmptyArrays: true },
//         },
//         {
//             $addFields: {
//                 url: {
//                     $concat: [
//                         Config.FE_BASE_URL,
//                         "/web-directory/",
//                         { $toLower: { $replaceAll: { input: "$companyName", find: " ", replacement: "-" } } },
//                         "/",
//                         { 
//                             $toString: {
//                                 $cond: {
//                                     if: { $ifNull: ["$created_by", false] }, 
//                                     then: "$_id", 
//                                     else: "$userId"
//                                 }
//                             }
//                         }
//                     ]
//                 },
//                 created_by: {
//                     email: "$creator.email",
//                     user_type: {
//                         $switch: {
//                             branches: [
//                                 { case: { $eq: ["$creator.user_type", 1] }, then: "SUPER_ADMIN" },
//                                 { case: { $eq: ["$creator.user_type", 2] }, then: "SUB_ADMIN" },
//                                 { case: { $eq: ["$creator.user_type", 3] }, then: "USER" },
//                             ],
//                             default: "USER",
//                         },
//                     },
//                 }
//             }
//         }
//     ]);
    
//     return {
//         data: directories.map(directory => {
//             const userIdString = directory?.userId ? directory.userId.toString() : "";

//             // Process product array to include proper image paths
//             const products: IProduct[] = directory.product 
//                 ? directory.product.map((product: IProduct) => ({
//                     ...product,
//                     productImage: product.productImage
//                         ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, product.productImage])
//                         : null
//                 })) 
//                 : [];

//             return {
//                 ...directory,
//                 companyLogo: directory.companyLogo
//                     ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, directory.companyLogo])
//                     : null,
//                 product: products
//             };
//         }),
//         totalCount: directories.length
//     };
// }

async getWebDirectoryList(): Promise<any> {
  const directories = await WebDirectoryModel.aggregate([
      {
          $lookup: {
              from: "users",
              localField: "created_by",
              foreignField: "_id",
              as: "creator"
          }
      },
      {
          $unwind: { path: "$creator", preserveNullAndEmptyArrays: true }
      },
      {
          $addFields: {
              url: {
                  $concat: [
                      Config.FE_BASE_URL,
                      "/web-directory/",
                      { $toLower: { $replaceAll: { input: "$companyName", find: " ", replacement: "-" } } },
                      "/",
                      { 
                          $toString: {
                              $cond: {
                                  if: { $ifNull: ["$created_by", false] }, 
                                  then: "$_id", 
                                  else: "$userId"
                              }
                          }
                      }
                  ]
              }
          }
      },
      {
          $project: {
              _id: 1,
              userId: 1,
              created_by: {
                  email: "$creator.email",
                  user_type: {
                      $switch: {
                          branches: [
                              { case: { $eq: ["$creator.user_type", 1] }, then: "SUPER_ADMIN" },
                              { case: { $eq: ["$creator.user_type", 2] }, then: "SUB_ADMIN" },
                              { case: { $eq: ["$creator.user_type", 3] }, then: "USER" }
                          ],
                          default: "USER"
                      }
                  }
              },
              companyName: 1,
              companyLogo: 1,
              personalPhone: 1,
              companyPhone: 1,
              personalEmail: 1,
              companyEmail: 1,
              companyProfile: 1,
              productDetails: 1,
              product: 1,
              location: 1,
              createdAt: 1,
              updatedAt: 1,
              active: 1,
              url: 1,
              membershipNo: 1,
          }
      }
  ]);
  
  return {
      data: directories.map(directory => {
          const userIdString = directory?.userId ? directory.userId.toString() : "";

          const products: IProduct[] = directory.product 
              ? directory.product.map((product: IProduct) => ({
                  ...product,
                  productImage: product.productImage
                      ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, product.productImage])
                      : null
              })) 
              : [];

          return {
              ...directory,
              companyLogo: directory.companyLogo
                  ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, directory.companyLogo])
                  : null,
              product: products
          };
      }),
      totalCount: directories.length
  };
}

async getWebDirectoryById(webDirectoryId: string): Promise<IWebDirectoryBody | null> {
    // Find the document by its ID. Using .lean() returns a plain JS object.
    const webDirectory = await WebDirectoryModel.findById(webDirectoryId).lean();

    if (!webDirectory) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Web Directory not found.",
        {},
        false
      );
    }
    const userIdString = webDirectory.userId?.toString()
    // Update the companyLogo field using fileHelper
    if (webDirectory.companyLogo) {
      webDirectory.companyLogo = this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, webDirectory.companyLogo]);
    }

    // Update each product's productImage field
    if (Array.isArray(webDirectory.product)) {
      webDirectory.product = webDirectory.product.map((prod: any) => {
        if (prod.productImage) {
          return {
            ...prod,
            productImage: this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, prod.productImage]),
          };
        }
        return prod;
      });
    }

    return webDirectory;
  }

async updateWebDirectory(
    payload: Partial<IUpdateWebDirectoryBody>,
    webDirectoryId: string,
    files: any
  ): Promise<IUpdateWebDirectoryBody> {
    try {
      const { product, location, productIdToDelete, ...remainingPayload } = payload;

      // 🔹 Fetch existing Web Directory document
      const webDirectory = await WebDirectoryModel.findById(webDirectoryId);

      if (!webDirectory) {
        throw new ApiError(
          RESPONSE_CODE.NOT_FOUND,
          "Web Directory not found.",
          {},
          false
        );
      }

      // 🔹 Handle product deletion properly
      let idsToDelete: string[] = [];

      if (typeof productIdToDelete === "string") {
        try {
          idsToDelete = JSON.parse(productIdToDelete); // Parse stringified array
        } catch (error) {
          console.error("Error parsing productIdToDelete:", error);
        }
      } else if (Array.isArray(productIdToDelete)) {
        idsToDelete = productIdToDelete; // Use directly if already an array
      }

      console.log("Processed productIdToDelete:", idsToDelete);

      // 🔹 Convert productIdToDelete to valid MongoDB ObjectIds
      const validIds = idsToDelete
        .filter((id) => mongoose.Types.ObjectId.isValid(id)) // Only valid IDs
        .map((id) => new mongoose.Types.ObjectId(id));

      console.log("Valid Product IDs to delete:", validIds);

      if (validIds.length > 0) {
        // Find products to delete
        const productsToDelete = webDirectory.product.filter((prod: any) =>
          validIds.some((deleteId) => deleteId.equals(prod._id))
        );

        console.log("Matching products for deletion:", productsToDelete);

        // Delete product images from the file system
        productsToDelete.forEach((prod: any) => {
          if (prod.productImage) {
            let filePath = `uploads/webDirectory/${webDirectory.userId}/${prod.productImage}`;
            console.log(`Deleting file: ${filePath}`);
            this.fileHelper.deleteFile(filePath);
          }
        });

        // Remove deleted products from the database
        webDirectory.product = webDirectory.product.filter(
          (prod: any) => !validIds.some((deleteId) => deleteId.equals(prod._id))
        );
      }

      // 🔹 Handle new products
      if (Array.isArray(product)) {
        const newProducts = product.map((prod, index) => ({
          ...prod,
          _id: new mongoose.Types.ObjectId(), // Assign new ObjectId for new products
          productImage: files.productImage?.[index]?.filename || prod.productImage, // Preserve old image if no new one
        }));

        webDirectory.product = [...webDirectory.product, ...newProducts]; // Append new products
      }

      // 🔹 Handle company logo update
      if (files.companyLogo?.length > 0) {
        const newCompanyLogo = files.companyLogo[0].filename;

        // Delete old logo if it exists
        if (webDirectory.companyLogo) {
          let oldLogoPath = `uploads/webDirectory/${webDirectory.userId}/${webDirectory.companyLogo}`;
          this.fileHelper.deleteFile(oldLogoPath);
        }

        webDirectory.companyLogo = newCompanyLogo;
      }

      // 🔹 Handle location update
      if (location) {
        webDirectory.location = { ...webDirectory.location, ...location }; // Merge locations
      }

      // 🔹 Update other fields
      Object.assign(webDirectory, remainingPayload);

      // 🔹 Save updated document
      await webDirectory.save();

      return webDirectory;
    } catch (error: any) {
      console.error("Error updating Web Directory:", error.message);
      throw new Error(`Internal Server Error: ${error.message}`);
    }
  }

async activeInactiveWebDirectory(webDirectoryId: string, action: boolean) {


    const webDirectory_Id = toObjectId(webDirectoryId);
    const webDirectory = await WebDirectoryModel.findById(webDirectory_Id);


    if (!webDirectory) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Web Directory not found",
        {},
        false
      );
    }

    console.log(action, "action received");

    // Determine new status based on the action
    const newStatus = action ? WEBDIRECTORY_STATUS.ACTIVE : WEBDIRECTORY_STATUS.INACTIVE;

    // If user is already in the desired state, return early
    if (webDirectory.active === newStatus) {
      return {
        success: false,
        message: `User account is already ${action ? "active" : "deactivated"}.`,
      };
    }

    // Update user status
    await WebDirectoryModel.findByIdAndUpdate(webDirectoryId, { active: newStatus });

    return {
      success: true,
      message: `Web Directory has been ${action ? "activated" : "deactivated"} successfully.`,
    };

  }

}

