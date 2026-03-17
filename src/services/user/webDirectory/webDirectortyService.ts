
import { IProduct, IUpdateWebDirectoryBody, IWebDirectoryBody } from "../../../types/requests";
import WebDirectoryModel from "../../../models/WebDirectory";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import { FOLDER_NAMES, RESPONSE_CODE, WEBDIRECTORY_STATUS } from "../../../utils/constants";
import { log } from "winston";
import ApiError from "../../../utils/ApiError";
import mongoose, { ObjectId } from "mongoose";
export class WebDirectoryService {
  fileHelper = new FileHelper();
  fileService = new FileService();


  async createWebDirectory(
    payload: Partial<IWebDirectoryBody>,
    user_id: ObjectId,
    files: any
  ): Promise<IWebDirectoryBody> {

    const webDirectoryExists = await WebDirectoryModel.findOne({ userId: user_id });
    if (webDirectoryExists) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Web Directory already exists", {}, false);
    }
  
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
      userId: user_id,
      location: locationDetails, // Use locationDetails instead of location
      active:WEBDIRECTORY_STATUS.ACTIVE,
    };

    // Save to database using your Mongoose model
    const createdDocument = await WebDirectoryModel.create(webDirectoryData);
    return createdDocument;
  }



  async getWebDirectory(userid: ObjectId|string): Promise<IWebDirectoryBody | null> {
    // Find the document by its ID. Using .lean() returns a plain JS object.
    let webDirectory = await WebDirectoryModel.findOne({userId:userid}).lean();
    
      // If not found, try searching by _id
      if (!webDirectory) {
        webDirectory = await WebDirectoryModel.findOne({ _id: userid }).lean();
    }

    if (!webDirectory) {
      // You might want to throw an error or return null if not found.
      throw new Error("Web Directory not found");
    }

    if(webDirectory.active === false) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Web Directory is Inactive');
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


//   async getWebDirectory(webDirectoryId: string): Promise<IWebDirectoryBody | null> {
//     // 1️⃣ Fetch the document and convert to a plain object using `.lean()`
//     const webDirectory = await WebDirectoryModel.findById(webDirectoryId).lean();

//     if (!webDirectory) {
//       throw new Error("WebDirectory not found");
//     }

//     // 2️⃣ Convert `userId` and `_id` to strings
//     const userIdString = webDirectory.userId ? webDirectory.userId.toString() : "";

//     // 3️⃣ Ensure `companyLogo` field has the correct file path
//     const companyLogoPath = webDirectory.companyLogo
//       ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, webDirectory.companyLogo])
//       : undefined;

//     // 4️⃣ Convert `product` array to ensure `_id` and `productImage` are properly formatted
//     const formattedProducts = Array.isArray(webDirectory.product)
//       ? webDirectory.product.map((prod: any) => ({
//           _id: prod._id?.toString(), // Convert ObjectId to string
//           productName: prod.productName,
//           productImage: prod.productImage
//             ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.WEBDIRECTORY, [userIdString, prod.productImage])
//             : undefined
//         }))
//       : [];

//     // 5️⃣ Return the properly formatted object
//     return {
//       ...webDirectory,
//       companyLogo: companyLogoPath, // Assign updated logo path
//       product: formattedProducts // Assign formatted product array
//     };
// }



// async updateWebDirectory(
//   payload: Partial<IUpdateWebDirectoryBody> & { _id: string; productIdToDelete?: string[] },
//   webDirectoryId: string,
//   files: any
// ): Promise<IUpdateWebDirectoryBody | null> {
//   const {productIdToDelete,product,location,...remaingPayload} = payload
//   // 🔹 Fetch existing Web Directory document
//   const webDirectory = await WebDirectoryModel.findById(webDirectoryId);
//   if (!webDirectory) {
//     throw new Error("Web Directory not found.");
//   }

//   // 🔹 Ensure `productIdToDelete` is an array of strings
//   const productIdsToDelete = (productIdToDelete || []).map(id => id.toString());

//   // 🔹 Handle deletion of products if `productIdToDelete` is provided
//   if (productIdsToDelete.length > 0) {
//     const deletedProducts = webDirectory.product.filter((p: any) =>
//       productIdsToDelete.includes(p._id.toString())
//     );

//     // 🔹 Delete product images using fileHelper
//     deletedProducts.forEach((prod) => {
//       if (prod.productImage) {
//         let oldFilePath = `uploads/webDirectory/${webDirectory.userId}/${prod.productImage}`;
//         this.fileHelper.deleteFile(oldFilePath);
//       }
//     });

//     // 🔹 Remove deleted products from the product array
//     webDirectory.product = webDirectory.product.filter(
//       (p: any) => !productIdsToDelete.includes(p._id.toString())
//     );
//   }

//   // 🔹 Handle new products (productName and productImage)
//   if (product && Array.isArray(product)) {
//     // Map over the products to attach the productImage filename
//     const mappedProducts = product.map((prod, index) => {
//       const productName = prod.productName;
//       const productImage = files.productImage && files.productImage[index]?.filename;


//       if (productName && productImage) {
//         return {
//           ...prod, // Spread the product fields
//           productImage, // Attach the filename
//         };
//       }
//       return prod;
//     });

//     console.log(mappedProducts,'mapped')
//     // Add new products to the existing products array
//     webDirectory.product = [ ...mappedProducts];
//   }

//   // 🔹 Handle company logo update (if a new logo is provided)
//   if (files.companyLogo && files.companyLogo.length > 0) {
//     // Get the new logo filename
//     const newCompanyLogo = files.companyLogo[0].filename;

//     // Delete old logo if it exists
//     if (webDirectory.companyLogo) {
//       let oldLogoPath = `uploads/webDirectory/${webDirectory.userId}/${webDirectory.companyLogo}`;
//       this.fileHelper.deleteFile(oldLogoPath);
//     }

//     // Update company logo name in the database
//     webDirectory.companyLogo = newCompanyLogo;
//   }

//   // 🔹 Handle location update (preserve existing fields that are not updated)
//   if (location) {
//     // Merge the existing location with the updated fields
//     webDirectory.location = {
//       ...webDirectory.location,   // Keep existing location fields
//       ...location        // Only update provided fields
//     };
//   }

//   // 🔹 Update other fields from the payload (e.g., companyName, emails, etc.)
//   Object.assign(webDirectory, remaingPayload);

//   // 🔹 Save the updated document
//   await webDirectory.save();

//   return webDirectory;
// }



// async updateWebDirectory(
//   payload: Partial<IUpdateWebDirectoryBody>,
//   webDirectoryId: string,
//   files: any
// ): Promise<IUpdateWebDirectoryBody | null> {
//   const { product, location, ...remaingPayload } = payload;
  
//   // 🔹 Fetch existing Web Directory document
//   const webDirectory = await WebDirectoryModel.findById(webDirectoryId);
//   if (!webDirectory) {
//     throw new Error("Web Directory not found.");
//   }

//   // 🔹 Delete all products and associated product images
//   if (webDirectory.product && webDirectory.product.length > 0) {
//     // 🔹 Delete product images using fileHelper
//     webDirectory.product.forEach((prod: any) => {
//       if (prod.productImage) {
//         let oldFilePath = `uploads/webDirectory/${webDirectory.userId}/${prod.productImage}`;
//         this.fileHelper.deleteFile(oldFilePath);
//       }
//     });

//     // 🔹 Clear the product array
//     webDirectory.product = [];
//   }

//   // 🔹 Handle new products (productName and productImage)
//   if (product && Array.isArray(product)) {
//     // Map over the products to attach the productImage filename
//     const mappedProducts = product.map((prod, index) => {
//       const productName = prod.productName;
//       const productImage = files.productImage && files.productImage[index]?.filename;

//       if (productName && productImage) {
//         return {
//           ...prod, // Spread the product fields
//           productImage, // Attach the filename
//         };
//       }
//       return prod;
//     });

//     console.log(mappedProducts, 'mapped')
//     // Add new products to the existing products array
//     webDirectory.product = [...mappedProducts];
//   }

//   // 🔹 Handle company logo update (if a new logo is provided)
//   if (files.companyLogo && files.companyLogo.length > 0) {
//     // Get the new logo filename
//     const newCompanyLogo = files.companyLogo[0].filename;

//     // Delete old logo if it exists
//     if (webDirectory.companyLogo) {
//       let oldLogoPath = `uploads/webDirectory/${webDirectory.userId}/${webDirectory.companyLogo}`;
//       this.fileHelper.deleteFile(oldLogoPath);
//     }

//     // Update company logo name in the database
//     webDirectory.companyLogo = newCompanyLogo;
//   }

//   // 🔹 Handle location update (preserve existing fields that are not updated)
//   if (location) {
//     // Merge the existing location with the updated fields
//     webDirectory.location = {
//       ...webDirectory.location,   // Keep existing location fields
//       ...location        // Only update provided fields
//     };
//   }

//   // 🔹 Update other fields from the payload (e.g., companyName, emails, etc.)
//   Object.assign(webDirectory, remaingPayload);

//   // 🔹 Save the updated document
//   await webDirectory.save();

//   return webDirectory;
// }


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








  
 
  



  
  
  


}