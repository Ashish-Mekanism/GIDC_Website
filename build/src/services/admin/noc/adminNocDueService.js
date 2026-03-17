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
exports.AdminNocDueService = void 0;
const NocNoDue_1 = __importDefault(require("../../../models/NocNoDue"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const User_1 = __importDefault(require("../../../models/User"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
class AdminNocDueService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    getNocList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all NOC complaints from the NocFormModel collection
            const nocs = yield NocNoDue_1.default.find().sort({ createdAt: -1 }).lean();
            return {
                data: nocs.map((noc) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const userIdString = (noc === null || noc === void 0 ? void 0 : noc.userId) ? noc.userId.toString() : "";
                    return Object.assign(Object.assign({}, noc), { attachments: {
                            applicationLetter: ((_a = noc.attachments) === null || _a === void 0 ? void 0 : _a.applicationLetter)
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                    userIdString,
                                    noc.attachments.applicationLetter,
                                ])
                                : null,
                            waterBill: ((_b = noc.attachments) === null || _b === void 0 ? void 0 : _b.waterBill)
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                    userIdString,
                                    noc.attachments.waterBill,
                                ])
                                : null,
                            lightBill: ((_c = noc.attachments) === null || _c === void 0 ? void 0 : _c.lightBill)
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                    userIdString,
                                    noc.attachments.lightBill,
                                ])
                                : null,
                            taxBill: ((_d = noc.attachments) === null || _d === void 0 ? void 0 : _d.taxBill)
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                    userIdString,
                                    noc.attachments.taxBill,
                                ])
                                : null,
                            otherDocumentImage: ((_e = noc.attachments) === null || _e === void 0 ? void 0 : _e.otherDocumentImage)
                                ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                    userIdString,
                                    noc.attachments.otherDocumentImage,
                                ])
                                : null,
                            otherDocumentName: ((_f = noc.attachments) === null || _f === void 0 ? void 0 : _f.otherDocumentName) || null,
                        }, chequeDetails: noc.chequeDetails
                            ? Object.assign(Object.assign({}, noc.chequeDetails), { chequePhoto: ((_g = noc.chequeDetails) === null || _g === void 0 ? void 0 : _g.chequePhoto)
                                    ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [
                                        userIdString,
                                        noc.chequeDetails.chequePhoto,
                                    ])
                                    : null }) : null });
                }),
                totalCount: nocs.length,
            };
        });
    }
    // async getNocDetails(nocId: string): Promise<INocForm | null> {
    //   // Retrieve the NOC document from the database
    //   const noc = await NocFormModel.findById(nocId).lean<INocForm>();
    //   if (!noc) {
    //     throw new ApiError(RESPONSE_CODE.NOT_FOUND, "NOC not found");
    //   }
    //   const user = await User.findById(noc?.userId).lean().select("user_name");
    //   const userName = user?.user_name || "-";
    //   const createdByIdString = noc.userId?.toString() || "";
    //   // If attachments exist, update file paths
    //   if (noc.attachments) {
    //     const attachmentFileNames = [
    //       "applicationLetter",
    //       "waterBill",
    //       "lightBill",
    //       "taxBill",
    //     ];
    //     Object.keys(noc.attachments).forEach((key) => {
    //       if (attachmentFileNames.includes(key)) {
    //         // Exclude `otherDocumentName`
    //         const fileName = (noc.attachments as any)[key];
    //         if (fileName) {
    //           (noc.attachments as any)[key] =
    //             this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
    //               createdByIdString,
    //               fileName,
    //             ]);
    //         }
    //       }
    //     });
    //   }
    //   // If chequeDetails exist, update chequePhoto file path
    //   if (noc.chequeDetails && noc.chequeDetails.chequePhoto) {
    //     noc.chequeDetails.chequePhoto = this.fileService.getFilePathFromDatabase(
    //       FOLDER_NAMES.NOC,
    //       [createdByIdString, noc.chequeDetails.chequePhoto]
    //     );
    //   }
    //   return { ...noc, user_name: userName };
    // }
    // async updateNoc(
    //   nocId: string,
    //   payload: IUpdateNocFormBody
    // ): Promise<INocForm | null> {
    //   // Update only the userContribution field
    //   log(payload, 'payload');
    //   const updatedNoc = await NocFormModel.findByIdAndUpdate(
    //     nocId,
    //     { $set: { userContribution: payload.userContribution } },
    //     { new: true }
    //   ).lean<INocForm>();
    //   if (!updatedNoc) {
    //     throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'NOC not found');
    //   }
    //   return updatedNoc;
    // }
    //   async addNocUserContribution(payload: IAddNocFormUserContributionBody): Promise<INocForm[]> {
    //     const { userContribution } = payload;
    //     const { plotNo: userPlotNo } = userContribution;
    //     console.log(userPlotNo, "userPlotNo");
    //     // Find all NOC records that contain the user's plotNo in their plotNo field
    //     const nocRecords = await NocFormModel.find({
    //       plotNo: {
    //         $regex: new RegExp(`\\b${userPlotNo}\\b`, 'i') // Word boundary match to avoid partial matches
    //       }
    //     }).lean<INocForm[]>();
    //     if (!nocRecords || nocRecords.length === 0) {
    //       throw new ApiError(RESPONSE_CODE.NOT_FOUND, `No NOC records found for plot number: ${userPlotNo}`);
    //     }
    //     const updatedNocRecords: INocForm[] = [];
    //     // Update each matching NOC record
    //     for (const nocRecord of nocRecords) {
    //       // Check if userContribution array exists, if not initialize it
    //       const updatedNoc = await NocFormModel.findByIdAndUpdate(
    //         nocRecord._id,
    //         {
    //           $push: {
    //             userContribution: userContribution
    //           }
    //         },
    //         { new: true }
    //       ).lean<INocForm>();
    //       if (updatedNoc) {
    //         updatedNocRecords.push(updatedNoc);
    //       }
    //     }
    //     if (updatedNocRecords.length === 0) {
    //       throw new ApiError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to update NOC records');
    //     }
    //     return updatedNocRecords;
    //   }
    getNocDetails(nocId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const noc = yield NocNoDue_1.default.findById(nocId).lean();
            if (!noc) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "NOC not found");
            }
            const user = yield User_1.default.findById(noc.userId).lean().select("user_name");
            const userName = (user === null || user === void 0 ? void 0 : user.user_name) || "-";
            const createdByIdString = ((_a = noc.userId) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            /** ------------------------------
             * PROCESS ATTACHMENTS
             * ------------------------------ */
            if (noc.attachments) {
                const attachmentKeys = [
                    "applicationLetter",
                    "waterBill",
                    "lightBill",
                    "taxBill",
                    "otherDocumentImage",
                ];
                attachmentKeys.forEach((key) => {
                    const value = noc.attachments[key];
                    if (!value)
                        return;
                    // NEW FORMAT → { _id, fileName }
                    if (typeof value === "object" && value.fileName) {
                        const fileUrl = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [createdByIdString, value.fileName]);
                        noc.attachments[key] = {
                            _id: value._id || null,
                            fileName: value.fileName,
                            fileUrl,
                        };
                    }
                    // OLD FORMAT → "filename.jpg"
                    else if (typeof value === "string") {
                        const fileUrl = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [createdByIdString, value]);
                        noc.attachments[key] = {
                            _id: null,
                            fileName: value,
                            fileUrl,
                        };
                    }
                });
            }
            /** ------------------------------
             * PROCESS CHEQUE PHOTO
             * ------------------------------ */
            if ((_b = noc.chequeDetails) === null || _b === void 0 ? void 0 : _b.chequePhoto) {
                const cheque = noc.chequeDetails.chequePhoto;
                // NEW FORMAT
                if (typeof cheque === "object" && cheque !== null && cheque.fileName) {
                    noc.chequeDetails.chequePhoto = {
                        _id: cheque._id || null,
                        fileName: cheque.fileName,
                        fileUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [createdByIdString, cheque.fileName]),
                    };
                }
                // OLD FORMAT
                else if (typeof cheque === "string") {
                    noc.chequeDetails.chequePhoto = {
                        _id: null,
                        fileName: cheque,
                        fileUrl: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.NOC, [createdByIdString, cheque]),
                    };
                }
            }
            return Object.assign(Object.assign({}, noc), { user_name: userName });
        });
    }
    // async updateNoc(
    //   nocId: string,
    //   payload: any,
    //   files?: Record<string, Express.Multer.File[]>
    // ) {
    //   /* ---------------------------------------------------------
    //      1. Sanitize attachmentIdsDelete (string → array)
    //   --------------------------------------------------------- */
    //   let { attachmentIdsDelete = [], ...updateData } = payload;
    //   if (typeof attachmentIdsDelete === "string") {
    //     try {
    //       attachmentIdsDelete = JSON.parse(attachmentIdsDelete);
    //     } catch (err) {
    //       console.log("Invalid attachmentIdsDelete:", attachmentIdsDelete);
    //       attachmentIdsDelete = [];
    //     }
    //   }
    //   /* ---------------------------------------------------------
    //      2. Fetch NOC
    //   --------------------------------------------------------- */
    //   const noc = await NocFormModel.findById(nocId);
    //   if (!noc) throw new Error("NOC not found");
    //   const userId = noc.userId.toString();
    //   const userFolderPath = path.join("uploads", "noc", userId);
    //   /* ---------------------------------------------------------
    //      3. Helper: Valid file attachment
    //   --------------------------------------------------------- */
    //   function isFileAttachment(obj: any) {
    //     return (
    //       obj &&
    //       typeof obj === "object" &&
    //       "_id" in obj &&
    //       obj._id &&
    //       "fileName" in obj &&
    //       typeof obj.fileName === "string"
    //     );
    //   }
    //   /* ---------------------------------------------------------
    //      4. DELETE ATTACHMENTS (DB + filesystem)
    //   --------------------------------------------------------- */
    //   for (const deleteId of attachmentIdsDelete) {
    //     const delIdStr = deleteId.toString();
    //     const sections = ["attachments", "chequeDetails"] as const;
    //     for (const section of sections) {
    //       const secObj = (noc as any)[section];
    //       if (!secObj) continue;
    //       for (const key of Object.keys(secObj)) {
    //         const item = secObj[key];
    //         if (!isFileAttachment(item)) continue; // IMPORTANT: skip non-file fields
    //         if (item._id.toString() === delIdStr) {
    //           const filePath = path.join(userFolderPath, item.fileName);
    //           if (fs.existsSync(filePath)) {
    //             console.log("Deleting old file:", filePath);
    //             fs.unlinkSync(filePath);
    //           }
    //           secObj[key] = null; // remove from DB
    //         }
    //       }
    //     }
    //   }
    //   /* ---------------------------------------------------------
    //      5. SAVE NEW UPLOADED FILES
    //   --------------------------------------------------------- */
    //   if (files) {
    //     for (const [fieldName, fileArr] of Object.entries(files)) {
    //       const file = fileArr[0];
    //       if (!file) continue;
    //       // fieldName example: attachments[waterBill]
    //       const dbKey = FIELD_MAP[fieldName as keyof typeof FIELD_MAP];
    //       if (!dbKey) continue;
    //       const newAttachment = {
    //         _id: new mongoose.Types.ObjectId(),
    //         fileName: file.filename,
    //       };
    //       // Attach inside attachments
    //       if (noc.attachments?.hasOwnProperty(dbKey)) {
    //         (noc.attachments as any)[dbKey] = newAttachment;
    //       }
    //       // Attach inside chequeDetails
    //       if (noc.chequeDetails?.hasOwnProperty(dbKey)) {
    //         (noc.chequeDetails as any)[dbKey] = newAttachment;
    //       }
    //     }
    //   }
    //   /* ---------------------------------------------------------
    //      6. UPDATE NORMAL TEXT FIELDS
    //   --------------------------------------------------------- */
    //   for (const [key, value] of Object.entries(updateData)) {
    //     if (["attachments", "chequeDetails","userContribution"].includes(key)) continue;
    //     if (value === null || value === undefined) continue;
    //     (noc as any)[key] = value;
    //   }
    // /* ---------------------------------
    //    UPDATE chequeDetails (dot notation)
    // ----------------------------------- */
    // const chequeUpdates = extractDot("chequeDetails", updateData);
    // if (Object.keys(chequeUpdates).length > 0) {
    //   for (const [key, value] of Object.entries(chequeUpdates)) {
    //     (noc.chequeDetails as any)[key] = value;
    //   }
    // }
    // /* ---------------------------------
    //    UPDATE userContribution (dot notation)
    // ----------------------------------- */
    // const ucUpdates = extractDot("userContribution", updateData);
    // if (Object.keys(ucUpdates).length > 0) {
    //   for (const [key, value] of Object.entries(ucUpdates)) {
    //     (noc.userContribution as any)[key] = value;
    //   }
    // }
    //   await noc.save();
    //   return noc;
    // }
    updateNoc(nocId, payload, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            /* -----------------------------------
               1. Parse attachmentIdsDelete
            --------------------------------------*/
            let { attachmentIdsDelete = [] } = payload, updateData = __rest(payload, ["attachmentIdsDelete"]);
            if (typeof attachmentIdsDelete === "string") {
                try {
                    attachmentIdsDelete = JSON.parse(attachmentIdsDelete);
                }
                catch (_c) {
                    attachmentIdsDelete = [];
                }
            }
            /* -----------------------------------
               2. Get NOC
            --------------------------------------*/
            const noc = yield NocNoDue_1.default.findById(nocId);
            if (!noc)
                throw new Error("NOC not found");
            const userId = noc.userId.toString();
            const userFolderPath = path_1.default.join("uploads", "noc", userId);
            /* -----------------------------------
               3. Helper: file attachment type check
            --------------------------------------*/
            function isFileAttachment(obj) {
                return obj && typeof obj === "object" && obj._id && obj.fileName;
            }
            /* -----------------------------------
               4. Delete attachments
            --------------------------------------*/
            for (const delId of attachmentIdsDelete) {
                const delIdStr = delId.toString();
                const sections = ["attachments", "chequeDetails"];
                for (const section of sections) {
                    const secObj = noc[section];
                    if (!secObj)
                        continue;
                    for (const key of Object.keys(secObj)) {
                        const item = secObj[key];
                        if (!isFileAttachment(item))
                            continue;
                        if (item._id.toString() === delIdStr) {
                            const filePath = path_1.default.join(userFolderPath, item.fileName);
                            if (fs_1.default.existsSync(filePath))
                                fs_1.default.unlinkSync(filePath);
                            secObj[key] = null;
                        }
                    }
                }
            }
            /* -----------------------------------
               5. Save new uploaded files
            --------------------------------------*/
            if (files) {
                for (const [fieldName, arr] of Object.entries(files)) {
                    const file = arr[0];
                    if (!file)
                        continue;
                    const newAttachment = {
                        _id: new mongoose_1.default.Types.ObjectId(),
                        fileName: file.filename,
                    };
                    // find correct db key from fieldName
                    const dbKey = FIELD_MAP[fieldName];
                    if (!dbKey)
                        continue;
                    if ((_a = noc.attachments) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(dbKey)) {
                        noc.attachments[dbKey] = newAttachment;
                    }
                    if ((_b = noc.chequeDetails) === null || _b === void 0 ? void 0 : _b.hasOwnProperty(dbKey)) {
                        noc.chequeDetails[dbKey] = newAttachment;
                    }
                }
            }
            /* -----------------------------------
               6. Update simple fields (NOT nested)
            --------------------------------------*/
            for (const [key, value] of Object.entries(updateData)) {
                if (["attachments", "chequeDetails", "userContribution"].includes(key))
                    continue;
                noc[key] = value;
            }
            /* -----------------------------------
               7. Dot-notation updater for nested fields
            --------------------------------------*/
            function applyNested(obj, pathStr, value) {
                const keys = pathStr.split(".");
                let temp = obj;
                while (keys.length > 1) {
                    const k = keys.shift();
                    if (!temp[k])
                        temp[k] = {};
                    temp = temp[k];
                }
                temp[keys[0]] = value;
            }
            /* -----------------------------------
               8. Flatten payload into dot notation
            --------------------------------------*/
            function flatten(obj, prefix = "", res = {}) {
                for (const key of Object.keys(obj)) {
                    const val = obj[key];
                    const newKey = prefix ? `${prefix}.${key}` : key;
                    if (val && typeof val === "object" && !Array.isArray(val)) {
                        flatten(val, newKey, res);
                    }
                    else {
                        res[newKey] = val;
                    }
                }
                return res;
            }
            const flat = flatten(updateData);
            /* -----------------------------------
               9. Apply attachment nested values
            --------------------------------------*/
            for (const [pathStr, val] of Object.entries(flat)) {
                if (pathStr.startsWith("attachments.")) {
                    const cleanPath = pathStr.replace("attachments.", "");
                    applyNested(noc.attachments, cleanPath, val);
                }
            }
            /* -----------------------------------
               10. User Contribution
            --------------------------------------*/
            for (const [pathStr, val] of Object.entries(flat)) {
                if (pathStr.startsWith("userContribution.")) {
                    const cleanPath = pathStr.replace("userContribution.", "");
                    applyNested(noc.userContribution, cleanPath, val);
                }
            }
            /* -----------------------------------
               11. Cheque Details
            --------------------------------------*/
            for (const [pathStr, val] of Object.entries(flat)) {
                if (pathStr.startsWith("chequeDetails.")) {
                    const cleanPath = pathStr.replace("chequeDetails.", "");
                    applyNested(noc.chequeDetails, cleanPath, val);
                }
            }
            /* -----------------------------------
               12. Save final NOC
            --------------------------------------*/
            yield noc.save();
            return noc;
        });
    }
    addNocUserContribution(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userContribution } = payload;
            const { plotNo: userPlotNo } = userContribution;
            console.log(userPlotNo, "userPlotNo");
            // Split the user's plot numbers (handle comma-separated values)
            const userPlotNumbers = userPlotNo
                .split(",")
                .map((plot) => plot.trim())
                .filter((plot) => plot);
            if (userPlotNumbers.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "No valid plot numbers provided");
            }
            // Create regex patterns for each plot number to match in NOC records
            const plotNumberConditions = userPlotNumbers.map((plotNum) => ({
                plotNo: {
                    $regex: new RegExp(`(^|,)\\s*${plotNum}\\s*(,|$)`, "i"),
                },
            }));
            // Find all NOC records that contain any of the user's plot numbers
            const nocRecords = yield NocNoDue_1.default.find({
                $or: plotNumberConditions,
            }).lean();
            if (!nocRecords || nocRecords.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, `No NOC records found for plot numbers: ${userPlotNumbers.join(", ")}`);
            }
            const updatedNocRecords = [];
            // Update each matching NOC record
            for (const nocRecord of nocRecords) {
                const updatedNoc = yield NocNoDue_1.default.findByIdAndUpdate(nocRecord._id, {
                    $set: {
                        userContribution: userContribution,
                    },
                }, { new: true }).lean();
                if (updatedNoc) {
                    updatedNocRecords.push(updatedNoc);
                }
            }
            if (updatedNocRecords.length === 0) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.INTERNAL_SERVER_ERROR, "Failed to update NOC records");
            }
            return updatedNocRecords;
        });
    }
    // async getNocUserContributionList(): Promise<any> {
    //   // Fetch only specific fields from NOC documents
    //   const nocs = await NocFormModel.find(
    //     {},
    //     {
    //       _id: 1,
    //       userId: 1,
    //       refNo: 1,
    //       userContribution: 1,
    //     }
    //   ).lean();
    //   return {
    //     data: nocs,
    //     totalCount: nocs.length,
    //   };
    // }
    getNocUserContributionList() {
        return __awaiter(this, void 0, void 0, function* () {
            const nocs = yield NocNoDue_1.default.find({}, {
                _id: 1,
                userId: 1,
                refNo: 1,
                userContribution: 1,
            })
                .sort({ createdAt: -1 }) // 🔥 Latest first
                .lean();
            return {
                data: nocs,
                totalCount: nocs.length,
            };
        });
    }
    deleteNoc(nocId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedNoc = yield NocNoDue_1.default.findByIdAndDelete(nocId);
            if (!deletedNoc) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "NOC not found");
            }
        });
    }
}
exports.AdminNocDueService = AdminNocDueService;
/* ---------------------------------------------------------
   FILE FIELD MAP
--------------------------------------------------------- */
const FIELD_MAP = {
    "attachments[applicationLetter]": "applicationLetter",
    "attachments[waterBill]": "waterBill",
    "attachments[lightBill]": "lightBill",
    "attachments[taxBill]": "taxBill",
    "attachments[otherDocumentImage]": "otherDocumentImage",
    "chequeDetails[chequePhoto]": "chequePhoto",
};
function flattenObject(obj, prefix = "") {
    let result = {};
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, path));
        }
        else {
            result[path] = value;
        }
    }
    return result;
}
