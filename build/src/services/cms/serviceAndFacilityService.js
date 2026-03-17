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
exports.ServiceAndFacilityService = void 0;
const fileHelper_1 = __importDefault(require("../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const constants_1 = require("../../utils/constants");
const helper_1 = require("../../utils/helper");
const path_1 = __importDefault(require("path"));
const ServiceAndFacility_1 = __importDefault(require("../../models/ServiceAndFacility"));
class ServiceAndFacilityService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createServiceAndFacility(payload, userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ServiceDescription, ServiceName } = payload;
            // Validate required fields
            if (!ServiceName || !ServiceDescription) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields: Service Name  and Service Description is mandatory.");
            }
            // Prepare the new PresidentMessage document
            const newServiceAndFacility = new ServiceAndFacility_1.default({
                ServiceName,
                ServiceDescription,
                CreatedBy: userId,
                Photo: file ? file.filename : "", // Set photo filename if file exists
            });
            // Save the document
            yield newServiceAndFacility.save();
            return newServiceAndFacility;
        });
    }
    getServiceAndFacilityList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all Quick Links
            const serviceAndFacilityList = yield ServiceAndFacility_1.default.find().lean();
            // Prepare the response
            const response = serviceAndFacilityList.map(serviceAndFacility => ({
                _id: serviceAndFacility._id,
                ServiceName: serviceAndFacility.ServiceName,
                ServiceDescription: serviceAndFacility.ServiceDescription,
                Photo: this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.SERVICEANDFACILITY, [serviceAndFacility.CreatedBy.toString(), serviceAndFacility.Photo]),
                createdBy: serviceAndFacility.CreatedBy,
            }));
            return response;
        });
    }
    updateServiceAndFacility(payload, serviceAndFacilityListId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(file, "Received file object");
            // Find existing business card
            const serviceAndFacilityData = yield ServiceAndFacility_1.default.findById((0, helper_1.toObjectId)(serviceAndFacilityListId));
            if (!serviceAndFacilityData) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Industry not found", {}, false);
            }
            let oldFilePath = `uploads/ServiceAndFacility/${serviceAndFacilityData.CreatedBy.toString()}/${serviceAndFacilityData.Photo}`;
            let newPhoto = file ? file.filename : serviceAndFacilityData.Photo;
            console.log(oldFilePath, "oldFilePath");
            // Update payload
            const updatedPayload = Object.assign(Object.assign({}, payload), { Photo: newPhoto });
            // Update business card in database
            const updatedServiceAndFacility = (yield ServiceAndFacility_1.default.findByIdAndUpdate(serviceAndFacilityListId, updatedPayload, { new: true }).lean());
            // Delete old profile photo if a new one is uploaded
            if (file && updatedServiceAndFacility.Photo) {
                // Check if oldFilePath exists before deleting
                if (oldFilePath) {
                    yield this.fileHelper.deleteFile(oldFilePath);
                }
            }
            return updatedServiceAndFacility;
        });
    }
    deleteServiceAndFacility(serviceAndFacilityListId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the document from the database
            const serviceAndFacility = yield ServiceAndFacility_1.default.findById(serviceAndFacilityListId);
            if (!serviceAndFacility) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Service And Facility not found");
            }
            // Extract user ID and photo filename
            const userId = serviceAndFacility.CreatedBy.toString();
            const photoFileName = serviceAndFacility.Photo;
            // Construct the file path for the photo
            const filePath = path_1.default.join("uploads", "ServiceAndFacility", userId, photoFileName);
            yield this.fileHelper.deleteFile(filePath);
            // Delete the document from the database
            yield ServiceAndFacility_1.default.deleteOne({ _id: serviceAndFacilityListId });
            return {
                success: true,
                message: "Service And Facility have been deleted successfully",
            };
        });
    }
}
exports.ServiceAndFacilityService = ServiceAndFacilityService;
