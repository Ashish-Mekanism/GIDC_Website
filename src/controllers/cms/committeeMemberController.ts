import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { ICommitteeMemberBody, ISubTelephoneBody } from '../../types/requests';
import { CustomRequest } from '../../types/common';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SubTelephoneService } from '../../services/admin/subTelephone/subTelephoneService';
import { CommitteeMemberService } from '../../services/cms/committeeMemberService';

const createCommitteeMember = asyncHandler(
    async (req: CustomRequest<ICommitteeMemberBody>, res: Response) => {
        const committeeMemberService = new  CommitteeMemberService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const committeeMemberCreated = await committeeMemberService.createCommitteeMember(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Committee Member Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            committeeMemberCreated
        );
    }
);


const updateCommitteeMember = asyncHandler(

    async (req: CustomRequest<ICommitteeMemberBody>, res: Response) => {
        const committeeMemberService = new CommitteeMemberService
        const payload = req.body;
        const userid = req?.user_id
        const committeeMemberId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const CommitteeMemberUpdated = await committeeMemberService.updateCommitteeMember(payload, committeeMemberId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Committee Member Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            CommitteeMemberUpdated
        );
    }
);


const getCommitteeMemberList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const committeeMemberService = new CommitteeMemberService
        const CommitteeModelId = req?.params.id;
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const CommitteeModelList = await committeeMemberService.getCommitteeMemberList(CommitteeModelId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Committee Model List Success',
            API_RESPONSE_STATUS.SUCCESS,
            CommitteeModelList



        );
    }
);

const deleteCommitteeMember = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const committeeMemberService = new CommitteeMemberService

        const userid = req?.user_id
        const committeeMemberId = req.params.id
        
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }

        const committeeMemberSuccess = await committeeMemberService.deleteCommitteeMember(committeeMemberId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            committeeMemberSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);


export default {
    createCommitteeMember,
    updateCommitteeMember,
    getCommitteeMemberList,
    deleteCommitteeMember,
}