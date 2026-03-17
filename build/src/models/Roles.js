"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const RoleSchema = new mongoose_1.Schema({
    role_Name: { type: String, required: true, unique: true },
});
const Role = (0, mongoose_1.model)(constants_1.DbModel.Role, RoleSchema);
exports.default = Role;
