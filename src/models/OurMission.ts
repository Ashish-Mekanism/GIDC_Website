
import {  IOurMission } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const OurMissionSchema: Schema<IOurMission> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },

        MissionDescription: { type: String },
        Mission : {  type: [String] },
      
    },
    { timestamps: true }
);

const OurMission = model<IOurMission>(DbModel.OurMission, OurMissionSchema);

export default OurMission;