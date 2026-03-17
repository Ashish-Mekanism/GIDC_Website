
import {  IOurVision } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const OurVisionSchema: Schema<IOurVision> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },

        VisionDescription: { type: String },
        Vision : {  type: [String] },
      
    },
    { timestamps: true }
);

const OurVision = model<IOurVision>(DbModel.OurVision, OurVisionSchema);

export default OurVision;