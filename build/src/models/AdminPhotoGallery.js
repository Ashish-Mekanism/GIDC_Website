"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const AdminPhotoGallerySchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
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
const AdminPhotoGallery = (0, mongoose_1.model)(constants_1.DbModel.AdminPhotoGallery, AdminPhotoGallerySchema);
exports.default = AdminPhotoGallery;
