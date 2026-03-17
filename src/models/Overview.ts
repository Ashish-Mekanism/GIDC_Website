
import {  IOverview } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const OverviewSchema: Schema<IOverview> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },

        AreaOfIndustrialEstate: { type: Number },
        NoOfMembers: { type: Number },
        NoOfIndustriesInOdhav: { type: Number },

    },
    { timestamps: true }
);

const Overview = model<IOverview>(DbModel.Overview, OverviewSchema);

export default Overview;