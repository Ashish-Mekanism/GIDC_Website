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
exports.EventService = void 0;
const fileHelper_1 = __importDefault(require("../../fileService/fileHelper"));
const fileService_1 = __importDefault(require("../../fileService/fileService"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const Event_1 = __importDefault(require("../../../models/Event"));
const helper_1 = require("../../../utils/helper");
const BookEvent_1 = __importDefault(require("../../../models/BookEvent"));
const dayjs_1 = __importDefault(require("dayjs")); // make sure dayjs is installed
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const emailService_1 = require("../../emailService");
class EventService {
    constructor() {
        this.fileHelper = new fileHelper_1.default();
        this.fileService = new fileService_1.default();
    }
    createEvent(payload, userId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { EventTitle, Description, Date, StartTime, EndTime, Registration, Speaker, Fee, Capacity, Location, UpiId, IsUpi = false, isQrCode = false, } = payload;
            // Validate required fields
            if (!EventTitle || !Date || !StartTime || !EndTime || !Registration) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
            }
            // Create a new event instance
            const newEvent = new Event_1.default({
                EventTitle,
                Description,
                Date,
                StartTime,
                EndTime,
                Registration,
                Speaker,
                Fee,
                Capacity,
                Location: {
                    LocationName: Location === null || Location === void 0 ? void 0 : Location.LocationName,
                    Address: Location === null || Location === void 0 ? void 0 : Location.Address,
                    City: Location === null || Location === void 0 ? void 0 : Location.City,
                    State: Location === null || Location === void 0 ? void 0 : Location.State,
                    PostCode: Location === null || Location === void 0 ? void 0 : Location.PostCode,
                    Country: Location === null || Location === void 0 ? void 0 : Location.Country,
                },
                Photo: ((_b = (_a = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) || null,
                QRCodePhoto: ((_d = (_c = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename) || null,
                UpiId: UpiId || null,
                IsUpi,
                isQrCode,
                CreatedBy: userId,
                Active: true,
            });
            // Save the event in the database
            yield newEvent.save();
            return newEvent;
        });
    }
    updateEvent(payload, eventId, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            console.log(files, "Received files object");
            // Find existing event
            const event = yield Event_1.default.findById((0, helper_1.toObjectId)(eventId));
            if (!event) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Event not found");
            }
            // Paths to old files
            const oldPhotoPath = event.Photo
                ? `uploads/event/${event.CreatedBy}/${event.Photo}`
                : null;
            const oldQRCodePath = event.QRCodePhoto
                ? `uploads/event/${event.CreatedBy}/${event.QRCodePhoto}`
                : null;
            // Use the new files if uploaded, else keep existing
            const newPhoto = ((_b = (_a = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) || event.Photo;
            const newQRCodePhoto = ((_d = (_c = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename) ||
                event.QRCodePhoto;
            // Merge location fields to prevent data loss
            if (payload.Location) {
                payload.Location = Object.assign(Object.assign({}, event.Location), payload.Location);
            }
            const IsQrCode = (0, helper_1.parseBool)(payload === null || payload === void 0 ? void 0 : payload.IsQrCode);
            const IsUpi = (0, helper_1.parseBool)(payload === null || payload === void 0 ? void 0 : payload.IsUpi);
            // Prepare update object
            const updateQuery = {
                $set: Object.assign(Object.assign({}, payload), { Photo: newPhoto, QRCodePhoto: IsQrCode ? newQRCodePhoto : null, UpiId: IsUpi ? payload === null || payload === void 0 ? void 0 : payload.UpiId : null, IsQrCode,
                    IsUpi }),
            };
            // Ensure Fee is included in the update
            if (payload.Fee !== undefined) {
                updateQuery.$set.Fee = payload.Fee;
            }
            // If Registration is 'FREE', remove Fee from the database
            if (payload.Registration === "FREE") {
                updateQuery.$unset = { Fee: "" };
            }
            // Update event
            const updatedEvent = yield Event_1.default.findByIdAndUpdate(eventId, updateQuery, // Use $set and $unset
            { new: true }).lean();
            // Delete old files if new ones were uploaded
            if (((_e = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.EVENT]) === null || _e === void 0 ? void 0 : _e[0]) && oldPhotoPath) {
                yield this.fileHelper.deleteFile(oldPhotoPath);
            }
            if ((((_f = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]) === null || _f === void 0 ? void 0 : _f[0]) && oldQRCodePath) ||
                (!IsQrCode && oldQRCodePath)) {
                yield this.fileHelper.deleteFile(oldQRCodePath);
            }
            if (!IsQrCode && ((_h = (_g = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.path)) {
                yield this.fileHelper.deleteFile((_k = (_j = files === null || files === void 0 ? void 0 : files[constants_1.MULTER_FIELD_NAMES.ADMIN.QRCODE]) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.path);
            }
            return updatedEvent;
        });
    }
    getUpcomingEventList() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const eventsWithBooking = yield Event_1.default.aggregate([
                {
                    $match: {
                        $expr: {
                            $gt: [
                                {
                                    $dateSubtract: {
                                        startDate: {
                                            $dateFromString: {
                                                dateString: {
                                                    $concat: ["$Date", "T", "$StartTime"],
                                                },
                                                timezone: "+05:30",
                                            },
                                        },
                                        unit: "minute",
                                        amount: 30,
                                    },
                                },
                                now,
                            ],
                        },
                    },
                },
                { $sort: { Date: 1 } },
                // keep rest unchanged
            ]);
            const totalCount = yield Event_1.default.countDocuments({
                $expr: {
                    $gt: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: { $concat: ["$Date", "T", "$StartTime"] },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30,
                            },
                        },
                        now,
                    ],
                },
            });
            return { data: eventsWithBooking, totalCount };
        });
    }
    getPastEventList() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const eventsWithBooking = yield Event_1.default.aggregate([
                {
                    $match: {
                        $expr: {
                            $lte: [
                                {
                                    $dateSubtract: {
                                        startDate: {
                                            $dateFromString: {
                                                dateString: {
                                                    $concat: ["$Date", "T", "$StartTime"],
                                                },
                                                timezone: "+05:30",
                                            },
                                        },
                                        unit: "minute",
                                        amount: 30, // 🔥 subtract 30 min
                                    },
                                },
                                now,
                            ],
                        },
                    },
                },
                { $sort: { Date: 1 } },
                // (keep remaining pipeline SAME)
            ]);
            const totalCount = yield Event_1.default.countDocuments({
                $expr: {
                    $lte: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: { $concat: ["$Date", "T", "$StartTime"] },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30,
                            },
                        },
                        now,
                    ],
                },
            });
            return { data: eventsWithBooking, totalCount };
        });
    }
    getUpcomingEventListPublic() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const events = yield Event_1.default.find({
                Active: true,
                $expr: {
                    $gt: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: {
                                            $concat: ["$Date", "T", "$StartTime"],
                                        },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30, // 🔥 30 min buffer
                            },
                        },
                        now,
                    ],
                },
            })
                .sort({ Date: 1 })
                .lean();
            const totalCount = yield Event_1.default.countDocuments({
                Active: true,
                $expr: {
                    $gt: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: { $concat: ["$Date", "T", "$StartTime"] },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30,
                            },
                        },
                        now,
                    ],
                },
            });
            return {
                data: events.map((event) => (Object.assign(Object.assign({}, event), { PhotoUrl: typeof event.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.EVENT, [
                            event.CreatedBy.toString(),
                            event.Photo,
                        ])
                        : null }))),
                totalCount,
            };
        });
    }
    getPastEventListPublic() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const events = yield Event_1.default.find({
                Active: true,
                $expr: {
                    $lte: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: {
                                            $concat: ["$Date", "T", "$StartTime"],
                                        },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30,
                            },
                        },
                        now,
                    ],
                },
            })
                .sort({ Date: -1 })
                .lean();
            const totalCount = yield Event_1.default.countDocuments({
                Active: true,
                $expr: {
                    $lte: [
                        {
                            $dateSubtract: {
                                startDate: {
                                    $dateFromString: {
                                        dateString: {
                                            $concat: ["$Date", "T", "$StartTime"],
                                        },
                                        timezone: "+05:30",
                                    },
                                },
                                unit: "minute",
                                amount: 30,
                            },
                        },
                        now,
                    ],
                },
            });
            return {
                data: events.map((event) => (Object.assign(Object.assign({}, event), { PhotoUrl: typeof event.Photo === "string"
                        ? this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.EVENT, [
                            event.CreatedBy.toString(),
                            event.Photo,
                        ])
                        : null }))),
                totalCount,
            };
        });
    }
    getEventDetails(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Retrieve the event from the database
            const event = yield Event_1.default.findById(eventId).lean();
            if (!event) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Event not found");
            }
            // Ensure CreatedBy is converted to a string
            const createdByIdString = ((_a = event.CreatedBy) === null || _a === void 0 ? void 0 : _a.toString()) || "";
            // Generate full image URL path for the event photo (only if Photo exists)
            // Generate full image URL path for the event photo (only if Photo exists)
            if (event.Photo) {
                event.Photo = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.EVENT, [createdByIdString, String(event.Photo)]);
            }
            if (event.QRCodePhoto) {
                event.QRCodePhoto = this.fileService.getFilePathFromDatabase(constants_1.FOLDER_NAMES.EVENT, [createdByIdString, String(event.QRCodePhoto)]);
            }
            return event;
        });
    }
    getEventAttendeesList(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendeesLists = yield BookEvent_1.default.find({ eventId }).lean();
            return {
                data: attendeesLists.map((attendee) => (Object.assign(Object.assign({}, attendee), { transactionPhotoUrl: typeof attendee.transactionPhoto === "string"
                        ? this.fileService.getFilePathFromDatabase("bookingTransaction", [
                            "bookingTransaction",
                            attendee.transactionPhoto,
                        ])
                        : null }))),
            };
        });
    }
    activeInactiveEvent(eventId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventIdToObjectId = (0, helper_1.toObjectId)(eventId);
            const event = yield Event_1.default.findById(eventIdToObjectId);
            if (!event) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Event not found", {}, false);
            }
            console.log(action, "action received");
            // Determine new status based on the action
            const newStatus = action ? constants_1.EVENT_STATUS.ACTIVE : constants_1.EVENT_STATUS.INACTIVE;
            // If user is already in the desired state, return early
            if (event.Active === newStatus) {
                return {
                    success: false,
                    message: `User account is already ${action ? "active" : "deactivated"}.`,
                };
            }
            // Update user status
            yield Event_1.default.findByIdAndUpdate(eventIdToObjectId, { Active: newStatus });
            return {
                success: true,
                message: `Event has been ${action ? "activated" : "deactivated"} successfully.`,
            };
        });
    }
    approveDeclineEventRegistration(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // const sendMailToUserOnEventRegistration = new SendMailToUserOnEventRegistration();
            const sendEmailTemplateMail = new emailService_1.SendEmailTemplateMail();
            if (!payload.eventId ||
                payload.action === undefined ||
                !payload.bookingId) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
            }
            const { eventId, action, bookingId } = payload;
            let statusToUpdate;
            if (action === 1) {
                statusToUpdate = constants_1.EVENT_REGISTRATION_STATUS.APPROVED;
            }
            else if (action === 0) {
                statusToUpdate = constants_1.EVENT_REGISTRATION_STATUS.DECLINED;
            }
            else {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, "Invalid action value");
            }
            const eventRegistration = yield BookEvent_1.default.findOne({
                _id: (0, helper_1.toObjectId)(bookingId),
                eventId: (0, helper_1.toObjectId)(eventId),
            })
                .populate("eventId")
                .lean();
            if (!eventRegistration) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, "Event registration not found");
            }
            const updatedRegistration = yield BookEvent_1.default.findByIdAndUpdate(bookingId, { status: statusToUpdate }, { new: true }).lean();
            // const event = await Event.findById(eventId).lean();
            // if (!event) {
            //   throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Event not found');
            // }
            // // Send Email Notification
            // const userEmail = eventRegistration.email; // Adjust if field is different
            // const eventTitle = String(event?.EventTitle || 'Event');
            // const eventDate = String(event?.Date || 'unknown date');
            if (statusToUpdate === constants_1.EVENT_REGISTRATION_STATUS.APPROVED) {
                yield sendEmailTemplateMail.sendEventEmailToUser(bookingId, constants_1.EventsEmailKeys.EVENT_REQUEST_APPROVED);
            }
            else if (statusToUpdate === constants_1.EVENT_REGISTRATION_STATUS.DECLINED) {
                yield sendEmailTemplateMail.sendEventEmailToUser(bookingId, constants_1.EventsEmailKeys.EVENT_REQUEST_DECLINED);
            }
            return {
                success: true,
                message: `Booking has been ${statusToUpdate} successfully.`,
                data: updatedRegistration,
            };
        });
    }
}
exports.EventService = EventService;
