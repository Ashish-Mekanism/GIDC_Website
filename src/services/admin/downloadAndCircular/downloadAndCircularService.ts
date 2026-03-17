import { ObjectId } from 'mongoose';
import FileHelper from '../../fileService/fileHelper';
import FileService from '../../fileService/fileService';
import ApiError from '../../../utils/ApiError';
import {
  CIRCULAR_STATUS,
  FOLDER_NAMES,
  RESPONSE_CODE,
} from '../../../utils/constants';
import DownloadAndCircular from '../../../models/DownloadAndCircular';
import { IDownloadAndCircularBody } from '../../../types/requests';
import { toObjectId } from '../../../utils/helper';
import { FilterQuery } from 'mongoose';

export class DownloadAndCircularService {
  fileHelper = new FileHelper();
  fileService = new FileService();

  async createCircular(payload: any, userId: ObjectId, file: any) {
    const { Heading, Description, Date, Category = '' } = payload;

    // Validate required fields
    if (!Heading || !Date) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Missing required fields');
    }

    if (!Category) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        'Circular Must have a Category'
      );
    }

    // Create a new circular instance
    const newCircular = new DownloadAndCircular({
      Heading,
      Description,
      Date,
      Document: file?.filename || null, // Save the uploaded PDF file name
      CreatedBy: userId,
      Active: true,
      Category,
    });

    // Save the circular in the database
    await newCircular.save();

    return newCircular;
  }

  async updateCircular(
    payload: Partial<IDownloadAndCircularBody>,
    circularId: string
  ): Promise<IDownloadAndCircularBody> {
    // Find existing event
    const circular = await DownloadAndCircular.findById(toObjectId(circularId));
    if (!circular) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Circular not found');
    }

    const updatedCircular = (await DownloadAndCircular.findByIdAndUpdate(
      toObjectId(circularId), // Corrected variable name
      { $set: payload }, // Ensure update structure is correct
      { new: true, runValidators: true } // Return updated doc & apply schema validation
    ).lean()) as IDownloadAndCircularBody;

    return updatedCircular;
  }

  // async getCircularList(): Promise<any> {
  //     // Fetch all events
  //     const circulars = await DownloadAndCircular.find().lean();
  //     const totalCount= await DownloadAndCircular.countDocuments();
  //     return {
  //         data: circulars.map(circular => ({
  //             ...circular,
  //             DocumentUrl: typeof circular.Document === "string"
  //                 ? this.fileService.getFilePathFromDatabase(
  //                     FOLDER_NAMES.CIRCULAR,
  //                     [circular.CreatedBy.toString(), circular.Document]
  //                 )
  //                 : null // Handle cases where Photo is missing
  //         })),
  //         totalCount:totalCount
  //     };
  // }

  async getCircularList(query: { category?: string }): Promise<any> {
    const { category = '' } = query;
    const matchStage: FilterQuery<typeof DownloadAndCircular> = {};
    if (category && category.trim()) {
      matchStage.Category = category;
    }

    const circulars = await DownloadAndCircular.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'CreatedBy',
          foreignField: '_id',
          as: 'creatorDetails',
        },
      },
      {
        $unwind: {
          path: '$creatorDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          CreatedBy: {
            _id: '$creatorDetails._id',
            email: '$creatorDetails.email',
            userType: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$creatorDetails.user_type', 1] },
                    then: 'SUPER_ADMIN',
                  },
                  {
                    case: { $eq: ['$creatorDetails.user_type', 2] },
                    then: 'SUB_ADMIN',
                  },
                  {
                    case: { $eq: ['$creatorDetails.user_type', 3] },
                    then: 'USER',
                  },
                ],
                default: 'Unknown',
              },
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          Heading: 1,
          Description: 1,
          Date: 1,
          Active: 1,
          CreatedBy: 1,
          Document: 1,
          createdAt: 1,
          updatedAt: 1,
          Category: 1,
        },
      },
    ]);

    const totalCount = await DownloadAndCircular.countDocuments(matchStage);
    // Process document URL in JavaScript
    const updatedCirculars = circulars.map(circular => ({
      ...circular,
      DocumentUrl: circular.Document
        ? this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.CIRCULAR,
            [circular.CreatedBy?._id?.toString(), circular.Document] // Using email instead of ObjectId
          )
        : null,
    }));

    return { totalCount, data: updatedCirculars };
  }

  async getCircularDetails(circularId: string): Promise<any> {
    // Retrieve the event from the database
    const circular = await DownloadAndCircular.findById(circularId).lean();

    if (!circular) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Circular not found');
    }

    const createdByIdString = circular.CreatedBy?.toString() || '';

    if (circular.Document) {
      circular.Document = this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.CIRCULAR,
        [createdByIdString, String(circular.Document)] // Pass an array of submodules
      );
    }

    return circular;
  }

  async activeInactiveCircular(
    downlaodAndCircular_Id: string,
    action: boolean
  ) {
    const downlaodAndCircular_id = toObjectId(downlaodAndCircular_Id);
    const circular = await DownloadAndCircular.findById(downlaodAndCircular_id);

    if (!circular) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        'Circular not found',
        {},
        false
      );
    }

    // Determine new status based on the action
    const newStatus = action
      ? CIRCULAR_STATUS.ACTIVE
      : CIRCULAR_STATUS.INACTIVE;

    // If user is already in the desired state, return early
    if (circular.Active === newStatus) {
      return {
        success: false,
        message: `User account is already ${action ? 'active' : 'deactivated'}.`,
      };
    }

    // Update user status
    await DownloadAndCircular.findByIdAndUpdate(downlaodAndCircular_id, {
      Active: newStatus,
    });

    return {
      success: true,
      message: `Circular has been ${action ? 'activated' : 'deactivated'} successfully.`,
    };
  }

  async getActiveCircularList(query: { category?: string }): Promise<any> {
    const { category = '' } = query;
    const matchStage: FilterQuery<typeof DownloadAndCircular> = {};
    if (category && category.trim()) {
      matchStage.Category = category;
    }

    matchStage.Active = true;
    const circulars = await DownloadAndCircular.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'CreatedBy',
          foreignField: '_id',
          as: 'creatorDetails',
        },
      },
      {
        $unwind: {
          path: '$creatorDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          CreatedBy: {
            _id: '$creatorDetails._id',
            email: '$creatorDetails.email',
            userType: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$creatorDetails.user_type', 1] },
                    then: 'SUPER_ADMIN',
                  },
                  {
                    case: { $eq: ['$creatorDetails.user_type', 2] },
                    then: 'SUB_ADMIN',
                  },
                  {
                    case: { $eq: ['$creatorDetails.user_type', 3] },
                    then: 'USER',
                  },
                ],
                default: 'Unknown',
              },
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          Heading: 1,
          Description: 1,
          Date: 1,
          Active: 1,
          CreatedBy: 1,
          Document: 1,
          createdAt: 1,
          updatedAt: 1,
          Category: 1,
        },
      },
    ]);

    // Process document URL in JavaScript
    const updatedCirculars = circulars.map(circular => ({
      ...circular,
      DocumentUrl: circular.Document
        ? this.fileService.getFilePathFromDatabase(
            FOLDER_NAMES.CIRCULAR,
            [circular.CreatedBy?._id?.toString(), circular.Document] // Using email instead of ObjectId
          )
        : null,
    }));

    return { data: updatedCirculars };
  }
}
