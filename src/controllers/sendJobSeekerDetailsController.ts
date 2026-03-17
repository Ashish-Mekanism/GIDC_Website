import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { API_RESPONSE_STATUS, FOLDER_NAMES, RESPONSE_CODE } from "../utils/constants";
import { SuccessResponseWithoutData } from "../utils/responses";
import { CustomRequest } from "../types/common";
import { SendGridService } from "../services/sendGrid";
import ApplyJob from "../models/ApplyJob"; // Adjust the import path as needed
import Config from "../config";
import { log } from "node:console";

const sgService = new SendGridService();

// Replace with your actual production base URL for resume access
const RESUME_BASE_URL = `${Config.BaseUrl}/uploads/resume/resume`;;

const sendJobSeekerDetails = asyncHandler(
  async (
    req: CustomRequest<{ jobSeekerIds: string[]; sendMailTo: string }>,
    res: Response
  ) => {
    const { jobSeekerIds, sendMailTo } = req.body;

    if (!jobSeekerIds || !Array.isArray(jobSeekerIds) || jobSeekerIds.length === 0) {
      throw new Error("jobApplicationIds must be a non-empty array.");
    }

    if (!sendMailTo) {
      throw new Error("sendMailTo is required.");
    }

    // Fetch data from ApplyJob model
    const applications = await ApplyJob.find(
      { _id: { $in: jobSeekerIds } },
      { name: 1, email: 1, resume: 1, industryJob: 1, contactNo: 1, currentAddress: 1 }
    ).lean();

    if (applications.length === 0) {
      throw new Error("No matching job applications found.");
    }
    log("applications", applications);

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

    await sgService.sendEmail(
      [sendMailTo],
      "Job Seeker Details",
      htmlContent,
      textContent
    );

    SuccessResponseWithoutData(
      res,
      RESPONSE_CODE.SUCCESS,
      "Job seeker details email sent successfully.",
      API_RESPONSE_STATUS.SUCCESS
    );
  }
);


export default {
  sendJobSeekerDetails,
};
