"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const ServiceCategorySchema = new mongoose_1.Schema({
    ServiceCategoryName: { type: String, required: true, unique: true },
    active: { type: Boolean },
    key: {
        type: String,
        unique: true,
        sparse: true,
    },
});
const ServiceCategory = (0, mongoose_1.model)(constants_1.DbModel.ServiceCategory, ServiceCategorySchema);
exports.default = ServiceCategory;
