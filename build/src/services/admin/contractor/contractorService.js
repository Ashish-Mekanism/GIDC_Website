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
exports.ContractorService = void 0;
const Contractor_1 = __importDefault(require("../../../models/Contractor"));
const helper_1 = require("../../../utils/helper");
const csvtojson_1 = __importDefault(require("csvtojson"));
const constants_1 = require("../../../utils/constants");
const ServiceCategory_1 = __importDefault(require("../../../models/ServiceCategory"));
class ContractorService {
    // async createContractor(
    //     payload: Partial<IContractorBody>
    //   ): Promise<IContractorBody> {
    //     const ContractorData = {
    //       ...payload,
    //       active: payload.active ?? true,
    //     };
    //       const savedContractor= await Contractor.create(ContractorData);
    //       return savedContractor;
    //   }
    createContractor(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ContractorData = Object.assign(Object.assign({}, payload), { ServiceIds: Array.isArray(payload.ServiceIds)
                    ? payload.ServiceIds.map(id => (0, helper_1.toObjectId)(id.toString())) // Ensure IDs are strings
                    : [(0, helper_1.toObjectId)(payload.ServiceIds.toString())], active: (_a = payload.active) !== null && _a !== void 0 ? _a : true });
            const savedContractor = yield Contractor_1.default.create(ContractorData);
            return savedContractor;
        });
    }
    updateContractor(ControlerId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield Contractor_1.default.findById(ControlerId);
            if (!existingCategory) {
                throw new Error('Contractor not found');
            }
            const updatedCategory = yield Contractor_1.default.findByIdAndUpdate(ControlerId, { $set: payload }, // Update only the provided fields
            { new: true, runValidators: true } // Return updated doc & apply validation
            );
            return updatedCategory;
        });
    }
    // async getPaginationContractorList(queryParams: PaginationOptions) {
    //   const parsedParams = parsePaginationParams(queryParams);
    //   const { skip, limit, sort } = generatePaginationOptions(parsedParams);
    //   // Fetch service category list
    //   const contractorList = await Contractor.aggregate([
    //     // Project only required fields
    //     {
    //       $project: {
    //         _id: 1,
    //         ContractorName: 1,
    //         active: 1,
    //         createdAt: 1,
    //       },
    //     },
    //     // Sorting, Pagination
    //     { $sort: sort },
    //     { $skip: skip },
    //     { $limit: limit },
    //   ]);
    //   // Generate pagination response
    //   const paginatedResponse = await generatePaginatedResponse(
    //     parsedParams,
    //     Contractor, // Use ServiceCategory model here
    //     {} // No additional match condition
    //   );
    //   return {
    //     ...paginatedResponse,
    //     contractorList,
    //   };
    // }
    getAllContractors() {
        return __awaiter(this, void 0, void 0, function* () {
            const contractorList = yield Contractor_1.default.find({}, {
                _id: 1,
                ContractorName: 1,
                active: 1,
                ServiceIds: 1,
                ContractorEmail: 1,
                createdAt: 1,
            });
            const totalCount = yield Contractor_1.default.countDocuments();
            return { totalCount: totalCount, contractorList: contractorList };
        });
    }
    importContractor(csvFilePath_) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                for (let i = 0; i < json.length; i++) {
                    const row = json[i];
                    try {
                        // sql id from wordpress
                        const categoryIds = ((_a = row['categroy_id']) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
                        const sIds = [];
                        for (let s of categoryIds) {
                            const serviceCategoryName = constants_1.OLD_WORDPRESS_SERVICE_CATEGORIES_MAPPER[s] || '';
                            const serviceCategory = yield ServiceCategory_1.default.findOne({
                                ServiceCategoryName: serviceCategoryName,
                            });
                            sIds.push(serviceCategory === null || serviceCategory === void 0 ? void 0 : serviceCategory._id);
                        }
                        const contractorName = row['contractor_name'];
                        const doc = {
                            ContractorName: contractorName,
                            ServiceIds: sIds,
                            active: true,
                            isExported: true,
                        };
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
                                    const result = yield Contractor_1.default.bulkWrite(ops, {
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
exports.ContractorService = ContractorService;
