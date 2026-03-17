import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import { IDigitalCardSlider } from "../types/models";

const DigitalCardSilderSchema = new Schema<IDigitalCardSlider>(
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

const DigitalCardSliderModel = model<IDigitalCardSlider>(
    DbModel.DigitalCardSlider,
    DigitalCardSilderSchema
);

export default DigitalCardSliderModel;