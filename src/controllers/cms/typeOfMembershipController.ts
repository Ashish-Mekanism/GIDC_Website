import { CustomRequest } from '../../types/common';
import {  ITypeOfMembershipBody } from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { TypeOfMembershipService } from '../../services/cms/typeOfMembershipService';


const createTypeOfMembership = asyncHandler(
    async (req: CustomRequest<ITypeOfMembershipBody>, res: Response) => {
        const typeOfMembershipService = new TypeOfMembershipService
        const payload = req?.body;
        const userid = req?.user_id;

        console.log(payload, 'payload');
        console.log(userid, 'userid');

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const typeOfMembershipCreated = await typeOfMembershipService.createTypeOfMembership(payload, userid)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Type Of Membership Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            typeOfMembershipCreated
        );
    }
);

const getTypeOfMembership = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const typeOfMembershipService = new TypeOfMembershipService

        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required .");
        }

        const getTypeOfMembershipSuccess = await typeOfMembershipService.getTypeOfMembership()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Type Of Membership Success',
            API_RESPONSE_STATUS.SUCCESS,
            getTypeOfMembershipSuccess



        );
    }
);

const updateTypeOfMembership = asyncHandler(

    async (req: CustomRequest<ITypeOfMembershipBody>, res: Response) => {
        const typeOfMembershipService = new TypeOfMembershipService
        const payload = req.body;
        const userid = req?.user_id
        const typeOfMembershipId = req?.params.id



        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const ourVisionUpdated = await typeOfMembershipService.updateTypeOfMembership(payload, typeOfMembershipId)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Type Of MembershipId Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            ourVisionUpdated
        );
    }
);

const deleteTypeOfMembership = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const typeOfMembershipService = new TypeOfMembershipService

        const userid = req?.user_id
        const typeOfMembershipId = req.params.id
        
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required.");
        }

        const typeOfMembershipSuccess = await typeOfMembershipService.deleteTypeOfMembership(typeOfMembershipId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            typeOfMembershipSuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default {
    createTypeOfMembership,
    updateTypeOfMembership,
    getTypeOfMembership,
    deleteTypeOfMembership,
}