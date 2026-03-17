"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const GetInTouchSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true, // Adds createdAt & updatedAt fields automatically
});
const GetInTouchModel = (0, mongoose_1.model)(constants_1.DbModel.GetInTouch, GetInTouchSchema);
exports.default = GetInTouchModel;
