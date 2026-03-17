import { ObjectId } from "mongoose";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import ApiError from "../../../utils/ApiError";
import {
  EVENT_REGISTRATION_STATUS,
  EVENT_STATUS,
  EventsEmailKeys,
  FOLDER_NAMES,
  MULTER_FIELD_NAMES,
  RESPONSE_CODE,
} from "../../../utils/constants";
import Event from "../../../models/Event";
import { IEventBody } from "../../../types/requests";
import { parseBool, toObjectId } from "../../../utils/helper";
import BookEvent from "../../../models/BookEvent";
import dayjs from "dayjs"; // make sure dayjs is installed
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import { SendEmailTemplateMail } from "../../emailService";

export class EventService {
  fileHelper = new FileHelper();
  fileService = new FileService();

  async createEvent(payload: any, userId: ObjectId, files: any) {
    const {
      EventTitle,
      Description,
      Date,
      StartTime,
      EndTime,
      Registration,
      Speaker,
      Fee,
      Capacity,
      Location,
      UpiId,
      IsUpi = false,
      isQrCode = false,
    } = payload;

    // Validate required fields
    if (!EventTitle || !Date || !StartTime || !EndTime || !Registration) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
    }

    // Create a new event instance
    const newEvent = new Event({
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
        LocationName: Location?.LocationName,
        Address: Location?.Address,
        City: Location?.City,
        State: Location?.State,
        PostCode: Location?.PostCode,
        Country: Location?.Country,
      },
      Photo: files?.[MULTER_FIELD_NAMES.ADMIN.EVENT]?.[0]?.filename || null,
      QRCodePhoto:
        files?.[MULTER_FIELD_NAMES.ADMIN.QRCODE]?.[0]?.filename || null,
      UpiId: UpiId || null,
      IsUpi,
      isQrCode,
      CreatedBy: userId,
      Active: true,
    });

    // Save the event in the database
    await newEvent.save();

    return newEvent;
  }

  async updateEvent(payload: Partial<IEventBody>, eventId: string, files: any) {
    console.log(files, "Received files object");

    // Find existing event
    const event = await Event.findById(toObjectId(eventId));
    if (!event) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Event not found");
    }

    // Paths to old files
    const oldPhotoPath = event.Photo
      ? `uploads/event/${event.CreatedBy}/${event.Photo}`
      : null;
    const oldQRCodePath = event.QRCodePhoto
      ? `uploads/event/${event.CreatedBy}/${event.QRCodePhoto}`
      : null;

    // Use the new files if uploaded, else keep existing
    const newPhoto =
      files?.[MULTER_FIELD_NAMES.ADMIN.EVENT]?.[0]?.filename || event.Photo;
    const newQRCodePhoto =
      files?.[MULTER_FIELD_NAMES.ADMIN.QRCODE]?.[0]?.filename ||
      event.QRCodePhoto;

    // Merge location fields to prevent data loss
    if (payload.Location) {
      payload.Location = { ...event.Location, ...payload.Location };
    }
    const IsQrCode = parseBool(payload?.IsQrCode);
    const IsUpi = parseBool(payload?.IsUpi);

    // Prepare update object
    const updateQuery: any = {
      $set: {
        ...payload,
        Photo: newPhoto,
        QRCodePhoto: IsQrCode ? newQRCodePhoto : null,
        UpiId: IsUpi ? payload?.UpiId : null,
        IsQrCode,
        IsUpi,
      },
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
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateQuery, // Use $set and $unset
      { new: true },
    ).lean();

    // Delete old files if new ones were uploaded
    if (files?.[MULTER_FIELD_NAMES.ADMIN.EVENT]?.[0] && oldPhotoPath) {
      await this.fileHelper.deleteFile(oldPhotoPath);
    }

    if (
      (files?.[MULTER_FIELD_NAMES.ADMIN.QRCODE]?.[0] && oldQRCodePath) ||
      (!IsQrCode && oldQRCodePath)
    ) {
      await this.fileHelper.deleteFile(oldQRCodePath);
    }
    if (!IsQrCode && files?.[MULTER_FIELD_NAMES.ADMIN.QRCODE]?.[0]?.path) {
      await this.fileHelper.deleteFile(
        files?.[MULTER_FIELD_NAMES.ADMIN.QRCODE]?.[0]?.path,
      );
    }

    return updatedEvent;
  }

  async getUpcomingEventList(): Promise<any> {
    const now = new Date();

    const eventsWithBooking = await Event.aggregate([
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

    const totalCount = await Event.countDocuments({
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
  }

  async getPastEventList(): Promise<any> {
    const now = new Date();

    const eventsWithBooking = await Event.aggregate([
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

    const totalCount = await Event.countDocuments({
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
  }

  async getUpcomingEventListPublic(): Promise<any> {
    const now = new Date();

    const events = await Event.find({
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

    const totalCount = await Event.countDocuments({
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
      data: events.map((event) => ({
        ...event,
        PhotoUrl:
          typeof event.Photo === "string"
            ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.EVENT, [
                event.CreatedBy.toString(),
                event.Photo,
              ])
            : null,
      })),
      totalCount,
    };
  }

  async getPastEventListPublic(): Promise<any> {
    const now = new Date();

    const events = await Event.find({
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

    const totalCount = await Event.countDocuments({
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
      data: events.map((event) => ({
        ...event,
        PhotoUrl:
          typeof event.Photo === "string"
            ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.EVENT, [
                event.CreatedBy.toString(),
                event.Photo,
              ])
            : null,
      })),
      totalCount,
    };
  }

  async getEventDetails(eventId: string): Promise<any> {
    // Retrieve the event from the database
    const event = await Event.findById(eventId).lean();

    if (!event) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Event not found");
    }

    // Ensure CreatedBy is converted to a string
    const createdByIdString = event.CreatedBy?.toString() || "";

    // Generate full image URL path for the event photo (only if Photo exists)
    // Generate full image URL path for the event photo (only if Photo exists)
    if (event.Photo) {
      event.Photo = this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.EVENT,
        [createdByIdString, String(event.Photo)], // Pass an array of submodules
      );
    }

    if (event.QRCodePhoto) {
      event.QRCodePhoto = this.fileService.getFilePathFromDatabase(
        FOLDER_NAMES.EVENT,
        [createdByIdString, String(event.QRCodePhoto)], // Pass an array of submodules
      );
    }
    return event;
  }

  async getEventAttendeesList(eventId: string): Promise<any> {
    const attendeesLists = await BookEvent.find({ eventId }).lean();

    return {
      data: attendeesLists.map((attendee) => ({
        ...attendee,
        transactionPhotoUrl:
          typeof attendee.transactionPhoto === "string"
            ? this.fileService.getFilePathFromDatabase("bookingTransaction", [
                "bookingTransaction",
                attendee.transactionPhoto,
              ])
            : null,
      })),
    };
  }

  async activeInactiveEvent(eventId: string, action: boolean) {
    const eventIdToObjectId = toObjectId(eventId);
    const event = await Event.findById(eventIdToObjectId);

    if (!event) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "Event not found", {}, false);
    }

    console.log(action, "action received");

    // Determine new status based on the action
    const newStatus = action ? EVENT_STATUS.ACTIVE : EVENT_STATUS.INACTIVE;

    // If user is already in the desired state, return early
    if (event.Active === newStatus) {
      return {
        success: false,
        message: `User account is already ${action ? "active" : "deactivated"}.`,
      };
    }

    // Update user status
    await Event.findByIdAndUpdate(eventIdToObjectId, { Active: newStatus });

    return {
      success: true,
      message: `Event has been ${action ? "activated" : "deactivated"} successfully.`,
    };
  }

  async approveDeclineEventRegistration(payload: any, userId: ObjectId) {
    // const sendMailToUserOnEventRegistration = new SendMailToUserOnEventRegistration();
    const sendEmailTemplateMail = new SendEmailTemplateMail();
    if (
      !payload.eventId ||
      payload.action === undefined ||
      !payload.bookingId
    ) {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Missing required fields");
    }

    const { eventId, action, bookingId } = payload;

    let statusToUpdate: string;
    if (action === 1) {
      statusToUpdate = EVENT_REGISTRATION_STATUS.APPROVED;
    } else if (action === 0) {
      statusToUpdate = EVENT_REGISTRATION_STATUS.DECLINED;
    } else {
      throw new ApiError(RESPONSE_CODE.BAD_REQUEST, "Invalid action value");
    }

    const eventRegistration = await BookEvent.findOne({
      _id: toObjectId(bookingId),
      eventId: toObjectId(eventId),
    })
      .populate("eventId")
      .lean();

    if (!eventRegistration) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        "Event registration not found",
      );
    }

    const updatedRegistration = await BookEvent.findByIdAndUpdate(
      bookingId,
      { status: statusToUpdate },
      { new: true },
    ).lean();

    // const event = await Event.findById(eventId).lean();
    // if (!event) {
    //   throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'Event not found');
    // }
    // // Send Email Notification
    // const userEmail = eventRegistration.email; // Adjust if field is different
    // const eventTitle = String(event?.EventTitle || 'Event');
    // const eventDate = String(event?.Date || 'unknown date');

    if (statusToUpdate === EVENT_REGISTRATION_STATUS.APPROVED) {
      await sendEmailTemplateMail.sendEventEmailToUser(
        bookingId,
        EventsEmailKeys.EVENT_REQUEST_APPROVED,
      );
    } else if (statusToUpdate === EVENT_REGISTRATION_STATUS.DECLINED) {
      await sendEmailTemplateMail.sendEventEmailToUser(
        bookingId,
        EventsEmailKeys.EVENT_REQUEST_DECLINED,
      );
    }

    return {
      success: true,
      message: `Booking has been ${statusToUpdate} successfully.`,
      data: updatedRegistration,
    };
  }
}
