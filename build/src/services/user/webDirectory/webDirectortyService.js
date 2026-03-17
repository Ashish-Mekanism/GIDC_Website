"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebDirectoryService = void 0;
const WebDirectory_1 = __importDefault(require("../../../models/WebDirectory"));
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const constants_1 = require("../../../utils/constants");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
class WebDirectoryService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createWebDirectory(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
            const webDirectoryExists = yield WebDirectory_1.default.findOne({ userId: user_id });
            if (webDirectoryExists) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Web Directory already exists", {}, false);
            }
            // Type-cast or assert product to IProduct[] if needed:
            const products = payload.product || [];
            // Map over the products to attach the corresponding file name.
            const mappedProducts = products.map((prod, index) => {
                // Get the product image filename from files.
                const productImage = files.productImage && files.productImage[index]
                    ? files.productImage[index].filename
                    : undefined;
                return Object.assign(Object.assign({}, prod), { // Spread the product fields
                    productImage });
            });
            // Get company logo filename from files.
            const companyLogo = files.companyLogo && files.companyLogo.length > 0
                ? files.companyLogo[0].filename
                : undefined;
            // Map the 'location' field from payload to 'locationDetails'
            const locationDetails = payload.location || {};
            // Build the final data object ensuring the key matches the schema.
            const webDirectoryData = Object.assign(Object.assign({}, payload), { // Spread the remaining fields
                companyLogo, product: mappedProducts, userId: user_id, location: locationDetails, active: constants_1.WEBDIRECTORY_STATUS.ACTIVE });
            // Save to database using your Mongoose model
            const createdDocument = yield WebDirectory_1.default.create(webDirectoryData);
            return createdDocument;
        });
    }
    getWebDirectory(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Find the document by its ID. Using .lean() returns a plain JS object.
            let webDirectory = yield WebDirectory_1.default.findOne({ userId: userid }).lean();
            // If not found, try searching by _id
            if (!webDirectory) {
                webDirectory = yield WebDirectory_1.default.findOne({ _id: userid }).lean();
            }
            if (!webDirectory) {
                // You might want to throw an error or return null if not found.
                throw new Error("Web Directory not found");
            }
            if (webDirectory.active === false) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Web Directory is Inactive');
            }
            const userIdString = (_a = webDirectory.userId) === null || _a === void 0 ? void 0 : _a.toString();
            // Update the companyLogo field using fileHelper
            if (webDirectory.companyLogo) {
                webDirectory.companyLogo = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.WEBDIRECTORY, [userIdString, webDirectory.companyLogo]);
            }
            // Update each product's productImage field
            if (Array.isArray(webDirectory.product)) {
                webDirectory.product = webDirectory.product.map((prod) => {
                    if (prod.productImage) {
                        return Object.assign(Object.assign({}, prod), { productImage: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.WEBDIRECTORY, [userIdString, prod.productImage]) });
                    }
                    return prod;
                });
            }
            return webDirectory;
        });
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
    updateWebDirectory(payload, webDirectoryId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { product, location, productIdToDelete } = payload, remainingPayload = __rest(payload, ["product", "location", "productIdToDelete"]);
                // 🔹 Fetch existing Web Directory document
                const webDirectory = yield WebDirectory_1.default.findById(webDirectoryId);
                if (!webDirectory) {
                    throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Web Directory not found.", {}, false);
                }
                // 🔹 Handle product deletion properly
                let idsToDelete = [];
                if (typeof productIdToDelete === "string") {
                    try {
                        idsToDelete = JSON.parse(productIdToDelete); // Parse stringified array
                    }
                    catch (error) {
                        console.error("Error parsing productIdToDelete:", error);
                    }
                }
                else if (Array.isArray(productIdToDelete)) {
                    idsToDelete = productIdToDelete; // Use directly if already an array
                }
                console.log("Processed productIdToDelete:", idsToDelete);
                // 🔹 Convert productIdToDelete to valid MongoDB ObjectIds
                const validIds = idsToDelete
                    .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id)) // Only valid IDs
                    .map((id) => new mongoose_1.default.Types.ObjectId(id));
                console.log("Valid Product IDs to delete:", validIds);
                if (validIds.length > 0) {
                    // Find products to delete
                    const productsToDelete = webDirectory.product.filter((prod) => validIds.some((deleteId) => deleteId.equals(prod._id)));
                    console.log("Matching products for deletion:", productsToDelete);
                    // Delete product images from the file system
                    productsToDelete.forEach((prod) => {
                        if (prod.productImage) {
                            let filePath = `uploads/webDirectory/${webDirectory.userId}/${prod.productImage}`;
                            console.log(`Deleting file: ${filePath}`);
                            this.fileHelper.deleteFile(filePath);
                        }
                    });
                    // Remove deleted products from the database
                    webDirectory.product = webDirectory.product.filter((prod) => !validIds.some((deleteId) => deleteId.equals(prod._id)));
                }
                // 🔹 Handle new products
                if (Array.isArray(product)) {
                    const newProducts = product.map((prod, index) => {
                        var _a, _b;
                        return (Object.assign(Object.assign({}, prod), { _id: new mongoose_1.default.Types.ObjectId(), productImage: ((_b = (_a = files.productImage) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.filename) || prod.productImage }));
                    });
                    webDirectory.product = [...webDirectory.product, ...newProducts]; // Append new products
                }
                // 🔹 Handle company logo update
                if (((_a = files.companyLogo) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
                    webDirectory.location = Object.assign(Object.assign({}, webDirectory.location), location); // Merge locations
                }
                // 🔹 Update other fields
                Object.assign(webDirectory, remainingPayload);
                // 🔹 Save updated document
                yield webDirectory.save();
                return webDirectory;
            }
            catch (error) {
                console.error("Error updating Web Directory:", error.message);
                throw new Error(`Internal Server Error: ${error.message}`);
            }
        });
    }
}
exports.WebDirectoryService = WebDirectoryService;
