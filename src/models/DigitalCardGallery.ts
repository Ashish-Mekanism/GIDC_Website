import { model, Schema, SchemaTypes } from "mongoose";

import { IDigitalCardGallery } from "../types/models";
import { DbModel } from "../utils/constants";

const DigitalCardGallerySchema = new Schema<IDigitalCardGallery>(
    {
        created_by: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.User
          },

        digitalCardId: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.BusinessCard,
            index: true,
            required: true,
        },

        galleryName: {
            type: String,
           
        },
        photos: [
            {
                fileName: { type: String },
            },
        ],

    },
    {
        timestamps: true, // Adds createdAt & updatedAt fields automatically
    }
);

const DigitalCardGalleryModel = model<IDigitalCardGallery>(
    DbModel.DigitalCardGallery,
    DigitalCardGallerySchema
);

export default DigitalCardGalleryModel;