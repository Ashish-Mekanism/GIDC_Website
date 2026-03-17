
import {  IMaximizingVisibility, IOurMission, IRequiredDocuments } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const RequiredDocumentsSchema: Schema<IRequiredDocuments> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        requiredDocuments : {  type: [String] },
      
    },
    { timestamps: true }
);

const RequiredDocuments = model<IRequiredDocuments>(DbModel.RequiredDocuments, RequiredDocumentsSchema);

export default RequiredDocuments;