"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const ConfigSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
}, { timestamps: true });
const ConfigModel = (0, mongoose_1.model)(constants_1.DbModel.Config, ConfigSchema);
exports.default = ConfigModel;
