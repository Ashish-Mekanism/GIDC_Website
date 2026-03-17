"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const DigitalCardSilderSchema = new mongoose_1.Schema({
    created_by: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User
    },
    digitalCardId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.BusinessCard,
        index: true,
        required: true,
    },
    photos: [
        {
            fileName: { type: String },
        },
    ],
}, {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
});
const DigitalCardSliderModel = (0, mongoose_1.model)(constants_1.DbModel.DigitalCardSlider, DigitalCardSilderSchema);
exports.default = DigitalCardSliderModel;
