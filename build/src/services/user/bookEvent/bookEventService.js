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
exports.BookEventService = void 0;
const BookEvent_1 = __importDefault(require("../../../models/BookEvent"));
const helper_1 = require("../../../utils/helper");
const Event_1 = __importDefault(require("../../../models/Event"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const emailService_1 = require("../../emailService");
class BookEventService {
    constructor() {
        this.sendEmailTemplateMail = new emailService_1.SendEmailTemplateMail();
    }
    bookEvent(payload, file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { eventId, name, email, phone, companyName, comment, transactionId, personCount, } = payload;
            if (!eventId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Event ID is required.');
            }
            const eventExist = yield Event_1.default.findById((0, helper_1.toObjectId)(eventId));
            if (!eventExist) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, 'Event not found.');
            }
            if (!personCount) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Person count is required.');
            }
            if (isNaN(+personCount)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Person count must be a valid number.');
            }
            if (+personCount < 1) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Person count should be 1 or more.');
            }
            const transactionPhoto = (file === null || file === void 0 ? void 0 : file.filename) || null;
            // Create a new booking instance
            const bookEvent = new BookEvent_1.default({
                eventId: (0, helper_1.toObjectId)(eventId),
                name,
                email,
                phone,
                companyName,
                comment,
                //userId, // Associate the booking with the user
                transactionId,
                transactionPhoto: transactionPhoto,
                eventDate: eventExist.Date,
                personCount: +personCount,
            });
            // Save the booking in the database
            const userBooking = yield bookEvent.save();
            yield this.sendEmailTemplateMail.sendEventEmailToUser((_a = userBooking === null || userBooking === void 0 ? void 0 : userBooking._id) === null || _a === void 0 ? void 0 : _a.toString(), constants_1.EventsEmailKeys.EVENT_REQUEST_RECEIVED_USER);
            yield this.sendEmailTemplateMail.sendEventEmailToAdmin((_b = userBooking === null || userBooking === void 0 ? void 0 : userBooking._id) === null || _b === void 0 ? void 0 : _b.toString());
            return bookEvent;
        });
    }
}
exports.BookEventService = BookEventService;
