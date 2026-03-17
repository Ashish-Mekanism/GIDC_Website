
import { IBusinessBulletin, IPresidentMessage, IQuickLink } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const BusinessBulletinSchema: Schema<IBusinessBulletin> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Photo:{ type: String },
        Title:{ type: String },
    
    },
    { timestamps: true }
);

const BusinessBulletin = model<IBusinessBulletin>(DbModel.BusinessBulletin, BusinessBulletinSchema);

export default BusinessBulletin;