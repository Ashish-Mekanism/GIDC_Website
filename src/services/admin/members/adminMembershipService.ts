import { ObjectId } from 'mongoose';
import MembershipModel from '../../../models/MembersRegistrastionForm';
import User from '../../../models/User';
import {
  ACCOUNT_STATUS,
  MEMBER_APPROVAL_STATUS,
} from '../../../utils/constants';
import { toObjectId } from '../../../utils/helper';
import {
  generatePaginatedResponse,
  generatePaginationOptions,
  PaginationOptions,
  parsePaginationParams,
} from '../../paginationService';

export class MembersService {
  async getAllMembersApprovedList(queryParams: any) {
    const { fromDate, toDate } = queryParams;
    console.log('Query Params:', queryParams);

    const dateMatch: any = {};
    if (fromDate || toDate) {
      dateMatch.createdAt = {};
      if (fromDate) dateMatch.createdAt.$gte = new Date(fromDate);
      if (toDate) dateMatch.createdAt.$lte = new Date(toDate);
    }

    const matchConditions: any = {
      'userDetails.approval_status': 1,
      ...dateMatch,
    };

    const membersList = await MembershipModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchConditions,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          memberCompanyName: 1,
          companyType: 1,
          plotShedNo: 1,
          roadNo: 1,
          email: 1,
          phone: 1,
          mobile: 1,
          createdAt: 1,
          membership_Id: 1,
          approval_status: '$userDetails.approval_status',
          account_status: '$userDetails.account_status',
          user_name: '$userDetails.user_name', // Adding user_name from User model
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const totalCount = await MembershipModel.countDocuments(matchConditions);

    return { membersList, totalCount };
  }

  // async getAllMembersApprovedList(queryParams: any) {
  //        const { fromDate, toDate } = queryParams;

  //   const membersList = await MembershipModel.aggregate([
  //     {
  //       $lookup: {
  //         from: "users", // Collection name of the User model
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "userDetails"
  //       }
  //     },
  //     {
  //       $unwind: {
  //         path: "$userDetails",
  //         preserveNullAndEmptyArrays: true // This ensures members without a user entry still appear in the list
  //       }
  //     },
  //     {
  //       $match: {
  //         "userDetails.approval_status": 1 // Filter only approved users
  //       }
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         userId: 1,
  //         memberCompanyName: 1,
  //         companyType: 1,
  //         plotShedNo: 1,
  //         roadNo: 1,
  //         email: 1,
  //         phone: 1,
  //         mobile: 1,
  //         createdAt: 1,
  //         membership_Id: 1,
  //         approval_status: "$userDetails.approval_status",
  //         account_status: "$userDetails.account_status" // Adding account_status from User model
  //       }
  //     },
  //     { $sort: { createdAt: -1 } } // Sorting by latest created members
  //   ]);

  //   const totalCount = await MembershipModel.countDocuments();

  //   return { membersList, totalCount };
  // }

  async getAllMembersRequestList() {
    const membersList = await MembershipModel.aggregate([
      {
        $lookup: {
          from: 'users', // Collection name of the User model
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true, // This ensures members without a user entry still appear in the list
        },
      },
      {
        $match: {
          'userDetails.approval_status': 0, // Filter only approved users
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          memberCompanyName: 1,
          companyType: 1,
          plotShedNo: 1,
          roadNo: 1,
          email: 1,
          phone: 1,
          mobile: 1,
          createdAt: 1,
          membership_Id: 1,
          approval_status: '$userDetails.approval_status',
          account_status: '$userDetails.account_status', // Adding account_status from User model
          user_name: '$userDetails.user_name', // Adding user_name from User model
        },
      },
      { $sort: { createdAt: -1 } }, // Sorting by latest created members
    ]);

    const totalCount = await MembershipModel.countDocuments();

    return { membersList, totalCount };
  }

  async activeInactiveMember(userId: string, action: number) {
    const userid = toObjectId(userId);
    const user = await User.findById(userid);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    console.log(action, 'action received');

    // Determine new status based on the action
    const newStatus = action
      ? ACCOUNT_STATUS.ACTIVE
      : ACCOUNT_STATUS.DEACTIVATED;

    // If user is already in the desired state, return early
    if (user.account_status === newStatus) {
      return {
        success: false,
        message: `User account is already ${action ? 'active' : 'deactivated'}.`,
      };
    }

    // Update user status
    await User.findByIdAndUpdate(userid, { account_status: newStatus });

    return {
      success: true,
      message: `User account has been ${action ? 'activated' : 'deactivated'} successfully.`,
    };
  }

  async memberApproval(payload: any, file: any, approved_by: ObjectId) {
    const { userId, receipt } = payload;
    const action = Number(payload.action);
    const userid = toObjectId(userId);
    const user = await User.findById(userid);
    const membershipForm = await MembershipModel.findOne({ userId: userid });
    console.log(file, 'file');

    if (!membershipForm) {
      return {
        success: false,
        message: 'Membership form not found',
      };
    }

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    console.log(action, 'action received');

    // Determine new status based on the action
    let newStatus;
    if (action === MEMBER_APPROVAL_STATUS.APPROVED) {
      newStatus = MEMBER_APPROVAL_STATUS.APPROVED;
    } else if (action === MEMBER_APPROVAL_STATUS.DECLINED) {
      newStatus = MEMBER_APPROVAL_STATUS.DECLINED;
    } else {
      newStatus = MEMBER_APPROVAL_STATUS.PENDING;
    }
    console.log(newStatus, 'newStatus');
    // If user is already in the desired state, return early
    if (user.approval_status === newStatus) {
      return {
        success: false,
        message: `User membership is already ${
          action === MEMBER_APPROVAL_STATUS.APPROVED
            ? 'approved'
            : action === MEMBER_APPROVAL_STATUS.DECLINED
              ? 'declined'
              : 'pending'
        }.`,
      };
    }
    const updateMembership: any = {};
    if (receipt) updateMembership.receipt = receipt;
    if (file && file.filename) {
      updateMembership.receiptPhoto = file.filename;
    }

    if (approved_by) {
      updateMembership.approved_by = approved_by;
    }
    console.log(updateMembership, 'updateMembership');

    if (Object.keys(updateMembership).length > 0) {
      await MembershipModel.findOneAndUpdate(
        { userId: userid },
        { $set: updateMembership }
      );
    }

    // Update user status
    await User.findByIdAndUpdate(userid, {
      approval_status: newStatus,
      is_Member: true,
    });

    return {
      success: true,
      message: `User has been ${
        action === MEMBER_APPROVAL_STATUS.APPROVED
          ? 'approved'
          : action === MEMBER_APPROVAL_STATUS.DECLINED
            ? 'declined'
            : 'set to pending'
      } successfully.`,
    };
  }
}
