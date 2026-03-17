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
const sendGrid_1 = require("../services/sendGrid");
const responses_1 = require("../utils/responses");
const constants_1 = require("../utils/constants");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const BookEvent_1 = __importDefault(require("../models/BookEvent"));
const helper_1 = require("../utils/helper");
const Event_1 = __importDefault(require("../models/Event"));
const dayjs_1 = __importDefault(require("dayjs"));
const sgService = new sendGrid_1.SendGridService();
// const sendTestEmail = asyncHandler(
//     async (req: CustomRequest<ISendMailToPastEventAttendeesBody>, res: Response) => {
//         // Fetch emails from BookEvent collection
//         const events = await BookEvent.find({}, { email: 1 }).lean();
//         // Extract unique valid emails
//         const emails = [
//             ...new Set(events.map(event => event.email).filter(Boolean)),
//         ];
//         log("Emails: ", emails);
//         if (emails.length === 0) {
//             throw new Error("No valid emails found in BookEvent records.");
//         }
//         await sgService.sendEmail(
//             emails,
//             "Reminder: Your Upcoming Event!",
//             `<p>Hi there, this is a reminder about your upcoming event. See you soon!</p>`,
//             "Hi there, this is a reminder about your upcoming event. See you soon!"
//         );
//         SuccessResponseWithoutData(
//             res,
//             RESPONSE_CODE.SUCCESS,
//             "Bulk email sent successfully",
//             API_RESPONSE_STATUS.SUCCESS
//         );
//     }
// );
const sendEventReminderToPastAttendees = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId } = req.body;
    const eventIdToObjectId = (0, helper_1.toObjectId)(eventId);
    if (!eventId) {
        throw new Error("Event ID is required.");
    }
    // Fetch event details
    const event = yield Event_1.default.findById(eventIdToObjectId).lean();
    if (!event) {
        throw new Error("Event not found.");
    }
    // Today's date in YYYY-MM-DD format
    const today = (0, dayjs_1.default)().format("YYYY-MM-DD");
    // Fetch past approved attendees
    const pastAttendees = yield BookEvent_1.default.find({
        eventDate: { $lt: today },
        status: "approved",
    }, { email: 1 }).lean();
    const emails = [
        ...new Set(pastAttendees.map((attendee) => attendee.email).filter(Boolean)),
    ];
    console.log("Emails: ", emails);
    if (emails.length === 0) {
        throw new Error("No past approved attendees found for this event.");
    }
    // Construct event detail URL
    const eventLink = `https://oia-app.netlify.app/event-details/${eventId}`;
    // Construct email HTML and text content
    const htmlContent = `
        <p>Hi there,</p>
        <p>We hope you enjoyed our previous events!</p>
        <p>We have an upcoming event you might be interested in:</p>
        <h2>${event.EventTitle}</h2>
        <p><strong>Date:</strong> ${event.Date}</p>
        <p><strong>Time:</strong> ${event.StartTime} - ${event.EndTime}</p>
        <p><strong>Speaker:</strong> ${event.Speaker}</p>
      
        <p>${event.Description}</p>
        <p><a href="${eventLink}">Click here to view and book this event</a></p>
        <p>Looking forward to seeing you there!</p>
      `;
    const textContent = `
  Hi there,
  
  We hope you enjoyed our previous events!
  
  We have an upcoming event you might be interested in:
  
  Event: ${event.EventTitle}
  Date: ${event.Date}
  Time: ${event.StartTime} - ${event.EndTime}
  Speaker: ${event.Speaker}
 
  
  ${event.Description}
  
  Click here to view and book this event: ${eventLink}
  
  Looking forward to seeing you there!
  `;
    yield sgService.sendEmail(emails, `You're Invited: ${event.EventTitle}`, htmlContent, textContent);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Up-Comming event emails sent to past attendees successfully", constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    sendEventReminderToPastAttendees,
};
