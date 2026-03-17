import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import { IAdminPhotoGallery, IServiceCategory } from "../types/models";





const AdminPhotoGallerySchema: Schema<IAdminPhotoGallery> = new Schema({
    CreatedBy: {
        type: SchemaTypes.ObjectId,
        ref: DbModel.User,
        index: true,
        required: true
    },

    Heading: { type: String, required: true, unique: true },
    SeminarBy: { type: String, require: true },
    Date: { type: Date },
    Photos: [
        {
            fileName: { type: String },
        },
    ],
}, {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
});


const AdminPhotoGallery = model<IAdminPhotoGallery>(DbModel.AdminPhotoGallery, AdminPhotoGallerySchema);

export default AdminPhotoGallery;


