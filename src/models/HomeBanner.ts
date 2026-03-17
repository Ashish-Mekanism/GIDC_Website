import { IHomeBanner } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const HomeBannerSchema: Schema<IHomeBanner> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.User,
            index: true,
            required: true
        },

        Photos: [
            {
                fileName: { type: String },
            },
        ],
     
    },
    { timestamps: true }
);

const  HomeBanner = model<IHomeBanner>(DbModel.HomeBanner, HomeBannerSchema);

export default  HomeBanner;