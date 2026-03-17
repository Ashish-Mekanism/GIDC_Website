import { MembersService } from "../../../services/admin/members/adminMembershipService";
import { CustomRequest } from "../../../types/common";
import { IActiveInactiveMember, IBecomeAMemberBody, IMemberApprovalBody, IPaginationQuery } from "../../../types/requests";
import asyncHandler from "../../../utils/asyncHandler";
import { Response, Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { SuccessResponseWithData, SuccessResponseWithoutData } from "../../../utils/responses";
import { API_RESPONSE_STATUS, MEMBER_APPROVAL_STATUS, RESPONSE_CODE } from "../../../utils/constants";
import { MembershipFormService } from "../../../services/user/membershipForm/membershipFormService";
import { toObjectId } from "../../../utils/helper";
import { Types } from 'mongoose';
import User from "../../../models/User";

//ADMIN************ADMIN//


const createAMember = asyncHandler(

    async (req: CustomRequest<IBecomeAMemberBody>, res: Response) => {
        const membershipFormService = new MembershipFormService
        // const payload = req.body;
        const userid = req?.params.id;
        const payload = { ...req.body, createdBy: req.user_id };
        const files = req?.files
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const MembershipRegistrationformCreated = await membershipFormService.becomeAMember(payload, userid, files)
        const user = await User.findById(userid)

        if (user) {
            user.approval_status = MEMBER_APPROVAL_STATUS.PENDING;
            await user.save(); // Save the changes 
        }

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Membership Register Success ',
            API_RESPONSE_STATUS.SUCCESS,
            MembershipRegistrationformCreated
        );
    }
);


const getMembersApprovedList = asyncHandler(
    async (
        req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
        res: Response
    ) => {

        const membersService = new MembersService
        const reqQuery = req.query

        const getMmebersList = await membersService.getAllMembersApprovedList(reqQuery)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,

            'Members Approved List Success',
            API_RESPONSE_STATUS.SUCCESS,
            getMmebersList

        );
    }
);

const getMembersRequestList = asyncHandler(
    async (
        req: CustomRequest<Request, ParamsDictionary, IPaginationQuery>,
        res: Response
    ) => {

        const membersService = new MembersService
        //const reqQuery = req.query

        const getMmebersList = await membersService.getAllMembersRequestList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,

            'Members Request List Success',
            API_RESPONSE_STATUS.SUCCESS,
            getMmebersList

        );
    }
);

const getMemberDetails = asyncHandler(async (req: CustomRequest, res: Response) => {
    const membershipFormService = new MembershipFormService();
    const UserId = req?.params.id;


    const UserIdToObjectId = toObjectId(UserId);
    console.log(UserId, "userid");

    if (!UserIdToObjectId) {
        throw new Error("User ID is required.");
    }

    const GetMemberDetails = await membershipFormService.getMemberDetails(UserIdToObjectId)
    SuccessResponseWithData(
        res,
        RESPONSE_CODE.CREATED,
        'Member Details Success',
        API_RESPONSE_STATUS.SUCCESS,
        GetMemberDetails
    );
}
)

const updateMembershipForm = asyncHandler(

    async (req: CustomRequest<IBecomeAMemberBody>, res: Response) => {
        const membershipFormService = new MembershipFormService
        const payload = req.body;
        const userid = req?.params.id;
        const UserIdToObjectId = toObjectId(userid);
        const files = req?.files
        console.log(UserIdToObjectId, "UserIdToObjectId");
        console.log(payload, "payload");

        if (!UserIdToObjectId) {
            throw new Error("User ID is required.");
        }
        const MembershipRegistrationformUpdated = await membershipFormService.updateMembershipForm(payload, UserIdToObjectId, files)
        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Membership Form Updated Successfully',
            API_RESPONSE_STATUS.SUCCESS,
            MembershipRegistrationformUpdated
        );
    }
);

const memberActiveInactive = asyncHandler(
    async (req: CustomRequest<IActiveInactiveMember>, res: Response) => {
        const membersService = new MembersService();
        const payload = req.body;
        const user_id = payload.userId;
        const action = payload.action;

        console.log(payload, 'paylooadd');

        const approvalStatus = await membersService.activeInactiveMember(
            user_id,
            action
        );

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            approvalStatus.message, // Use the message from the `approvalStatus` object
            API_RESPONSE_STATUS.SUCCESS
        );
    }
);

const approveMember = asyncHandler(
    async (req: CustomRequest<IMemberApprovalBody>, res: Response) => {
        const membersService = new MembersService();
        const payload = req.body;
        const approved_by = req.user_id;
        
        const file = req?.file

        console.log(payload, 'paylooadd');
        if (!approved_by) {
            throw new Error("User ID is required to become a member.");
        }

        const approvalStatus = await membersService.memberApproval(
            payload,
            file,
            approved_by
        );

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            approvalStatus.message, // Use the message from the `approvalStatus` object
            API_RESPONSE_STATUS.SUCCESS
        );
    }
);


export default {
    getMembersApprovedList,
    getMemberDetails,
    updateMembershipForm,
    memberActiveInactive,
    approveMember,
    createAMember,
    getMembersRequestList,

}