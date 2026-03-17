
import { IAdminContactUs } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const AdminContactUsSchema: Schema<IAdminContactUs> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Address:{ type: String },
        PhoneNumber:{ type: String },
        Email:{ type: String },
        Linkedin:{ type: String },
        Facebook:{ type: String },
        Twitter:{ type: String },
    },
    { timestamps: true }
);

const AdminContactUs = model<IAdminContactUs>(DbModel.AdminContactUs, AdminContactUsSchema);

export default AdminContactUs;