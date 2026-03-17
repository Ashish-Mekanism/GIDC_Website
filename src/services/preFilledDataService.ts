import { ObjectId } from 'mongoose';
import MembershipModel from '../models/MembersRegistrastionForm';

export class PreFilledDataService {
  // async getPreFilledData(userId: ObjectId): Promise<any> {
  //   const preFilledData = await MembershipModel.find(
  //     { userId: userId },
  //     'userId membership_Id memberCompanyName plotShedNo roadNo gstNo companyType email phone mobile propertyDetails user_name'
  //   ).lean();

  //   return preFilledData?.map(pre => {
  //     const waterConnectionNo = ['undefined', null, 'null'].includes(
  //       pre?.propertyDetails?.[0]?.waterConnectionNo?.toString()
  //     )
  //       ? null
  //       : pre?.propertyDetails?.[0]?.waterConnectionNo;
  //     const gstNo = ['undefined', null, 'null'].includes(pre?.gstNo?.toString())
  //       ? null
  //       : pre?.gstNo?.toString();

  //     const { propertyDetails, user_name ,...rest} = pre;
  //     return {
  //       ...rest,
  //       user_name,
  //       waterConnectionNo,
  //       gstNo,
  //     };
  //   });
  // }
async getPreFilledData(userId: ObjectId): Promise<any> {
  const preFilledData = await MembershipModel.find(
    { userId },
    'userId membership_Id memberCompanyName plotShedNo roadNo gstNo companyType email phone mobile propertyDetails'
  )
    .populate('userId', 'user_name') // ✅ fetch user_name from User model
    .lean();

  return preFilledData?.map(pre => {
    const waterConnectionNo = ['undefined', null, 'null'].includes(
      pre?.propertyDetails?.[0]?.waterConnectionNo?.toString()
    )
      ? null
      : pre?.propertyDetails?.[0]?.waterConnectionNo;

    const gstNo = ['undefined', null, 'null'].includes(pre?.gstNo?.toString())
      ? null
      : pre?.gstNo?.toString();

    const { propertyDetails, ...rest } = pre;

    return {
      ...rest,
      user_name: (pre.userId as any)?.user_name || null, // ✅ safely attach user_name
      waterConnectionNo,
      gstNo,
    };
  });
}


}
