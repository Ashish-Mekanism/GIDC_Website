
import {  IServiceAndFacility  } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const ServiceAndFacilitySchema: Schema<IServiceAndFacility> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Photo:{ type: String },
        ServiceName:{ type: String },
        ServiceDescription:{ type: String },
      
    },
    { timestamps: true }
);

const ServiceAndFacility = model<IServiceAndFacility>(DbModel.ServiceAndFacility, ServiceAndFacilitySchema);

export default ServiceAndFacility;