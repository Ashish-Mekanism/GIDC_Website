
import { IPresidentMessage, IQuickLink } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const PresidentMessageSchema: Schema<IPresidentMessage> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Photo:{ type: String },
        Title:{ type: String },
        Sub_Title:{ type: String },
        Description:{ type: String },
    },
    { timestamps: true }
);

const PresidentMessage = model<IPresidentMessage>(DbModel.PresidentMessage, PresidentMessageSchema);

export default PresidentMessage;