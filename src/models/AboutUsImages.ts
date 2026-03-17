import {  IAboutUsImages } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const AboutUsSchema: Schema<IAboutUsImages> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.User,
            index: true,
            required: true
        },

        OverviewImage: [
            {
                fileName: { type: String },
            },
        ],
            CorporateSocialResponsibilityImage: [
            {
                fileName: { type: String },
            },
        ],
     
    },
    { timestamps: true }
);

const  AboutUs = model<IAboutUsImages>(DbModel.AboutUsSchema, AboutUsSchema);

export default  AboutUs;