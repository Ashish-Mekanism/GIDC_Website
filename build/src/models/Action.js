"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const ActionSchema = new mongoose_1.Schema({
    Action: { type: String, required: true, unique: true },
});
const Action = (0, mongoose_1.model)(constants_1.DbModel.Action, ActionSchema);
exports.default = Action;
