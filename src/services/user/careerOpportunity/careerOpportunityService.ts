import { ObjectId } from "mongoose";
import { ICareerOpportunityBody, IDeleteCareerOpportunityBody, IUpdateCareerOpportunityBody } from "../../../types/requests";
import CareerOpportunityModel from "../../../models/CareerOpportunity";
import ApiError from "../../../utils/ApiError";
import { JOB_POSTING_STATUS, RESPONSE_CODE } from "../../../utils/constants";
import { toObjectId } from "../../../utils/helper";

export class CareerOpportunityService {

    async createCareerOpportunity(
        payload: Partial<ICareerOpportunityBody>,
        user_id: ObjectId
    ): Promise<ICareerOpportunityBody> {

        // Create a new career opportunity entry
        const careerOpportunity = new CareerOpportunityModel({
            ...payload,
            userId: user_id, // Store the user ID
            approveStatus:JOB_POSTING_STATUS.PENDING,
            isDeleted: false,
            applicationDeadline: new Date(payload.applicationDeadline || ""),
        });

        // Save to the database
        await careerOpportunity.save();

        return careerOpportunity;

    }

    async getPostedJobList(userId: ObjectId): Promise<ICareerOpportunityBody[]> {
        // Fetch all career opportunities posted by the user
        const jobList = await CareerOpportunityModel.find({ userId,isDeleted: false  }).lean();

        if (!jobList || jobList.length === 0) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "No job list found for this user.");
        }
        return jobList;
    }

    async updateCareerOpportunity(
        payload: Partial<IUpdateCareerOpportunityBody>,
        id: ObjectId,
        careerOpportunityId: string
    ): Promise<IUpdateCareerOpportunityBody> {
        // Update the career opportunity entry
        const updatedCareerOpportunity = await CareerOpportunityModel.findByIdAndUpdate(
            careerOpportunityId,
            { ...payload, applicationDeadline: new Date(payload.applicationDeadline || "") },
            { new: true }
        ).lean();

        if (!updatedCareerOpportunity) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Career opportunity not found.");
        }

        return updatedCareerOpportunity;
    }

    async deleteCareerOpportunity(
        careerOpportunityId: string
    ): Promise<{ message: string }> {
        const careerOpportunityIdToObjId = toObjectId(careerOpportunityId);
    
        const deletedCareerOpportunity = await CareerOpportunityModel.findByIdAndUpdate(
            careerOpportunityIdToObjId,
            { isDeleted: true },
            { new: true }
        ).lean();
    
        if (!deletedCareerOpportunity) {
            throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Career opportunity not found.");
        }
    
        return { message: "Career opportunity deleted successfully." };
    }
    































}