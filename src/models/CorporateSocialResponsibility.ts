
import {  ICorporateSocialResponsibility } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const CorporateSocialResponsibilitySchema: Schema<ICorporateSocialResponsibility> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },

        CorporateSocialResponsibility1: { type: [String] },
        CorporateSocialResponsibility2 : {  type: [String] },
      
    },
    { timestamps: true }
);

const CorporateSocialResponsibility = model<ICorporateSocialResponsibility>(DbModel.CorporateSocialResponsibility,
     CorporateSocialResponsibilitySchema);

export default CorporateSocialResponsibility;