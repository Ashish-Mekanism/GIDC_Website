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
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const constants_1 = require("../utils/constants");
const responses_1 = require("../utils/responses");
const sendGrid_1 = require("../services/sendGrid");
const ApplyJob_1 = __importDefault(require("../models/ApplyJob")); // Adjust the import path as needed
const config_1 = __importDefault(require("../config"));
const node_console_1 = require("node:console");
const sgService = new sendGrid_1.SendGridService();
// Replace with your actual production base URL for resume access
const RESUME_BASE_URL = `${config_1.default.BaseUrl}/uploads/resume/resume`;
;
const sendJobSeekerDetails = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobSeekerIds, sendMailTo } = req.body;
    if (!jobSeekerIds || !Array.isArray(jobSeekerIds) || jobSeekerIds.length === 0) {
        throw new Error("jobApplicationIds must be a non-empty array.");
    }
    if (!sendMailTo) {
        throw new Error("sendMailTo is required.");
    }
    // Fetch data from ApplyJob model
    const applications = yield ApplyJob_1.default.find({ _id: { $in: jobSeekerIds } }, { name: 1, email: 1, resume: 1, industryJob: 1, contactNo: 1, currentAddress: 1 }).lean();
    if (applications.length === 0) {
        throw new Error("No matching job applications found.");
    }
    (0, node_console_1.log)("applications", applications);
    // Build HTML list of job seeker info with resume links
    const htmlList = applications.map((app, index) => {
        const resumeUrl = `${RESUME_BASE_URL}/${app.resume}`;
        return `<li>
        <strong>Candidate ${index + 1}</strong><br/>
        Name: ${app.name}<br/>
        Email: ${app.email}<br/>
        Contact No: ${app.contactNo || "N/A"}<br/>
        Industry Job: ${app.industryJob || "N/A"}<br/>
        Address: ${app.currentAddress || "N/A"}<br/>
        Resume: <a href="${resumeUrl}" target="_blank">${resumeUrl}</a>
      </li>`;
    });
    const htmlContent = `
      <p>Hello,</p>
      <p>Please find below the job seeker details:</p>
      <ul>
        ${htmlList.join("\n")}
      </ul>
      <p>Regards,<br/>Your Team</p>
    `;
    const textContent = applications
        .map((app, index) => {
        const resumeUrl = `${RESUME_BASE_URL}/${app.resume}`;
        return `
Candidate ${index + 1}
Name: ${app.name}
Email: ${app.email}
Contact No: ${app.contactNo || "N/A"}
Industry Job: ${app.industryJob || "N/A"}
Address: ${app.currentAddress || "N/A"}
Resume: ${resumeUrl}
`;
    })
        .join("\n\n");
    yield sgService.sendEmail([sendMailTo], "Job Seeker Details", htmlContent, textContent);
    (0, responses_1.SuccessResponseWithoutData)(res, constants_1.RESPONSE_CODE.SUCCESS, "Job seeker details email sent successfully.", constants_1.API_RESPONSE_STATUS.SUCCESS);
}));
exports.default = {
    sendJobSeekerDetails,
};
