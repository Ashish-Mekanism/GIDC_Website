"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const AdminVideoGallerySchema = new mongoose_1.Schema({
    CreatedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
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
    Poster: { type: String },
}, {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
});
const AdminVideoGallery = (0, mongoose_1.model)(constants_1.DbModel.AdminVideoGallery, AdminVideoGallerySchema);
exports.default = AdminVideoGallery;
