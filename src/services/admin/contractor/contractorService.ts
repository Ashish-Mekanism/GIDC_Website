import { IContractorBody } from '../../../types/requests';
import Contractor from '../../../models/Contractor';
import {
  generatePaginatedResponse,
  generatePaginationOptions,
  PaginationOptions,
  parsePaginationParams,
} from '../../paginationService';
import { toObjectId } from '../../../utils/helper';
import mongoose from 'mongoose';
import csv from 'csvtojson';
import { OLD_WORDPRESS_SERVICE_CATEGORIES_MAPPER } from '../../../utils/constants';
import ServiceCategory from '../../../models/ServiceCategory';
export class ContractorService {
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

  async createContractor(
    payload: Partial<IContractorBody>
  ): Promise<IContractorBody> {
    const ContractorData = {
      ...payload,
      ServiceIds: Array.isArray(payload.ServiceIds)
        ? payload.ServiceIds.map(id => toObjectId(id.toString())) // Ensure IDs are strings
        : [toObjectId(payload.ServiceIds!.toString())], // Ensure single ID is also converted
      active: payload.active ?? true,
    };

    const savedContractor = await Contractor.create(ContractorData);
    return savedContractor;
  }

  async updateContractor(
    ControlerId: string,
    payload: Partial<IContractorBody>
  ): Promise<IContractorBody | null> {
    const existingCategory = await Contractor.findById(ControlerId);
    if (!existingCategory) {
      throw new Error('Contractor not found');
    }

    const updatedCategory = await Contractor.findByIdAndUpdate(
      ControlerId,
      { $set: payload }, // Update only the provided fields
      { new: true, runValidators: true } // Return updated doc & apply validation
    );

    return updatedCategory;
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

  async getAllContractors() {
    const contractorList = await Contractor.find(
      {},
      {
        _id: 1,
        ContractorName: 1,
        active: 1,
        ServiceIds: 1,
        ContractorEmail: 1,
        createdAt: 1,
      }
    );
    const totalCount = await Contractor.countDocuments();

    return { totalCount: totalCount, contractorList: contractorList };
  }

  async importContractor(csvFilePath_: string) {
    try {
      const json = await csv().fromFile(csvFilePath_);
      console.log(`Total rows: ${json.length}`);

      if (json.length === 0) {
        console.log('❌ No data found in CSV file');
        return;
      }

      const BATCH_SIZE = 500;
      let ops: any[] = [];
      let totalProcessed = 0;
      let totalErrors = 0;

      for (let i = 0; i < json.length; i++) {
        const row = json[i];

        try {
          // sql id from wordpress
          const categoryIds = row['categroy_id']?.split(',') || [];
          const sIds = [];

          for (let s of categoryIds) {
            const serviceCategoryName =
              OLD_WORDPRESS_SERVICE_CATEGORIES_MAPPER[s] || '';
            const serviceCategory = await ServiceCategory.findOne({
              ServiceCategoryName: serviceCategoryName,
            });
            sIds.push(serviceCategory?._id);
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
            console.log(
              `⚠️ Skipping row ${i + 1}: mapRawToNocForm returned null/undefined`
            );
            continue;
          }

          ops.push({
            insertOne: { document: doc },
          });

          // When batch size reached OR last item
          if (ops.length === BATCH_SIZE || i === json.length - 1) {
            if (ops.length > 0) {
              console.log(
                `Writing batch ${Math.ceil((i + 1) / BATCH_SIZE)} with ${ops.length} records...`
              );

              try {
                const result = await Contractor.bulkWrite(ops, {
                  // ordered: false ,
                });
                console.log(
                  `✅ Batch completed: ${result.insertedCount} inserted, ${result.upsertedCount} upserted`
                );
                totalProcessed += result.insertedCount + result.upsertedCount;
              } catch (bulkError: any) {
                console.error(`❌ Bulk write error for batch:`, bulkError);

                // Log specific errors if available
                if (bulkError.writeErrors) {
                  bulkError.writeErrors.forEach((err: any, idx: number) => {
                    console.error(`Error in document ${idx}:`, err.errmsg);
                  });
                }

                totalErrors += ops.length;
              }

              ops = []; // reset batch
            }
          }
        } catch (mappingError) {
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
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw error;
    }
  }
}
