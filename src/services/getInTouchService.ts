import {IGetInTouchBody } from "../types/requests";
import GetInTouchModel from "../models/GetInTouch";
export class GetInTouchService{


    async getInTouch (payload: Partial<IGetInTouchBody>): Promise<IGetInTouchBody> {

      const  updatedPayload={
            ...payload
        }

        return await GetInTouchModel.create(updatedPayload);
}
async getInTouchList (): Promise<IGetInTouchBody[]> {
    return await GetInTouchModel.find({}).sort({ createdAt: -1 });  

}

}