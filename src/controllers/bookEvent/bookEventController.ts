import { CustomRequest } from "../../types/common";
import asyncHandler from "../../utils/asyncHandler";
import { Response } from 'express';
import { SuccessResponseWithData } from "../../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../../utils/constants";
import { IBookEventBody } from "../../types/requests";
import { BookEventService } from "../../services/user/bookEvent/bookEventService";
import { EventService } from "../../services/admin/event/eventService";


const bookEvent = asyncHandler(
    async (req: CustomRequest<IBookEventBody>, res: Response) => {
        const bookEventService = new BookEventService

        const payload = req?.body;
        const file = req?.file;
        
        const eventCreated = await bookEventService.bookEvent(payload,file)

        SuccessResponseWithData(
            res,
            RESPONSE_CODE.CREATED,
            'Event Booked Successfully',
            API_RESPONSE_STATUS.SUCCESS,
            eventCreated
        );
    }
);



export default {
    bookEvent, 
}