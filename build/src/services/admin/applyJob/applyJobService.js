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
exports.AdminApplyJobService = void 0;
const ApplyJob_1 = __importDefault(require("../../../models/ApplyJob"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
class AdminApplyJobService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    getAppliedJobSeekerList(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fromDate, toDate, }) {
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const matchStage = {};
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            const jobList = yield ApplyJob_1.default.find(Object.assign({ careerOpportunityId: { $exists: false } }, matchStage));
            return jobList.map(job => (Object.assign(Object.assign({}, job.toObject()), { resumeUrl: job.resume
                    ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.RESUME, [
                        constants_1.FOLDER_NAMES.RESUME,
                        job.resume,
                    ])
                    : null })));
        });
    }
    getAppliedParticularJobSeekerList(careerOpportunityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobList = yield ApplyJob_1.default.find({
                careerOpportunityId: careerOpportunityId,
            });
            return jobList.map(job => (Object.assign(Object.assign({}, job.toObject()), { resumeUrl: job.resume
                    ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.RESUME, [
                        constants_1.FOLDER_NAMES.RESUME,
                        job.resume,
                    ])
                    : null })));
        });
    }
}
exports.AdminApplyJobService = AdminApplyJobService;
