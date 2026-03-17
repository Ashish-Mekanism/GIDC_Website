import dayjs from 'dayjs';
import ComplaintModel from '../../../models/Complaint';
import ServiceCategory from '../../../models/ServiceCategory';
import { IAssignContractor } from '../../../types/requests';
import ApiError from '../../../utils/ApiError';
import {
  COMPLAINT_STATUS,
  COMPLAINT_STATUS_QUERY,
  DEFAULT_SERVICE_CATEGORIES,
  FOLDER_NAMES,
  OLD_WORDPRESS_CONTRACTORS_MAPPER,
  RESPONSE_CODE,
  ServiceRequestEmailKeys,
} from '../../../utils/constants';
import {
  isValidDayjs,
  parseValidDate,
  toObjectId,
} from '../../../utils/helper';
import FileHelper from '../../fileService/fileHelper';
import FileService from '../../fileService/fileService';
import { isValidObjectId, Schema, Types } from 'mongoose';
import { SendEmailTemplateMail } from '../../emailService';
import csv from 'csvtojson';
import Contractor from '../../../models/Contractor';
import lodash from 'lodash';

export class AdminComplaintService {
  fileHelper = new FileHelper();
  fileService = new FileService();
  sendEmailTemplateMail = new SendEmailTemplateMail();

  async getComplaintList(
    key: string,
    status: string,
    {
      fromDate,
      toDate,
    }: { fromDate: Date | null | string; toDate: Date | null | string }
  ): Promise<any> {
    // Fetch all pending complaints

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);

    const allServiceCategories = await ServiceCategory.find({}).lean();
    const defaultKeys = DEFAULT_SERVICE_CATEGORIES.filter(
      cat => cat.isSystem
    ).map(cat => cat.key);
    const matchStage: any = {};

    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    // // Status Filter
    // if (status === COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED?.toString()) {
    //   matchStage.status = {
    //     $in: [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.ASSIGN],
    //   };
    // } else if (status === COMPLAINT_STATUS_QUERY.COMPLETED?.toString()) {
    //   matchStage.status = { $in: [COMPLAINT_STATUS.COMPLETED] };
    // }

    const statusFilters: any[] = [
      { status: { $ne: COMPLAINT_STATUS.DELETED } },
    ];

    if (status === COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED?.toString()) {
      statusFilters.push({
        status: { $in: [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.ASSIGN] },
      });
    } else if (status === COMPLAINT_STATUS_QUERY.COMPLETED?.toString()) {
      statusFilters.push({
        status: { $eq: COMPLAINT_STATUS.COMPLETED },
      });
    }

    if (statusFilters.length > 1) {
      // APPLY FILTER WITH DELETE AND STATUS
      matchStage.$and = statusFilters;
    } else {
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
    } else if (key && defaultKeys.includes(key)) {
      const matchedCategory = allServiceCategories.find(cat => cat.key === key);
      if (matchedCategory) {
        matchStage.serviceCategory = matchedCategory._id;
      }
    }

    const complaints = await ComplaintModel.aggregate([
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
        return {
          ...complaint,
          complaint_photo: Array.isArray(complaint.complaint_photo)
            ? complaint.complaint_photo.map((photo: string) =>
                this.fileService.getFilePathFromDatabase(
                  FOLDER_NAMES.COMPLAINT,
                  [userIdString, photo]
                )
              )
            : [], // Handle cases where complaint_photo is missing or not an array
        };
      }),
    };
  }

  async assignContractor(
    complaintId: string,
    payload: Partial<IAssignContractor>
  ) {
    if (!isValidObjectId(complaintId)) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
    }
    const complaint = await ComplaintModel.findById(toObjectId(complaintId));

    if (!complaint) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Complaint not found',
        {},
        false
      );
    }
    const currentStatus = complaint.status;

    if (!payload.contractor) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Contractor ID is required'
      );
    }
    if (currentStatus === COMPLAINT_STATUS.ASSIGN) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        `Complaint is already assigned to a contractor.`
      );
    }

    if (currentStatus === COMPLAINT_STATUS.DELETED) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Cannot update a deleted complaint.'
      );
    }
    if (currentStatus !== COMPLAINT_STATUS.PENDING) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Cannot assign a contractor to a non-pending complaint.'
      );
    }

    // Assign the contractor correctly
    complaint.assignContractor = toObjectId(
      payload.contractor
    ) as unknown as Schema.Types.ObjectId;
    complaint.status = COMPLAINT_STATUS.ASSIGN;
    complaint.assignedContractorAt = new Date();

    await complaint.save();
    await this.sendEmailTemplateMail.sendServiceRequestEmailToUser(
      complaintId,
      ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER
    );
    await this.sendEmailTemplateMail.sendServiceRequestApprovedEmailToContractor(
      complaintId,
      ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR
    );
    return {
      message: 'Contractor Assigned Successfully',
      complaint,
    };
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

  private async sendUserComplaintEmail(
    serviceEmailTemplateKey: string,
    serviceRequestId: string
  ) {
    switch (serviceEmailTemplateKey) {
      case ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER:
        await this.sendEmailTemplateMail.sendServiceRequestEmailToUser(
          serviceRequestId,
          ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER
        );
        await this.sendEmailTemplateMail.sendServiceRequestApprovedEmailToContractor(
          serviceRequestId,
          ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_CONTRACTOR
        );
        break;
      case ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED:
        await this.sendEmailTemplateMail.sendServiceRequestEmailToUser(
          serviceRequestId,
          ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED
        );
        break;
      default:
        break;
    }
  }
  async updateComplaintStatus(complaintId: string, status: number) {
    if (!isValidObjectId(complaintId)) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
    }
    const complaint = await ComplaintModel.findById(toObjectId(complaintId));

    if (!complaint) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Complaint not found.',
        {},
        false
      );
    }

    const currentStatus = complaint.status;
    const newStatus = Number(status) as 0 | 1 | 2;

    const validStatuses = [
      COMPLAINT_STATUS.PENDING,
      COMPLAINT_STATUS.ASSIGN,
      COMPLAINT_STATUS.COMPLETED,
    ];

    const statusMapping: Record<number, string> = {
      [COMPLAINT_STATUS.PENDING]: 'PENDING',
      [COMPLAINT_STATUS.ASSIGN]: 'ASSIGN',
      [COMPLAINT_STATUS.COMPLETED]: 'COMPLETED',
    };

    if (!validStatuses.includes(newStatus)) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Invalid status value.');
    }

    if (currentStatus === COMPLAINT_STATUS.DELETED) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Cannot update a deleted complaint.'
      );
    }

    if (currentStatus === newStatus) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        `Complaint is already in status ${statusMapping[newStatus]}.`
      );
    }

    // Invalid transitions
    const invalidTransitions: Record<number, number[]> = {
      [COMPLAINT_STATUS.PENDING]: [COMPLAINT_STATUS.COMPLETED],
      [COMPLAINT_STATUS.ASSIGN]: [COMPLAINT_STATUS.PENDING],
      [COMPLAINT_STATUS.COMPLETED]: [
        COMPLAINT_STATUS.PENDING,
        COMPLAINT_STATUS.ASSIGN,
      ],
    };

    if (invalidTransitions[currentStatus]?.includes(newStatus)) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        `Invalid status transition from ${statusMapping[currentStatus]} to ${statusMapping[newStatus]}.`
      );
    }
    const pendingToAssigned =
      currentStatus === COMPLAINT_STATUS.PENDING &&
      newStatus === COMPLAINT_STATUS.ASSIGN;
    const assignedToCompleted =
      currentStatus === COMPLAINT_STATUS.ASSIGN &&
      newStatus === COMPLAINT_STATUS.COMPLETED;
    // Set transition-specific fields
    if (pendingToAssigned) {
      complaint.assignedContractorAt = new Date();
    }
    if (assignedToCompleted) {
      complaint.completedServiceAt = new Date();
    }

    // Update and save
    complaint.status = newStatus;
    await complaint.save();

    /// assigned to completed send email to user
    if (pendingToAssigned) {
      await this.sendUserComplaintEmail(
        ServiceRequestEmailKeys.SERVICE_REQUEST_ASSIGNED_USER,
        complaintId
      );
    }
    if (assignedToCompleted) {
      await this.sendUserComplaintEmail(
        ServiceRequestEmailKeys.SERVICE_REQUEST_FINISHED,
        complaintId
      );
    }

    return {
      success: true,
      message: `Complaint status updated successfully to ${statusMapping[newStatus]}.`,
      complaint,
    };
  }

  async deleteComplaint(complaintId: string) {
    if (!isValidObjectId(complaintId)) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Invalid complaint id');
    }
    const complaint = await ComplaintModel.findById(toObjectId(complaintId));
    if (!complaint) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Complaint not found.',
        {},
        false
      );
    }
    const currentStatus = complaint.status;
    if (currentStatus === COMPLAINT_STATUS.DELETED) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Complaint already deleted.'
      );
    }

    complaint.status = COMPLAINT_STATUS.DELETED;
    complaint.deletedAt = new Date();
    await complaint.save();
  }
  async getComplaintCompletedList(): Promise<any> {
    // Fetch all pending complaints
    const complaints = await ComplaintModel.find({
      status: COMPLAINT_STATUS.COMPLETED,
    }).lean();

    return {
      data: complaints.map(complaint => {
        const userIdString = complaint.userId
          ? complaint.userId.toString()
          : ''; // Ensure userId exists
        return {
          ...complaint,
          complaint_photo: Array.isArray(complaint.complaint_photo)
            ? complaint.complaint_photo.map(photo =>
                this.fileService.getFilePathFromDatabase(
                  FOLDER_NAMES.COMPLAINT,
                  [userIdString, photo]
                )
              )
            : [], // Handle cases where complaint_photo is missing or not an array
        };
      }),
    };
  }

  async getComplaintForm(ComplaintId: string): Promise<any> {
    // Fetch all pending complaints

    const complaint = await ComplaintModel.findOne({
      _id: ComplaintId,
      status: {
        $ne: COMPLAINT_STATUS.DELETED,
      },
    }).lean();

    if (!complaint) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Complaint not found.',
        {},
        false
      );
    }

    const userIdString = complaint.userId ? complaint.userId.toString() : ''; // Ensure userId exists

    return {
      data: {
        ...complaint,
        complaint_photo: Array.isArray(complaint.complaint_photo)
          ? complaint.complaint_photo.map(photo =>
              this.fileService.getFilePathFromDatabase(FOLDER_NAMES.COMPLAINT, [
                userIdString,
                photo,
              ])
            )
          : [], // Handle cases where complaint_photo is missing or not an array
      },
    };
  }
  async importComplaints(csvFilePath_: string) {
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
      const serviceCategoriesMap = new Map();

      const dbServiceCategories = await ServiceCategory.find();
      for (let service of dbServiceCategories) {
        serviceCategoriesMap.set(service.ServiceCategoryName, service);
      }
      const dbContractors = await Contractor.find();
      for (let contractor of dbContractors) {
        serviceCategoriesMap.set(contractor.ContractorName, contractor);
      }

      for (let i = 0; i < json.length; i++) {
        const row = json[i];
        const mappedRow = {
          serviceNumber: row?.complaint_id,
          membershipNo: row?.membership_no || '-',
          email: row?.complaint_email || '-',
          mobile: row?.complaint_mobile || '-',
          phone: row?.complaint_phoneno || '-',
          companyName: row?.complaint_by || '-',
          personName: row?.complaint_partyname || '-',
          roadNo: row?.comp_road_no || '-',
          address: row?.complaint_address || '-',
          serviceCategory:
            serviceCategoriesMap.get(row?.complaint_services)?._id || undefined,
          ServiceCategoryName: row?.complaint_services || '-',
          serviceDetails: row?.complaint_details || '-',
          status:
            row?.complaint_type === 'finish'
              ? COMPLAINT_STATUS.COMPLETED
              : row?.complaint_type === 'pending'
                ? COMPLAINT_STATUS.PENDING
                : undefined,
          assignContractor:
            serviceCategoriesMap.get(
              OLD_WORDPRESS_CONTRACTORS_MAPPER[row?.contractor_id]
            )?._id || undefined,
          completedServiceAt: parseValidDate(row?.completed_compalint_date),
          createdAt: parseValidDate(row?.complaint_date),
          isExported: true,
        };
        const doc = lodash.omitBy(mappedRow, lodash.isNil);
        try {
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
                const result = await ComplaintModel.bulkWrite(ops, {
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
