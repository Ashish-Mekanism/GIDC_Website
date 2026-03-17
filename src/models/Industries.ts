
import { IIndustries  } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const IndustriesSchema: Schema<IIndustries> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Photo:{ type: String },
        IndustriesName:{ type: String },
      
    },
    { timestamps: true }
);

const Industries = model<IIndustries>(DbModel.Industries, IndustriesSchema);

export default Industries;