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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePaginationParams = parsePaginationParams;
exports.generatePaginationOptions = generatePaginationOptions;
exports.generatePaginatedResponse = generatePaginatedResponse;
exports.generatePaginationFacet = generatePaginationFacet;
exports.generateFacetPaginatedResponse = generateFacetPaginatedResponse;
exports.buildMatchStage = buildMatchStage;
exports.buildSearchMatchStage = buildSearchMatchStage;
const constants_1 = require("../utils/constants");
function parsePaginationParams(queryParams) {
    const { page = constants_1.paginationDefaultValues.page, perPage = constants_1.paginationDefaultValues.perPage, sortBy = constants_1.paginationDefaultValues.sortBy, sortOrder = constants_1.paginationDefaultValues.sortOrder, } = queryParams;
    // Convert to numbers and ensure sortOrder is either 1 or -1
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const perPageNumber = Number(perPage) > 0 ? Number(perPage) : 10;
    // Convert sortOrder to a valid SortOrderType (1 or -1)
    const sortOrderNumber = sortOrder === 'desc' || Number(sortOrder) === -1 ? -1 : 1;
    return {
        page: pageNumber,
        perPage: perPageNumber,
        sortBy,
        sortOrder: sortOrderNumber,
    };
}
function generatePaginationOptions(params) {
    const { page, perPage, sortBy, sortOrder } = params;
    const skip = (page - 1) * perPage;
    const limit = perPage;
    const sort = {};
    if (sortBy && sortOrder) {
        sort[sortBy] = sortOrder;
    }
    return { skip, limit, sort };
}
function generatePaginatedResponse(params_1, model_1) {
    return __awaiter(this, arguments, void 0, function* (params, model, match = {}) {
        const totalCount = yield model.countDocuments(match);
        const totalPages = Math.ceil(totalCount / params.perPage);
        return {
            currentPage: params.page,
            perPage: params.perPage,
            totalCount,
            totalPages,
        };
    });
}
function generatePaginationFacet(skip, limit, sort, field = 'metadata') {
    return [
        {
            $facet: {
                [field]: [
                    { $count: 'totalCount' }, // Count total documents
                    {
                        $project: {
                            totalPages: {
                                $ceil: { $divide: ['$totalCount', limit] }, // Calculate total pages
                            },
                            totalCount: 1, // Include the total count in the metadata
                        },
                    },
                ],
                data: [{ $skip: skip }, { $limit: limit }, { $sort: sort }],
            },
        },
        {
            $unwind: {
                path: `$${field}`, // Unwind the metadata array to get a single object
            },
        },
    ];
}
function generateFacetPaginatedResponse(parsedPaginationParams, aggregationResult, dynamicFieldName) {
    var _a, _b;
    // Extract the response from the aggregation result
    const response = aggregationResult[0];
    // Return the paginated response with dynamic field name
    return {
        currentPage: parsedPaginationParams.page,
        perPage: parsedPaginationParams.perPage,
        totalCount: ((_a = response === null || response === void 0 ? void 0 : response.metadata) === null || _a === void 0 ? void 0 : _a.totalCount) || 0,
        totalPages: ((_b = response === null || response === void 0 ? void 0 : response.metadata) === null || _b === void 0 ? void 0 : _b.totalPages) || 0,
        [dynamicFieldName]: (response === null || response === void 0 ? void 0 : response.data) || [], // Dynamic field name
    };
}
// export function buildMatchStage(
//   queryParams: PaginationOptions,
//   allowedFields,
//   searchableFields: string[] = []
// ) {
//   const match: FilterQuery<unknown> = {};
//   const excludedKeys = ['page', 'perPage', 'sortBy', 'sortOrder', 'search'];
//   for (const key of Object.keys(queryParams)) {
//     if (!excludedKeys.includes(key) && queryParams[key] !== undefined) {
//       const expectedType = allowedFields[key];
//       if (expectedType) {
//         if (expectedType === 'number') {
//           const numberValue = Number(queryParams[key]);
//           if (!isNaN(numberValue)) {
//             match[key] = numberValue;
//           }
//         } else if (expectedType === 'string') {
//           match[key] = String(queryParams[key]);
//         }
//       }
//     }
//   }
//   if (queryParams.search && searchableFields.length > 0) {
//     const searchTerm = String(queryParams.search).trim();
//     if (searchTerm) {
//       match.$or = searchableFields.map((field) => ({
//         [field]: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
//       }));
//     }
//   }
//   return match;
// }
function buildMatchStage(queryParams, allowedQueryParamsWithMappings, searchableFields = []) {
    const match = {};
    const excludedKeys = ['page', 'perPage', 'sortBy', 'sortOrder', 'search'];
    for (const key of Object.keys(queryParams)) {
        if (!excludedKeys.includes(key) && queryParams[key] !== undefined) {
            const fieldMapping = allowedQueryParamsWithMappings[key];
            if (fieldMapping) {
                const { type, dbField } = fieldMapping;
                if (type === 'number') {
                    const numberValue = Number(queryParams[key]);
                    if (!isNaN(numberValue)) {
                        match[dbField] = numberValue;
                    }
                }
                else if (type === 'string') {
                    match[dbField] = String(queryParams[key]);
                }
            }
        }
    }
    if (queryParams.search && searchableFields.length > 0) {
        const searchTerm = String(queryParams.search).trim();
        if (searchTerm) {
            match.$or = searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
            }));
        }
    }
    return match;
}
function buildSearchMatchStage(searchTerm, searchableFields) {
    if (!searchTerm || !searchableFields.length) {
        return null; // No match stage if no search term or searchable fields
    }
    return {
        $match: {
            $or: searchableFields.map((field) => ({
                [field]: { $regex: searchTerm.trim(), $options: 'i' }, // Case-insensitive search
            })),
        },
    };
}
