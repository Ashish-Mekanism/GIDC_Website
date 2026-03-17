import { model, Schema } from "mongoose";

import { IGetInTouch } from "../types/models";
import { DbModel } from "../utils/constants";

const GetInTouchSchema = new Schema<IGetInTouch>(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true, // Adds createdAt & updatedAt fields automatically
    }
);

const GetInTouchModel = model<IGetInTouch>(
    DbModel.GetInTouch,
    GetInTouchSchema
);

export default GetInTouchModel;