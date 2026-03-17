import {  IForeignEmbassies } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const ForeignEmbassiesSchema: Schema<IForeignEmbassies> = new Schema(
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

const  ForeignEmbassies = model<IForeignEmbassies>(DbModel.ForeignEmbassies, ForeignEmbassiesSchema);

export default  ForeignEmbassies;