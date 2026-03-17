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
exports.ServiceCategoryService = void 0;
const ServiceCategory_1 = __importDefault(require("../../../models/ServiceCategory"));
const constants_1 = require("../../../utils/constants");
class ServiceCategoryService {
    seedServiceCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield ServiceCategory_1.default.find({}, 'key ServiceCategoryName active').lean();
                const existingMap = new Map(existing.map(item => [item.key, item]));
                const bulkOps = [];
                for (const { key, name, active = true, } of ServiceCategoryService.DEFAULT_SERVICE_CATEGORIES) {
                    const existingItem = existingMap.get(key);
                    // Skip if no changes needed
                    if (existingItem &&
                        (existingItem === null || existingItem === void 0 ? void 0 : existingItem.ServiceCategoryName) === name
                    // existingItem?.active === active
                    ) {
                        continue;
                    }
                    bulkOps.push({
                        updateOne: {
                            filter: { key },
                            update: { $set: { key, ServiceCategoryName: name, active } },
                            upsert: true,
                        },
                    });
                }
                if (bulkOps.length > 0) {
                    yield ServiceCategory_1.default.bulkWrite(bulkOps);
                }
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Failed to seed service categories: ${error.message}`);
                throw error;
            }
        });
    }
    createServiceCategory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const categoryData = Object.assign(Object.assign({}, payload), { active: (_a = payload.active) !== null && _a !== void 0 ? _a : true });
            const savedCategory = yield ServiceCategory_1.default.create(categoryData);
            // Return only required fields
            return savedCategory;
        });
    }
    updateServiceCategory(serviceCategoryId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield ServiceCategory_1.default.findById(serviceCategoryId);
            if (!existingCategory) {
                throw new Error('Service category not found');
            }
            const updatedCategory = yield ServiceCategory_1.default.findByIdAndUpdate(serviceCategoryId, { $set: payload }, // Update only the provided fields
            { new: true, runValidators: true } // Return updated doc & apply validation
            );
            return updatedCategory;
        });
    }
    // async getPaginationServiceCategoryList(queryParams: PaginationOptions) {
    //   const parsedParams = parsePaginationParams(queryParams);
    //   const { skip, limit, sort } = generatePaginationOptions(parsedParams);
    //   // Fetch service category list
    //   const serviceCategoryList = await ServiceCategory.aggregate([
    //     // Project only required fields
    //     {
    //       $project: {
    //         _id: 1,
    //         ServiceCategoryName: 1,
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
    //     ServiceCategory, // Use ServiceCategory model here
    //     {} // No additional match condition
    //   );
    //   return {
    //     ...paginatedResponse,
    //     serviceCategoryList,
    //   };
    // }
    getServiceCategoryList() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch all service categories without pagination
            const serviceCategoryList = yield ServiceCategory_1.default.aggregate([
                // Project only required fields
                {
                    $project: {
                        _id: 1,
                        ServiceCategoryName: 1,
                        active: 1,
                        createdAt: 1,
                    },
                },
                // Optional: Add sorting by creation date (newest first)
                { $sort: { createdAt: -1 } },
            ]);
            return {
                serviceCategoryList,
                totalCount: serviceCategoryList.length,
            };
        });
    }
}
exports.ServiceCategoryService = ServiceCategoryService;
ServiceCategoryService.DEFAULT_SERVICE_CATEGORIES = constants_1.DEFAULT_SERVICE_CATEGORIES;
