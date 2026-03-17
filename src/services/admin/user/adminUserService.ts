import User from '../../../models/User';
import { isValidDayjs } from '../../../utils/helper';

export class AdminUserService {
  async getAllUsersList(query: { fromDate: string; toDate: string }) {
    const { fromDate, toDate } = query;
    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};

    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }
    matchStage.is_Member = false;

    const users = await User.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users', // The name of the collection
          localField: 'created_by',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: { path: '$creator', preserveNullAndEmptyArrays: true },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          email: 1,
          account_status: 1,
          user_type: 1,
          user_name: 1,
          companyName: 1,
          plotShedNo: 1,
          waterConnectionNo: 1,
          created_by: {
            email: '$creator.email',
            user_type: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$creator.user_type', 1] },
                    then: 'SUPER_ADMIN',
                  },
                  {
                    case: { $eq: ['$creator.user_type', 2] },
                    then: 'SUB_ADMIN',
                  },
                  { case: { $eq: ['$creator.user_type', 3] }, then: 'USER' },
                ],
                default: 'USER',
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return users;
  }
}
