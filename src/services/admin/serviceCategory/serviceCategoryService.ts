import ServiceCategory from '../../../models/ServiceCategory';
import { IServiceCategoryBody } from '../../../types/requests';
import { DEFAULT_SERVICE_CATEGORIES } from '../../../utils/constants';

export class ServiceCategoryService {
  static DEFAULT_SERVICE_CATEGORIES = DEFAULT_SERVICE_CATEGORIES;
  async seedServiceCategories() {
    try {
      const existing = await ServiceCategory.find(
        {},
        'key ServiceCategoryName active'
      ).lean();
      const existingMap = new Map(existing.map(item => [item.key, item]));

      const bulkOps = [];

      for (const {
        key,
        name,
        active = true,
      } of ServiceCategoryService.DEFAULT_SERVICE_CATEGORIES) {
        const existingItem = existingMap.get(key);

        // Skip if no changes needed
        if (
          existingItem &&
          existingItem?.ServiceCategoryName === name
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
        await ServiceCategory.bulkWrite(bulkOps);
      }
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Failed to seed service categories: ${error.message}`);
      throw error;
    }
  }

  async createServiceCategory(
    payload: Partial<IServiceCategoryBody>
  ): Promise<IServiceCategoryBody> {
    const categoryData = {
      ...payload,
      active: payload.active ?? true,
    };

    const savedCategory = await ServiceCategory.create(categoryData);

    // Return only required fields
    return savedCategory;
  }

  async updateServiceCategory(
    serviceCategoryId: string,
    payload: Partial<IServiceCategoryBody>
  ): Promise<IServiceCategoryBody | null> {
    const existingCategory = await ServiceCategory.findById(serviceCategoryId);
    if (!existingCategory) {
      throw new Error('Service category not found');
    }

    const updatedCategory = await ServiceCategory.findByIdAndUpdate(
      serviceCategoryId,
      { $set: payload }, // Update only the provided fields
      { new: true, runValidators: true } // Return updated doc & apply validation
    );

    return updatedCategory;
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

  async getServiceCategoryList() {
    // Fetch all service categories without pagination
    const serviceCategoryList = await ServiceCategory.aggregate([
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
  }
}
