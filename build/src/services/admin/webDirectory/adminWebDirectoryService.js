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
exports.AdminWebDirectoryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WebDirectory_1 = __importDefault(require("../../../models/WebDirectory"));
const constants_1 = require("../../../utils/constants");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const helper_1 = require("../../../utils/helper");
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const config_1 = __importDefault(require("../../../config"));
class AdminWebDirectoryService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    adminCreateWebDirectory(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
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
                companyLogo, product: mappedProducts, created_by: user_id, userId: user_id, location: locationDetails, active: constants_1.WEBDIRECTORY_STATUS.ACTIVE });
            // Save to database using your Mongoose model
            const createdDocument = yield WebDirectory_1.default.create(webDirectoryData);
            return createdDocument;
        });
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
    getWebDirectoryList() {
        return __awaiter(this, void 0, void 0, function* () {
            const directories = yield WebDirectory_1.default.aggregate([
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
                                config_1.default.FE_BASE_URL,
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
                    const userIdString = (directory === null || directory === void 0 ? void 0 : directory.userId) ? directory.userId.toString() : "";
                    const products = directory.product
                        ? directory.product.map((product) => (Object.assign(Object.assign({}, product), { productImage: product.productImage
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.WEBDIRECTORY, [userIdString, product.productImage])
                                : null })))
                        : [];
                    return Object.assign(Object.assign({}, directory), { companyLogo: directory.companyLogo
                            ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.WEBDIRECTORY, [userIdString, directory.companyLogo])
                            : null, product: products });
                }),
                totalCount: directories.length
            };
        });
    }
    getWebDirectoryById(webDirectoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Find the document by its ID. Using .lean() returns a plain JS object.
            const webDirectory = yield WebDirectory_1.default.findById(webDirectoryId).lean();
            if (!webDirectory) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Web Directory not found.", {}, false);
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
    activeInactiveWebDirectory(webDirectoryId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const webDirectory_Id = (0, helper_1.toObjectId)(webDirectoryId);
            const webDirectory = yield WebDirectory_1.default.findById(webDirectory_Id);
            if (!webDirectory) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Web Directory not found", {}, false);
            }
            console.log(action, "action received");
            // Determine new status based on the action
            const newStatus = action ? constants_1.WEBDIRECTORY_STATUS.ACTIVE : constants_1.WEBDIRECTORY_STATUS.INACTIVE;
            // If user is already in the desired state, return early
            if (webDirectory.active === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? "active" : "deactivated"}.`,
                };
            }
            // Update user status
            yield WebDirectory_1.default.findByIdAndUpdate(webDirectoryId, { active: newStatus });
            return {
                success: true,
                message: `Web Directory has been ${action ? "activated" : "deactivated"} successfully.`,
            };
        });
    }
}
exports.AdminWebDirectoryService = AdminWebDirectoryService;
