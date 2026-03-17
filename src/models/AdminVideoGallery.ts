import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import {  IAdminVideoGallery } from "../types/models";


const AdminVideoGallerySchema: Schema<IAdminVideoGallery> = new Schema({
    CreatedBy: {
        type: SchemaTypes.ObjectId,
        ref: DbModel.User,
        index: true,
        required: true
    },

    Heading: { type: String, required: true, unique: true },
   
    Date: { type: Date },
    Videos: [
        {
            fileName: { type: String },
        },
    ],
    Poster: { type: String},
}, {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
});


const AdminVideoGallery = model<IAdminVideoGallery>(DbModel.AdminVideoGallery, AdminVideoGallerySchema);

export default AdminVideoGallery;


