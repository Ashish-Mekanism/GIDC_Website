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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubTelephoneService = void 0;
const SubTelephone_1 = __importDefault(require("../../../models/SubTelephone"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const Telephone_1 = __importDefault(require("../../../models/Telephone"));
const path_1 = __importDefault(require("path"));
class SubTelephoneService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createSubTelephone(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Name, Address, Contact1, Contact2, TelephoneModelId } = payload;
            const TelephoneExist = yield Telephone_1.default.findById(TelephoneModelId);
            if (!TelephoneExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Telephone Does not Exist");
            }
            if (!Name || !Address || !Contact1 || !TelephoneModelId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
            }
            const newSubTelephone = new SubTelephone_1.default({
                Name,
                Address,
                Contact1,
                Contact2,
                TelephoneModelId,
                CreatedBy: userId,
                Photo: file.filename // Ensure fileName is passed correctly
            });
            yield newSubTelephone.save();
            return newSubTelephone;
        });
    }
    updateSubTelephone(payload, subTelephoneId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const subTelephone = yield SubTelephone_1.default.findById((0, helper_1.toObjectId)(subTelephoneId));
            if (!subTelephone) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Sub Telephone not found", {}, false);
            }
            // Prepare old file path for deletion if it exists
            // let oldFilePath = businessCard.profilePhoto
            //   ? this.fileService.getFilePath(FOLDER_NAMES.BUSINESSCARD,businessCard.profilePhoto)
            //   : null;
            let oldFilePath = `uploads/telephone/${subTelephone.CreatedBy}/${subTelephone.Photo}`;
            let newPhoto = file ? file.filename : subTelephone.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedSubTelephone = (yield SubTelephone_1.default.findByIdAndUpdate(subTelephoneId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && subTelephone.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedSubTelephone;
        });
    }
    getSubTelephoneList(TelephoneModelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subTelephones = yield SubTelephone_1.default.find({ TelephoneModelId }).lean();
            const TelephoneData = yield Telephone_1.default.findById(TelephoneModelId);
            return {
                Title: (TelephoneData === null || TelephoneData === void 0 ? void 0 : TelephoneData.Title) || null, // Place Title outside the data array
                data: subTelephones.map(subTelephone => (Object.assign(Object.assign({}, subTelephone), { PhotoUrl: typeof subTelephone.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.TELEPHONEPHOTO, [subTelephone.CreatedBy.toString(), subTelephone.Photo])
                        : null // Handle cases where Photo is missing
                 })))
            };
        });
    }
    getTelephoneWithSubList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Retrieve all telephones
            const telephones = yield Telephone_1.default.find().lean();
            // Map through each telephone to fetch corresponding sub-telephones
            const updatedTelephones = yield Promise.all(telephones.map((telephone) => __awaiter(this, void 0, void 0, function* () {
                const subTelephones = yield SubTelephone_1.default.find({ TelephoneModelId: telephone._id }).lean();
                return {
                    Title: telephone.Title || null,
                    subTelephones: subTelephones.map(subTelephone => (Object.assign(Object.assign({}, subTelephone), { PhotoUrl: typeof subTelephone.Photo === "string"
                            ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.TELEPHONEPHOTO, [subTelephone.CreatedBy.toString(), subTelephone.Photo])
                            : null // Handle cases where Photo is missing
                     })))
                };
            })));
            return updatedTelephones;
        });
    }
    deleteSubTelephone(subTelephoneId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const subTelephone = yield SubTelephone_1.default.findById(subTelephoneId);
            if (!subTelephone) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Sub Telephone not found");
            }
            // Extract user ID and photo filename
            const userId = subTelephone.CreatedBy.toString();
            const photoFileName = subTelephone.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "telephone", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield SubTelephone_1.default.deleteOne({ _id: subTelephoneId });
            return {
                success: true,
                message: "Sub Telephone have been deleted successfully",
            };
        });
    }
}
exports.SubTelephoneService = SubTelephoneService;
