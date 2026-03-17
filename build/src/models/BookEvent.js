"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const BookEventSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: constants_1.DbModel.Event,
        required: true,
    },
    eventDate: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: false },
    comment: { type: String, required: false },
    transactionId: { type: String, required: false },
    transactionPhoto: { type: String, required: false },
    status: {
        type: String,
        enum: Object.values(constants_1.EVENT_REGISTRATION_STATUS),
        default: constants_1.EVENT_REGISTRATION_STATUS.PENDING,
    },
    personCount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
const BookEvent = (0, mongoose_1.model)(constants_1.DbModel.BookEvent, BookEventSchema);
exports.default = BookEvent;
