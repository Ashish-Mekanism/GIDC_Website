
import {  IMaximizingVisibility, IOurMission } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const MaximizingVisibilitySchema: Schema<IMaximizingVisibility> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        maximizingVisibility : {  type: [String] },
      
    },
    { timestamps: true }
);

const MaximizingVisibility = model<IMaximizingVisibility>(DbModel.MaximizingVisibility, MaximizingVisibilitySchema);

export default MaximizingVisibility;