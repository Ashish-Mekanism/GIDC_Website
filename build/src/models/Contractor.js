"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const requiredIfNotExported = function () {
    return !this.isExported;
};
const ContractorSchema = new mongoose_1.Schema({
    ServiceIds: [
        {
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: constants_1.DbModel.ServiceCategory,
            index: true,
            required: requiredIfNotExported,
        },
    ],
    ContractorName: { type: String, required: true, unique: true },
    ContractorEmail: { type: String, required: requiredIfNotExported },
    isExported: { type: Boolean, default: false },
    active: { type: Boolean },
});
const Contractor = (0, mongoose_1.model)(constants_1.DbModel.Contractor, ContractorSchema);
exports.default = Contractor;
