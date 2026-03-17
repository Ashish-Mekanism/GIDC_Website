import { Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { CustomRequest } from '../../types/common';
import { IServiceAndFacilityBody} from '../../types/requests';
import { API_RESPONSE_STATUS, RESPONSE_CODE } from '../../utils/constants';
import { SuccessResponseWithData, SuccessResponseWithoutData } from '../../utils/responses';
import { ServiceAndFacilityService } from '../../services/cms/serviceAndFacilityService';



const createServiceAndFacility = asyncHandler(
    async (req: CustomRequest<IServiceAndFacilityBody>, res: Response) => {
        const serviceAndFacilityService = new ServiceAndFacilityService

        const payload = req?.body;
        const userid = req?.user_id;
        const file = req.file;

        console.log(payload, 'payload');
        console.log(userid, 'userid');
        console.log(file, 'file');


        if (!userid) {
            throw new Error("User ID is required.");
        }

        const serviceAndFacilityCreated = await serviceAndFacilityService.createServiceAndFacility(payload, userid, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Service And Facility Created Success',
            API_RESPONSE_STATUS.SUCCESS,
            serviceAndFacilityCreated
        );
    }
);

const getServiceAndFacilityList = asyncHandler(
    async (
        req: CustomRequest<Request>,
        res: Response
    ) => {
        const serviceAndFacilityService = new ServiceAndFacilityService
   
        const userid = req?.user_id
        console.log(userid, " userid");

        if (!userid) {
            throw new Error("User ID is required.");
        }

        const serviceAndFacilityList = await serviceAndFacilityService.getServiceAndFacilityList()

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.SUCCESS,
            'Service And Facility  List Success',
            API_RESPONSE_STATUS.SUCCESS,
            serviceAndFacilityList


        );
    }
);

const updateServiceAndFacility = asyncHandler(

    async (req: CustomRequest<IServiceAndFacilityBody>, res: Response) => {
        const serviceAndFacilityService = new ServiceAndFacilityService
        const payload = req.body;
        const userid = req?.user_id
        const serviceAndFacilityListId = req?.params.id
        const file = req?.file
        console.log(file, " imagess");
        console.log(payload, " payload");


        if (!userid) {
            throw new Error("User ID is required to update a member.");
        }

        const serviceAndFacilityUpdated = await serviceAndFacilityService.updateServiceAndFacility(payload, serviceAndFacilityListId, file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Service And Facility  Updated Success ',
            API_RESPONSE_STATUS.SUCCESS,
            serviceAndFacilityUpdated
        );
    }
);

const deleteServiceAndFacility = asyncHandler(

    async (req: CustomRequest, res: Response) => {
        const serviceAndFacilityService = new ServiceAndFacilityService

        const userid = req?.user_id
        const industryId = req.params.id


      
        console.log(userid, " userid");
        if (!userid) {
            throw new Error("User ID is required to become a member.");
        }

        const serviceAndFacilitySuccess = await serviceAndFacilityService.deleteServiceAndFacility(industryId)

        SuccessResponseWithoutData(
            res,
            RESPONSE_CODE.SUCCESS,
            serviceAndFacilitySuccess.message,
            API_RESPONSE_STATUS.SUCCESS,
          


        );
    }
);

export default{

    createServiceAndFacility,
    updateServiceAndFacility,
    getServiceAndFacilityList,
    deleteServiceAndFacility,

}