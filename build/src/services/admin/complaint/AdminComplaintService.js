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
exports.AdminComplaintService = void 0;
const Complaint_1 = __importDefault(require("../../../models/Complaint"));
const ServiceCategory_1 = __importDefault(require("../../../models/ServiceCategory"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const mongoose_1 = require("mongoose");
const emailService_1 = require("../../emailService");
const csvtojson_1 = __importDefault(require("csvtojson"));
const Contractor_1 = __importDefault(require("../../../models/Contractor"));
const lodash_1 = __importDefault(require("lodash"));
class AdminComplaintService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
        this.sendEmailTemplateMail = new emailService_1.SendEmailTemplateMail();
    }
    getComplaintList(key_1, status_1, _a) {
        return __awaiter(this, arguments, void 0, function* (key, status, { fromDate, toDate, }) {
            // Fetch all pending complaints
            var _b, _c;
            const validFromDate = (0, helper_1.isValidDayjs)(fromDate);
            const validToDate = (0, helper_1.isValidDayjs)(toDate);
            const allServiceCategories = yield ServiceCategory_1.default.find({}).lean();
            const defaultKeys = constants_1.DEFAULT_SERVICE_CATEGORIES.filter(cat => cat.isSystem).map(cat => cat.key);
            const matchStage = {};
            // Date Filter
            if (validFromDate || validToDate) {
                matchStage.createdAt = {};
                if (validFromDate)
                    matchStage.createdAt.$gte = validFromDate;
                if (validToDate)
                    matchStage.createdAt.$lte = validToDate;
            }
            // // Status Filter
            // if (status === COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED?.toString()) {
            //   matchStage.status = {
            //     $in: [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.ASSIGN],
            //   };
            // } else if (status === COMPLAINT_STATUS_QUERY.COMPLETED?.toString()) {
            //   matchStage.status = { $in: [COMPLAINT_STATUS.COMPLETED] };
            // }
            const statusFilters = [
                { status: { $ne: constants_1.COMPLAINT_STATUS.DELETED } },
            ];
            if (status === ((_b = constants_1.COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED) === null || _b === void 0 ? void 0 : _b.toString())) {
                statusFilters.push({
                    status: { $in: [constants_1.COMPLAINT_STATUS.PENDING, constants_1.COMPLAINT_STATUS.ASSIGN] },
                });
            }
            else if (status === ((_c = constants_1.COMPLAINT_STATUS_QUERY.COMPLETED) === null || _c === void 0 ? void 0 : _c.toString())) {
                statusFilters.push({
                    status: { $eq: constants_1.COMPLAINT_STATUS.COMPLETED },
                });
            }
            if (statusFilters.length > 1) {
                // APPLY FILTER WITH DELETE AND STATUS
                matchStage.$and = statusFilters;
            }
            else {
                // APPLY ONLY DELETE FILTER IF NOT STATUS
                Object.assign(matchStage, statusFilters[0]);
            }
            // Key Filter
            // If key is passed and it's "others"
            if (key === 'others') {
                const nonOtherCategoryIds = allServiceCategories
                    .filter(cat => defaultKeys.includes(cat.key))
                    .map(cat => cat._id);
                matchStage.$or = [
                    { serviceCategory: { $exists: false } },
                    { serviceCategory: { $nin: nonOtherCategoryIds } },
                ];
            }
            else if (key && defaultKeys.includes(key)) {
                const matchedCategory = allServiceCategories.find(cat => cat.key === key);
                if (matchedCategory) {
                    matchStage.serviceCategory = matchedCategory._id;
                }
            }
            const complaints = yield Complaint_1.default.aggregate([
                { $match: matchStage },
                {
                    $lookup: {
                        from: 'servicecategories',
                        localField: 'serviceCategory',
                        foreignField: '_id',
                        as: 'serviceCategoryData',
                    },
                },
                {
                    $unwind: {
                        path: '$serviceCategoryData',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $addFields: {
                        ServiceCategoryName: '$serviceCategoryData.ServiceCategoryName',
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $project: {
                        serviceCategoryData: 0,
                    },
                },
            ]);
            return {
                data: complaints.map(complaint => {
                    const userIdString = complaint.userId
                        ? complaint.userId.toString()
                        : ''; // Ensure userId exists
                    return Object.assign(Object.assign({}, complaint), { complaint_photo: Array.isArray(complaint.complaint_photo)
                            ? complaint.complaint_photo.map((photo) => this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.COMPLAINT, [userIdString, photo]))
                            : [] });
                }),
            };
        });
    }
    assignContractor(complaintId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(complaintId)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
            }
            const complaint = yield Complaint_1.default.findById((0, helper_1.toObjectId)(complaintId));
            if (!complaint) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Complaint not found', {}, false);
            }
            const currentStatus = complaint.status;
            if (!payload.contractor) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Contractor ID is required');
            }
            if (currentStatus === constants_1.COMPLAINT_STATUS.ASSIGN) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, `Complaint is already assigned to a contractor.`);
            }
            if (currentStatus === constants_1.COMPLAINT_STATUS.DELETED) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Cannot update a deleted complaint.');
            }
            if (currentStatus !== constants_1.COMPLAINT_STATUS.PENDING) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Cannot assign a contractor to a non-pending complaint.');
            }
            // Assign the contractor correctly
            complaint.assignContractor = (0, helper_1.toObjectId)(payload.contractor);
            complaint.status = constants_1.COMPLAINT_STATUS.ASSIGN;
            complaint.assignedContractorAt = new Date();
            yield complaint.save();
            yield this.sendEmailTemplateMail.sendServiceRequestEmailToUser(complaintId, constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER);
            yield this.sendEmailTemplateMail.sendServiceRequestApprovedEmailToContractor(complaintId, constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR);
            return {
                message: 'Contractor Assigned Successfully',
                complaint,
            };
        });
    }
    // async updateComplaintStatus(complaintId: string, status: number) {
    //   // Convert complaintId to ObjectId and fetch the complaint
    //   const complaint = await ComplaintModel.findById(toObjectId(complaintId));
    //   const currentComplaintStatus = complaint?.status;
    //   if (!complaint) {
    //     throw new ApiError(
    //       RESPONSE_CODE.NOT_FOUND,
    //       'Complaint not found.',
    //       {},
    //       false
    //     );
    //   }
    //   // Convert status to a number and assert type
    //   const numericStatus = Number(status) as 0 | 1 | 2;
    //   // Validate if the status is one of the allowed values
    //   if (
    //     ![
    //       COMPLAINT_STATUS.PENDING,
    //       COMPLAINT_STATUS.ASSIGN,
    //       COMPLAINT_STATUS.COMPLETED,
    //     ].includes(numericStatus)
    //   ) {
    //     return {
    //       success: false,
    //       message: 'Invalid status value',
    //     };
    //   }
    //   // Mapping numeric status to a readable string
    //   const statusMapping = {
    //     [COMPLAINT_STATUS.PENDING]: 'PENDING',
    //     [COMPLAINT_STATUS.ASSIGN]: 'ASSIGN',
    //     [COMPLAINT_STATUS.COMPLETED]: 'COMPLETED',
    //   };
    //   // if completed-> cannot go back to assign or pending
    //   // if assigned cannot go back to pending
    //   //if pending -> assign and cannot go to completed
    //   // present state -> you have already been to the current state
    //   //if pending can go to assign status only and add assignedContractorAt date
    //   // if assign can go to completed only and add add completedServiceAt date
    //   //current status pending -> assign
    //   //            assign - >completed
    //   if (
    //     currentComplaintStatus === COMPLAINT_STATUS.DELETED
    //   ) {
    //     //throw error cannot change state deleted
    //   }
    //   if (currentComplaintStatus === status) {
    //     // throw error already in same state
    //   }
    //   if (
    //     currentComplaintStatus === COMPLAINT_STATUS.PENDING &&
    //     [COMPLAINT_STATUS.COMPLETED].includes(status)
    //   ) {
    //     //throw error wrong state change
    //   }
    //   if (
    //     currentComplaintStatus === COMPLAINT_STATUS.ASSIGN &&
    //     [COMPLAINT_STATUS.PENDING].includes(status)
    //   ) {
    //     //throw error wrong state change
    //   }
    //   if (
    //     currentComplaintStatus === COMPLAINT_STATUS.COMPLETED &&
    //     [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.ASSIGN].includes(status)
    //   ) {
    //     //throw error wrong state change
    //   }
    //   // Update complaint status
    //   complaint.status = numericStatus;
    //   await complaint.save();
    //   return {
    //     success: true,
    //     message: `Complaint status updated successfully to ${statusMapping[numericStatus]}.`,
    //     complaint,
    //   };
    // }
    sendUserComplaintEmail(serviceEmailTemplateKey, serviceRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (serviceEmailTemplateKey) {
                case constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER:
                    yield this.sendEmailTemplateMail.sendServiceRequestEmailToUser(serviceRequestId, constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER);
                    yield this.sendEmailTemplateMail.sendServiceRequestApprovedEmailToContractor(serviceRequestId, constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR);
                    break;
                case constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED:
                    yield this.sendEmailTemplateMail.sendServiceRequestEmailToUser(serviceRequestId, constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED);
                    break;
                default:
                    break;
            }
        });
    }
    updateComplaintStatus(complaintId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(0, mongoose_1.isValidObjectId)(complaintId)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
            }
            const complaint = yield Complaint_1.default.findById((0, helper_1.toObjectId)(complaintId));
            if (!complaint) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Complaint not found.', {}, false);
            }
            const currentStatus = complaint.status;
            const newStatus = Number(status);
            const validStatuses = [
                constants_1.COMPLAINT_STATUS.PENDING,
                constants_1.COMPLAINT_STATUS.ASSIGN,
                constants_1.COMPLAINT_STATUS.COMPLETED,
            ];
            const statusMapping = {
                [constants_1.COMPLAINT_STATUS.PENDING]: 'PENDING',
                [constants_1.COMPLAINT_STATUS.ASSIGN]: 'ASSIGN',
                [constants_1.COMPLAINT_STATUS.COMPLETED]: 'COMPLETED',
            };
            if (!validStatuses.includes(newStatus)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid status value.');
            }
            if (currentStatus === constants_1.COMPLAINT_STATUS.DELETED) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Cannot update a deleted complaint.');
            }
            if (currentStatus === newStatus) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, `Complaint is already in status ${statusMapping[newStatus]}.`);
            }
            // Invalid transitions
            const invalidTransitions = {
                [constants_1.COMPLAINT_STATUS.PENDING]: [constants_1.COMPLAINT_STATUS.COMPLETED],
                [constants_1.COMPLAINT_STATUS.ASSIGN]: [constants_1.COMPLAINT_STATUS.PENDING],
                [constants_1.COMPLAINT_STATUS.COMPLETED]: [
                    constants_1.COMPLAINT_STATUS.PENDING,
                    constants_1.COMPLAINT_STATUS.ASSIGN,
                ],
            };
            if ((_a = invalidTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, `Invalid status transition from ${statusMapping[currentStatus]} to ${statusMapping[newStatus]}.`);
            }
            const pendingToAssigned = currentStatus === constants_1.COMPLAINT_STATUS.PENDING &&
                newStatus === constants_1.COMPLAINT_STATUS.ASSIGN;
            const assignedToCompleted = currentStatus === constants_1.COMPLAINT_STATUS.ASSIGN &&
                newStatus === constants_1.COMPLAINT_STATUS.COMPLETED;
            // Set transition-specific fields
            if (pendingToAssigned) {
                complaint.assignedContractorAt = new Date();
            }
            if (assignedToCompleted) {
                complaint.completedServiceAt = new Date();
            }
            // Update and save
            complaint.status = newStatus;
            yield complaint.save();
            /// assigned to completed send email to user
            if (pendingToAssigned) {
                yield this.sendUserComplaintEmail(constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER, complaintId);
            }
            if (assignedToCompleted) {
                yield this.sendUserComplaintEmail(constants_1.ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED, complaintId);
            }
            return {
                success: true,
                message: `Complaint status updated successfully to ${statusMapping[newStatus]}.`,
                complaint,
            };
        });
    }
    deleteComplaint(complaintId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(complaintId)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
            }
            const complaint = yield Complaint_1.default.findById((0, helper_1.toObjectId)(complaintId));
            if (!complaint) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Complaint not found.', {}, false);
            }
            const currentStatus = complaint.status;
            if (currentStatus === constants_1.COMPLAINT_STATUS.DELETED) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Complaint already deleted.');
            }
            complaint.status = constants_1.COMPLAINT_STATUS.DELETED;
            complaint.deletedAt = new Date();
            yield complaint.save();
        });
    }
    getComplaintCompletedList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all pending complaints
            const complaints = yield Complaint_1.default.find({
                status: constants_1.COMPLAINT_STATUS.COMPLETED,
            }).lean();
            return {
                data: complaints.map(complaint => {
                    const userIdString = complaint.userId
                        ? complaint.userId.toString()
                        : ''; // Ensure userId exists
                    return Object.assign(Object.assign({}, complaint), { complaint_photo: Array.isArray(complaint.complaint_photo)
                            ? complaint.complaint_photo.map(photo => this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.COMPLAINT, [userIdString, photo]))
                            : [] });
                }),
            };
        });
    }
    getComplaintForm(ComplaintId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all pending complaints
            const complaint = yield Complaint_1.default.findOne({
                _id: ComplaintId,
                status: {
                    $ne: constants_1.COMPLAINT_STATUS.DELETED,
                },
            }).lean();
            if (!complaint) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Complaint not found.', {}, false);
            }
            const userIdString = complaint.userId ? complaint.userId.toString() : ''; // Ensure userId exists
            return {
                data: Object.assign(Object.assign({}, complaint), { complaint_photo: Array.isArray(complaint.complaint_photo)
                        ? complaint.complaint_photo.map(photo => this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.COMPLAINT, [
                            userIdString,
                            photo,
                        ]))
                        : [] }),
            };
        });
    }
    importComplaints(csvFilePath_) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const json = yield (0, csvtojson_1.default)().fromFile(csvFilePath_);
                console.log(`Total rows: ${json.length}`);
                if (json.length === 0) {
                    console.log('❌ No data found in CSV file');
                    return;
                }
                const BATCH_SIZE = 500;
                let ops = [];
                let totalProcessed = 0;
                let totalErrors = 0;
                const serviceCategoriesMap = new Map();
                const dbServiceCategories = yield ServiceCategory_1.default.find();
                for (let service of dbServiceCategories) {
                    serviceCategoriesMap.set(service.ServiceCategoryName, service);
                }
                const dbContractors = yield Contractor_1.default.find();
                for (let contractor of dbContractors) {
                    serviceCategoriesMap.set(contractor.ContractorName, contractor);
                }
                for (let i = 0; i < json.length; i++) {
                    const row = json[i];
                    const mappedRow = {
                        serviceNumber: row === null || row === void 0 ? void 0 : row.complaint_id,
                        membershipNo: (row === null || row === void 0 ? void 0 : row.membership_no) || '-',
                        email: (row === null || row === void 0 ? void 0 : row.complaint_email) || '-',
                        mobile: (row === null || row === void 0 ? void 0 : row.complaint_mobile) || '-',
                        phone: (row === null || row === void 0 ? void 0 : row.complaint_phoneno) || '-',
                        companyName: (row === null || row === void 0 ? void 0 : row.complaint_by) || '-',
                        personName: (row === null || row === void 0 ? void 0 : row.complaint_partyname) || '-',
                        roadNo: (row === null || row === void 0 ? void 0 : row.comp_road_no) || '-',
                        address: (row === null || row === void 0 ? void 0 : row.complaint_address) || '-',
                        serviceCategory: ((_a = serviceCategoriesMap.get(row === null || row === void 0 ? void 0 : row.complaint_services)) === null || _a === void 0 ? void 0 : _a._id) || undefined,
                        ServiceCategoryName: (row === null || row === void 0 ? void 0 : row.complaint_services) || '-',
                        serviceDetails: (row === null || row === void 0 ? void 0 : row.complaint_details) || '-',
                        status: (row === null || row === void 0 ? void 0 : row.complaint_type) === 'finish'
                            ? constants_1.COMPLAINT_STATUS.COMPLETED
                            : (row === null || row === void 0 ? void 0 : row.complaint_type) === 'pending'
                                ? constants_1.COMPLAINT_STATUS.PENDING
                                : undefined,
                        assignContractor: ((_b = serviceCategoriesMap.get(constants_1.OLD_WORDPRESS_CONTRACTORS_MAPPER[row === null || row === void 0 ? void 0 : row.contractor_id])) === null || _b === void 0 ? void 0 : _b._id) || undefined,
                        completedServiceAt: (0, helper_1.parseValidDate)(row === null || row === void 0 ? void 0 : row.completed_compalint_date),
                        createdAt: (0, helper_1.parseValidDate)(row === null || row === void 0 ? void 0 : row.complaint_date),
                        isExported: true,
                    };
                    const doc = lodash_1.default.omitBy(mappedRow, lodash_1.default.isNil);
                    try {
                        // Skip if doc is null/undefined
                        if (!doc) {
                            console.log(`⚠️ Skipping row ${i + 1}: mapRawToNocForm returned null/undefined`);
                            continue;
                        }
                        ops.push({
                            insertOne: { document: doc },
                        });
                        // When batch size reached OR last item
                        if (ops.length === BATCH_SIZE || i === json.length - 1) {
                            if (ops.length > 0) {
                                console.log(`Writing batch ${Math.ceil((i + 1) / BATCH_SIZE)} with ${ops.length} records...`);
                                try {
                                    const result = yield Complaint_1.default.bulkWrite(ops, {
                                    // ordered: false ,
                                    });
                                    console.log(`✅ Batch completed: ${result.insertedCount} inserted, ${result.upsertedCount} upserted`);
                                    totalProcessed += result.insertedCount + result.upsertedCount;
                                }
                                catch (bulkError) {
                                    console.error(`❌ Bulk write error for batch:`, bulkError);
                                    // Log specific errors if available
                                    if (bulkError.writeErrors) {
                                        bulkError.writeErrors.forEach((err, idx) => {
                                            console.error(`Error in document ${idx}:`, err.errmsg);
                                        });
                                    }
                                    totalErrors += ops.length;
                                }
                                ops = []; // reset batch
                            }
                        }
                    }
                    catch (mappingError) {
                        console.error(`❌ Error processing row ${i + 1}:`, mappingError);
                        console.log('Raw row data:', row);
                        totalErrors++;
                    }
                }
                console.log('📊 Import Summary:');
                console.log(`Total rows in CSV: ${json.length}`);
                console.log(`Successfully processed: ${totalProcessed}`);
                console.log(`Errors: ${totalErrors}`);
                console.log('✅ Import completed');
                return {
                    totalRows: json.length,
                    processed: totalProcessed,
                    errors: totalErrors,
                };
            }
            catch (error) {
                console.error('❌ Import failed:', error);
                throw error;
            }
        });
    }
}
exports.AdminComplaintService = AdminComplaintService;
