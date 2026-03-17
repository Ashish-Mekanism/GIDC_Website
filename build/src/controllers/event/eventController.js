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
const eventService_1 = require("../../services/admin/event/eventService");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const responses_1 = require("../../utils/responses");
const constants_1 = require("../../utils/constants");
const createEvent = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const files = req.files;
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const eventCreated = yield eventService.createEvent(payload, userid, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Event Created Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventCreated);
}));
const updateEvent = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const payload = req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const eventId = req === null || req === void 0 ? void 0 : req.params.id;
    const files = req === null || req === void 0 ? void 0 : req.files;
    if (!userid) {
        throw new Error('User ID is required to update a member.');
    }
    const eventUpdated = yield eventService.updateEvent(payload, eventId, files);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.SUCCESS, 'Sub Telephone Uspdated Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventUpdated);
}));
const getUpComingEventList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, ' userid');
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const eventList = yield eventService.getUpcomingEventList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Event List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventList);
}));
const getPastEventList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    console.log(userid, ' userid');
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const eventList = yield eventService.getPastEventList();
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Past Event List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventList);
}));
const getEventDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const eventId = req.params.id;
    console.log(userid, ' userid');
    console.log(eventId, ' eventId');
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const photoGallery = yield eventService.getEventDetails(eventId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Photo Gallery Success', constants_1.API_RESPONSE_STATUS.SUCCESS, photoGallery);
}));
const getEventAttendeesList = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    const eventId = req.params.id;
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const eventList = yield eventService.getEventAttendeesList(eventId);
    (0, responses_1.SuccessResponseWithData)(res, constants_1.RESPONSE_CODE.CREATED, 'Event List Success', constants_1.API_RESPONSE_STATUS.SUCCESS, eventList);
}));
const eventActiveInactive = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const payload = req.body;
    const eventId = payload.eventId;
    const action = payload.action;
    console.log(payload, 'paylooadd');
    const approvalStatus = yield eventService.activeInactiveEvent(eventId, action);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, approvalStatus.message, // Use the message from the `approvalStatus` object
    constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
const approveDeclineEventRegistration = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventService = new eventService_1.EventService();
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const userid = req === null || req === void 0 ? void 0 : req.user_id;
    if (!userid) {
        throw new Error('User ID is required.');
    }
    const registrationAction = yield eventService.approveDeclineEventRegistration(payload, userid);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.CREATED, registrationAction.message, constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    createEvent,
    updateEvent,
    getUpComingEventList,
    getPastEventList,
    getEventDetails,
    getEventAttendeesList,
    eventActiveInactive,
    approveDeclineEventRegistration,
};
