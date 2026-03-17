import { Response } from "express";
import { SendGridService } from "../services/sendGrid";
import { SuccessResponseWithoutData } from "../utils/responses";
import { API_RESPONSE_STATUS, RESPONSE_CODE } from "../utils/constants";
import asyncHandler from "../utils/asyncHandler";
import { CustomRequest } from "../types/common";
import BookEvent from "../models/BookEvent";
import { log } from "console";
import { ISendMailToPastEventAttendeesBody } from "../types/requests";
import { toObjectId } from "../utils/helper";
import Event from "../models/Event";
import dayjs from "dayjs";

const sgService = new SendGridService();

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

const sendEventReminderToPastAttendees = asyncHandler(
    async (req: CustomRequest<ISendMailToPastEventAttendeesBody>, res: Response) => {
      const { eventId } = req.body;
  const eventIdToObjectId= toObjectId(eventId)
      if (!eventId) {
        throw new Error("Event ID is required.");
      }
  
      // Fetch event details
      const event = await Event.findById(eventIdToObjectId).lean();
      if (!event) {
        throw new Error("Event not found.");
      }
  
      // Today's date in YYYY-MM-DD format
      const today = dayjs().format("YYYY-MM-DD");
  
      // Fetch past approved attendees
      const pastAttendees = await BookEvent.find(
        {
          eventDate: { $lt: today },
          status: "approved",
        },
        { email: 1 }
      ).lean();
  
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
  
      await sgService.sendEmail(
        emails,
        `You're Invited: ${event.EventTitle}`,
        htmlContent,
        textContent
      );
  
      SuccessResponseWithoutData(
        res,
        RESPONSE_CODE.SUCCESS,
        "Up-Comming event emails sent to past attendees successfully",
        API_RESPONSE_STATUS.SUCCESS
      );
    }
  );
export default {
  sendEventReminderToPastAttendees,
};
