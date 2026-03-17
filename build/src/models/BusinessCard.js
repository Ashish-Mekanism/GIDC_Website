"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const BusinessCardSchema = new mongoose_1.Schema({
    created_by: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User
    },
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: true,
    },
    name: { type: String },
    organisation: { type: String },
    websiteUrl: { type: String },
    jobTitle: { type: String },
    phone: { type: String },
    officePhone: { type: String },
    whatsappNo: { type: String },
    email: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    socialMedia: {
        facebookUrl: { type: String },
        twitterUrl: { type: String },
        googleUrl: { type: String },
        instagramUrl: { type: String },
        linkedInUrl: { type: String },
        youtubeUrl: { type: String },
        pinterestUrl: { type: String },
        mapUrl: { type: String },
    },
    aboutProfile: { type: String },
    profilePhoto: { type: String },
    active: { type: Boolean },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Export the Mongoose model
const BusinessCardModel = (0, mongoose_1.model)(constants_1.DbModel.BusinessCard, BusinessCardSchema);
exports.default = BusinessCardModel;
