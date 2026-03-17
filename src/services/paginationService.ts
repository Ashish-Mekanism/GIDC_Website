import { Model, PipelineStage } from 'mongoose';
import { paginationDefaultValues } from '../utils/constants';
import { FilterQuery } from 'mongoose';

type SortOrderType = 1 | -1;
type QueryParamValue = string | undefined;
export interface PaginationOptions {
  page?: string;
  perPage?: string;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: QueryParamValue;
}

interface PaginationParams {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder: SortOrderType;
}

export function parsePaginationParams(
  queryParams: PaginationOptions
): PaginationParams {
  const {
    page = paginationDefaultValues.page,
    perPage = paginationDefaultValues.perPage,
    sortBy = paginationDefaultValues.sortBy,
    sortOrder = paginationDefaultValues.sortOrder,
  } = queryParams;

  // Convert to numbers and ensure sortOrder is either 1 or -1
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const perPageNumber = Number(perPage) > 0 ? Number(perPage) : 10;

  // Convert sortOrder to a valid SortOrderType (1 or -1)
  const sortOrderNumber: SortOrderType =
    sortOrder === 'desc' || Number(sortOrder) === -1 ? -1 : 1;

  return {
    page: pageNumber,
    perPage: perPageNumber,
    sortBy,
    sortOrder: sortOrderNumber,
  };
}

export function generatePaginationOptions(params: PaginationParams) {
  const { page, perPage, sortBy, sortOrder } = params;
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const sort: Record<string, SortOrderType> = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = sortOrder;
  }

  return { skip, limit, sort };
}

export async function generatePaginatedResponse<M>(
  params:any,
  model: Model<M>,
  match = {}
) {
  const totalCount = await model.countDocuments(match);
  const totalPages = Math.ceil(totalCount / params.perPage);
  return {
    currentPage: params.page,
    perPage: params.perPage,
    totalCount,
    totalPages,
  };
}

export function generatePaginationFacet(
  skip: number,
  limit: number,
  sort:number,
  field = 'metadata'
) {
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

export function generateFacetPaginatedResponse(
  parsedPaginationParams:any,
  aggregationResult:any,
  dynamicFieldName:any,
) {
  // Extract the response from the aggregation result
  const response = aggregationResult[0];

  // Return the paginated response with dynamic field name
  return {
    currentPage: parsedPaginationParams.page,
    perPage: parsedPaginationParams.perPage,
    totalCount: response?.metadata?.totalCount || 0,
    totalPages: response?.metadata?.totalPages || 0,
    [dynamicFieldName]: response?.data || [], // Dynamic field name
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

export function buildMatchStage(
  queryParams: PaginationOptions,
  allowedQueryParamsWithMappings: Record<
    string,
    { type: 'string' | 'number'; dbField: string }
  >,
  searchableFields: string[] = []
) {
  const match: FilterQuery<unknown> = {};
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
        } else if (type === 'string') {
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

export function buildSearchMatchStage(
  searchTerm: string,
  searchableFields: string[]
) {
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
