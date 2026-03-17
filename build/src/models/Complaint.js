"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const Counter_1 = __importDefault(require("./Counter"));
const requiredIfNotExported = function () {
    return !this.isExported;
};
const requiredIfCreatedByUser = function () {
    return !this.isCreatedByAdmin;
};
const ComplaintSchema = new mongoose_1.Schema({
    serviceNumber: { type: Number, unique: true },
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.User,
        required: !requiredIfNotExported && !requiredIfCreatedByUser,
    },
    membershipNo: { type: String },
    email: { type: String },
    mobile: { type: String },
    phone: { type: String },
    complaint_photo: [{ type: String }], // This can store image URL
    companyName: { type: String },
    personName: { type: String },
    roadNo: { type: String },
    address: { type: String },
    serviceCategory: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.ServiceCategory,
    },
    ServiceCategoryName: {
        type: String,
    },
    serviceDetails: { type: String },
    status: {
        type: Number,
        enum: Object.values(constants_1.COMPLAINT_STATUS),
    },
    assignContractor: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: constants_1.DbModel.Contractor,
    },
    assignedContractorAt: {
        type: Date,
    },
    completedServiceAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    waterConnectionNo: {
        type: String,
        required: requiredIfNotExported,
    },
    isExported: {
        type: Boolean,
        default: false,
    },
    isCreatedByAdmin: { type: Boolean, default: false },
    createdByAdminId: { type: mongoose_1.SchemaTypes.ObjectId, ref: constants_1.DbModel.User },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
function getNextSequenceValue(sequenceName) {
    return __awaiter(this, void 0, void 0, function* () {
        const sequenceDocument = yield Counter_1.default.findOneAndUpdate({ _id: sequenceName }, { $inc: { seq: 1 } }, {
            new: true,
            upsert: true,
            // Use MongoDB's default retry logic for better reliability
            runValidators: true,
        });
        return sequenceDocument.seq;
    });
}
ComplaintSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only auto-increment if this is a new document and serviceNumber is not already set
        if (this.isNew && !this.serviceNumber) {
            try {
                this.serviceNumber = yield getNextSequenceValue(constants_1.UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER);
                next();
            }
            catch (error) {
                next(error);
            }
        }
        else {
            next();
        }
    });
});
ComplaintSchema.statics.getNextServiceNumber =
    function () {
        return __awaiter(this, void 0, void 0, function* () {
            // This doesn't increment, just peeks at what the next number would be
            const counter = yield Counter_1.default.findById(constants_1.UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER);
            return ((counter === null || counter === void 0 ? void 0 : counter.seq) || 0) + 1;
        });
    };
// Static method to reset counter (useful for testing or admin operations)
ComplaintSchema.statics.resetServiceNumberCounter = function () {
    return __awaiter(this, arguments, void 0, function* (startFrom = 0) {
        yield Counter_1.default.findByIdAndUpdate(constants_1.UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER, { seq: startFrom }, { upsert: true });
    });
};
// Export the Mongoose model
const ComplaintModel = (0, mongoose_1.model)(constants_1.DbModel.Complaint, ComplaintSchema);
exports.default = ComplaintModel;
/*
What You Should Do After Import
// Find the max serviceNumber from all imported records
const maxImportedNumber = await ComplaintModel.findOne()
  .sort({ serviceNumber: -1 })
  .select('serviceNumber')
  .lean();

await Counter.findByIdAndUpdate(
  UNIQUE_COUNTER_ID.COMPLAINT_SEQUENCE_NUMBER,
  { seq: maxImportedNumber?.serviceNumber ?? 0 },
  { upsert: true }
);

*/
