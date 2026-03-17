import { log } from "console";
import NocFormModel from "../../../models/NocNoDue";
import { INocForm } from "../../../types/models";
import {
  IAddNocFormUserContributionBody,
  IUpdateNocFormBody,
} from "../../../types/requests";
import ApiError from "../../../utils/ApiError";
import { FOLDER_NAMES, RESPONSE_CODE } from "../../../utils/constants";
import FileHelper from "../../fileService/fileHelper";
import FileService from "../../fileService/fileService";
import User from "../../../models/User";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { extractDot } from "../../../utils/helper";
export class AdminNocDueService {
  fileHelper = new FileHelper();
  fileService = new FileService();
  async getNocList(): Promise<any> {
    // Fetch all NOC complaints from the NocFormModel collection
    const nocs = await NocFormModel.find().sort({ createdAt: -1 }).lean();

    return {
      data: nocs.map((noc) => {
        const userIdString = noc?.userId ? noc.userId.toString() : "";

        return {
          ...noc,
          attachments: {
            applicationLetter: noc.attachments?.applicationLetter
              ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                  userIdString,
                  noc.attachments.applicationLetter,
                ])
              : null,
            waterBill: noc.attachments?.waterBill
              ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                  userIdString,
                  noc.attachments.waterBill,
                ])
              : null,
            lightBill: noc.attachments?.lightBill
              ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                  userIdString,
                  noc.attachments.lightBill,
                ])
              : null,
            taxBill: noc.attachments?.taxBill
              ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                  userIdString,
                  noc.attachments.taxBill,
                ])
              : null,
            otherDocumentImage: noc.attachments?.otherDocumentImage
              ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                  userIdString,
                  noc.attachments.otherDocumentImage,
                ])
              : null,
            otherDocumentName: noc.attachments?.otherDocumentName || null,
          },
          chequeDetails: noc.chequeDetails
            ? {
                ...noc.chequeDetails,
                chequePhoto: noc.chequeDetails?.chequePhoto
                  ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
                      userIdString,
                      noc.chequeDetails.chequePhoto,
                    ])
                  : null,
              }
            : null,
        };
      }),
      totalCount: nocs.length,
    };
  }

  // async getNocDetails(nocId: string): Promise<INocForm | null> {
  //   // Retrieve the NOC document from the database
  //   const noc = await NocFormModel.findById(nocId).lean<INocForm>();

  //   if (!noc) {
  //     throw new ApiError(RESPONSE_CODE.NOT_FOUND, "NOC not found");
  //   }
  //   const user = await User.findById(noc?.userId).lean().select("user_name");

  //   const userName = user?.user_name || "-";
  //   const createdByIdString = noc.userId?.toString() || "";

  //   // If attachments exist, update file paths
  //   if (noc.attachments) {
  //     const attachmentFileNames = [
  //       "applicationLetter",
  //       "waterBill",
  //       "lightBill",
  //       "taxBill",
  //     ];
  //     Object.keys(noc.attachments).forEach((key) => {
  //       if (attachmentFileNames.includes(key)) {
  //         // Exclude `otherDocumentName`
  //         const fileName = (noc.attachments as any)[key];
  //         if (fileName) {
  //           (noc.attachments as any)[key] =
  //             this.fileService.getFilePathFromDatabase(FOLDER_NAMES.NOC, [
  //               createdByIdString,
  //               fileName,
  //             ]);
  //         }
  //       }
  //     });
  //   }

  //   // If chequeDetails exist, update chequePhoto file path
  //   if (noc.chequeDetails && noc.chequeDetails.chequePhoto) {
  //     noc.chequeDetails.chequePhoto = this.fileService.getFilePathFromDatabase(
  //       FOLDER_NAMES.NOC,
  //       [createdByIdString, noc.chequeDetails.chequePhoto]
  //     );
  //   }

  //   return { ...noc, user_name: userName };
  // }

  // async updateNoc(
  //   nocId: string,
  //   payload: IUpdateNocFormBody
  // ): Promise<INocForm | null> {
  //   // Update only the userContribution field
  //   log(payload, 'payload');
  //   const updatedNoc = await NocFormModel.findByIdAndUpdate(
  //     nocId,
  //     { $set: { userContribution: payload.userContribution } },
  //     { new: true }
  //   ).lean<INocForm>();

  //   if (!updatedNoc) {
  //     throw new ApiError(RESPONSE_CODE.NOT_FOUND, 'NOC not found');
  //   }

  //   return updatedNoc;
  // }

  //   async addNocUserContribution(payload: IAddNocFormUserContributionBody): Promise<INocForm[]> {
  //     const { userContribution } = payload;
  //     const { plotNo: userPlotNo } = userContribution;

  //     console.log(userPlotNo, "userPlotNo");

  //     // Find all NOC records that contain the user's plotNo in their plotNo field
  //     const nocRecords = await NocFormModel.find({
  //       plotNo: {
  //         $regex: new RegExp(`\\b${userPlotNo}\\b`, 'i') // Word boundary match to avoid partial matches
  //       }
  //     }).lean<INocForm[]>();

  //     if (!nocRecords || nocRecords.length === 0) {
  //       throw new ApiError(RESPONSE_CODE.NOT_FOUND, `No NOC records found for plot number: ${userPlotNo}`);
  //     }

  //     const updatedNocRecords: INocForm[] = [];

  //     // Update each matching NOC record
  //     for (const nocRecord of nocRecords) {
  //       // Check if userContribution array exists, if not initialize it
  //       const updatedNoc = await NocFormModel.findByIdAndUpdate(
  //         nocRecord._id,
  //         {
  //           $push: {
  //             userContribution: userContribution
  //           }
  //         },
  //         { new: true }
  //       ).lean<INocForm>();

  //       if (updatedNoc) {
  //         updatedNocRecords.push(updatedNoc);
  //       }
  //     }

  //     if (updatedNocRecords.length === 0) {
  //       throw new ApiError(RESPONSE_CODE.INTERNAL_SERVER_ERROR, 'Failed to update NOC records');
  //     }

  //     return updatedNocRecords;
  //   }

async getNocDetails(nocId: string): Promise<INocForm | null> {
  const noc = await NocFormModel.findById(nocId).lean<INocForm>();

  if (!noc) {
    throw new ApiError(RESPONSE_CODE.NOT_FOUND, "NOC not found");
  }

  const user = await User.findById(noc.userId).lean().select("user_name");
  const userName = user?.user_name || "-";
  const createdByIdString = noc.userId?.toString() || "";

  /** ------------------------------
   * PROCESS ATTACHMENTS
   * ------------------------------ */
  if (noc.attachments) {
    const attachmentKeys = [
      "applicationLetter",
      "waterBill",
      "lightBill",
      "taxBill",
      "otherDocumentImage",
    ];

    attachmentKeys.forEach((key) => {
      const value = (noc.attachments as any)[key];
      if (!value) return;

      // NEW FORMAT → { _id, fileName }
      if (typeof value === "object" && value.fileName) {
        const fileUrl = this.fileService.getFilePathFromDatabase(
          FOLDER_NAMES.NOC,
          [createdByIdString, value.fileName]
        );

        (noc.attachments as any)[key] = {
          _id: value._id || null,
          fileName: value.fileName,
          fileUrl,
        };
      }

      // OLD FORMAT → "filename.jpg"
      else if (typeof value === "string") {
        const fileUrl = this.fileService.getFilePathFromDatabase(
          FOLDER_NAMES.NOC,
          [createdByIdString, value]
        );

        (noc.attachments as any)[key] = {
          _id: null,
          fileName: value,
          fileUrl,
        };
      }
    });
  }

  /** ------------------------------
   * PROCESS CHEQUE PHOTO
   * ------------------------------ */
  if (noc.chequeDetails?.chequePhoto) {
    const cheque = noc.chequeDetails.chequePhoto as any;

    // NEW FORMAT
    if (typeof cheque === "object" && cheque !== null && cheque.fileName) {
      (noc.chequeDetails as any).chequePhoto = {
        _id: cheque._id || null,
        fileName: cheque.fileName,
        fileUrl: this.fileService.getFilePathFromDatabase(
          FOLDER_NAMES.NOC,
          [createdByIdString, cheque.fileName]
        ),
      };
    }

    // OLD FORMAT
    else if (typeof cheque === "string") {
      (noc.chequeDetails as any).chequePhoto = {
        _id: null,
        fileName: cheque,
        fileUrl: this.fileService.getFilePathFromDatabase(
          FOLDER_NAMES.NOC,
          [createdByIdString, cheque]
        ),
      };
    }
  }

  return { ...noc, user_name: userName };
}


// async updateNoc(
//   nocId: string,
//   payload: any,
//   files?: Record<string, Express.Multer.File[]>
// ) {
//   /* ---------------------------------------------------------
//      1. Sanitize attachmentIdsDelete (string → array)
//   --------------------------------------------------------- */
//   let { attachmentIdsDelete = [], ...updateData } = payload;

//   if (typeof attachmentIdsDelete === "string") {
//     try {
//       attachmentIdsDelete = JSON.parse(attachmentIdsDelete);
//     } catch (err) {
//       console.log("Invalid attachmentIdsDelete:", attachmentIdsDelete);
//       attachmentIdsDelete = [];
//     }
//   }

//   /* ---------------------------------------------------------
//      2. Fetch NOC
//   --------------------------------------------------------- */
//   const noc = await NocFormModel.findById(nocId);
//   if (!noc) throw new Error("NOC not found");

//   const userId = noc.userId.toString();
//   const userFolderPath = path.join("uploads", "noc", userId);

//   /* ---------------------------------------------------------
//      3. Helper: Valid file attachment
//   --------------------------------------------------------- */
//   function isFileAttachment(obj: any) {
//     return (
//       obj &&
//       typeof obj === "object" &&
//       "_id" in obj &&
//       obj._id &&
//       "fileName" in obj &&
//       typeof obj.fileName === "string"
//     );
//   }

//   /* ---------------------------------------------------------
//      4. DELETE ATTACHMENTS (DB + filesystem)
//   --------------------------------------------------------- */
//   for (const deleteId of attachmentIdsDelete) {
//     const delIdStr = deleteId.toString();

//     const sections = ["attachments", "chequeDetails"] as const;

//     for (const section of sections) {
//       const secObj = (noc as any)[section];
//       if (!secObj) continue;

//       for (const key of Object.keys(secObj)) {
//         const item = secObj[key];

//         if (!isFileAttachment(item)) continue; // IMPORTANT: skip non-file fields

//         if (item._id.toString() === delIdStr) {
//           const filePath = path.join(userFolderPath, item.fileName);

//           if (fs.existsSync(filePath)) {
//             console.log("Deleting old file:", filePath);
//             fs.unlinkSync(filePath);
//           }

//           secObj[key] = null; // remove from DB
//         }
//       }
//     }
//   }

//   /* ---------------------------------------------------------
//      5. SAVE NEW UPLOADED FILES
//   --------------------------------------------------------- */
//   if (files) {
//     for (const [fieldName, fileArr] of Object.entries(files)) {
//       const file = fileArr[0];
//       if (!file) continue;

//       // fieldName example: attachments[waterBill]
//       const dbKey = FIELD_MAP[fieldName as keyof typeof FIELD_MAP];
//       if (!dbKey) continue;

//       const newAttachment = {
//         _id: new mongoose.Types.ObjectId(),
//         fileName: file.filename,
//       };

//       // Attach inside attachments
//       if (noc.attachments?.hasOwnProperty(dbKey)) {
//         (noc.attachments as any)[dbKey] = newAttachment;
//       }

//       // Attach inside chequeDetails
//       if (noc.chequeDetails?.hasOwnProperty(dbKey)) {
//         (noc.chequeDetails as any)[dbKey] = newAttachment;
//       }
//     }
//   }

//   /* ---------------------------------------------------------
//      6. UPDATE NORMAL TEXT FIELDS
//   --------------------------------------------------------- */
//   for (const [key, value] of Object.entries(updateData)) {
//     if (["attachments", "chequeDetails","userContribution"].includes(key)) continue;
//     if (value === null || value === undefined) continue;

//     (noc as any)[key] = value;
//   }

// /* ---------------------------------
//    UPDATE chequeDetails (dot notation)
// ----------------------------------- */
// const chequeUpdates = extractDot("chequeDetails", updateData);
// if (Object.keys(chequeUpdates).length > 0) {
//   for (const [key, value] of Object.entries(chequeUpdates)) {
//     (noc.chequeDetails as any)[key] = value;
//   }
// }

// /* ---------------------------------
//    UPDATE userContribution (dot notation)
// ----------------------------------- */
// const ucUpdates = extractDot("userContribution", updateData);
// if (Object.keys(ucUpdates).length > 0) {
//   for (const [key, value] of Object.entries(ucUpdates)) {
//     (noc.userContribution as any)[key] = value;
//   }
// }



//   await noc.save();
//   return noc;
// }

async updateNoc(nocId: string, payload: any, files?: Record<string, Express.Multer.File[]>) {
  /* -----------------------------------
     1. Parse attachmentIdsDelete
  --------------------------------------*/
  let { attachmentIdsDelete = [], ...updateData } = payload;

  if (typeof attachmentIdsDelete === "string") {
    try {
      attachmentIdsDelete = JSON.parse(attachmentIdsDelete);
    } catch {
      attachmentIdsDelete = [];
    }
  }

  /* -----------------------------------
     2. Get NOC
  --------------------------------------*/
  const noc = await NocFormModel.findById(nocId);
  if (!noc) throw new Error("NOC not found");

  const userId = noc.userId.toString();
  const userFolderPath = path.join("uploads", "noc", userId);

  /* -----------------------------------
     3. Helper: file attachment type check
  --------------------------------------*/
  function isFileAttachment(obj: any) {
    return obj && typeof obj === "object" && obj._id && obj.fileName;
  }

  /* -----------------------------------
     4. Delete attachments
  --------------------------------------*/
  for (const delId of attachmentIdsDelete) {
    const delIdStr = delId.toString();

    const sections = ["attachments", "chequeDetails"];
    for (const section of sections) {
      const secObj = (noc as any)[section];
      if (!secObj) continue;

      for (const key of Object.keys(secObj)) {
        const item = secObj[key];
        if (!isFileAttachment(item)) continue;

        if (item._id.toString() === delIdStr) {
          const filePath = path.join(userFolderPath, item.fileName);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

          secObj[key] = null;
        }
      }
    }
  }

  /* -----------------------------------
     5. Save new uploaded files
  --------------------------------------*/
  if (files) {
    for (const [fieldName, arr] of Object.entries(files)) {
      const file = arr[0];
      if (!file) continue;

      const newAttachment = {
        _id: new mongoose.Types.ObjectId(),
        fileName: file.filename,
      };

      // find correct db key from fieldName
      const dbKey = FIELD_MAP[fieldName as keyof typeof FIELD_MAP];
      if (!dbKey) continue;

      if (noc.attachments?.hasOwnProperty(dbKey)) {
        (noc.attachments as any)[dbKey] = newAttachment;
      }

      if (noc.chequeDetails?.hasOwnProperty(dbKey)) {
        (noc.chequeDetails as any)[dbKey] = newAttachment;
      }
    }
  }

  /* -----------------------------------
     6. Update simple fields (NOT nested)
  --------------------------------------*/
  for (const [key, value] of Object.entries(updateData)) {
    if (["attachments", "chequeDetails", "userContribution"].includes(key)) continue;
    (noc as any)[key] = value;
  }

  /* -----------------------------------
     7. Dot-notation updater for nested fields
  --------------------------------------*/
  function applyNested(obj: any, pathStr: string, value: any) {
    const keys = pathStr.split(".");
    let temp = obj;

    while (keys.length > 1) {
      const k = keys.shift()!;
      if (!temp[k]) temp[k] = {};
      temp = temp[k];
    }

    temp[keys[0]] = value;
  }

  /* -----------------------------------
     8. Flatten payload into dot notation
  --------------------------------------*/
  function flatten(obj: any, prefix = "", res: any = {}) {
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (val && typeof val === "object" && !Array.isArray(val)) {
        flatten(val, newKey, res);
      } else {
        res[newKey] = val;
      }
    }
    return res;
  }

  const flat = flatten(updateData);

  /* -----------------------------------
     9. Apply attachment nested values
  --------------------------------------*/
  for (const [pathStr, val] of Object.entries(flat)) {
    if (pathStr.startsWith("attachments.")) {
      const cleanPath = pathStr.replace("attachments.", "");
      applyNested(noc.attachments, cleanPath, val);
    }
  }

  /* -----------------------------------
     10. User Contribution
  --------------------------------------*/
  for (const [pathStr, val] of Object.entries(flat)) {
    if (pathStr.startsWith("userContribution.")) {
      const cleanPath = pathStr.replace("userContribution.", "");
      applyNested(noc.userContribution, cleanPath, val);
    }
  }

  /* -----------------------------------
     11. Cheque Details
  --------------------------------------*/
  for (const [pathStr, val] of Object.entries(flat)) {
    if (pathStr.startsWith("chequeDetails.")) {
      const cleanPath = pathStr.replace("chequeDetails.", "");
      applyNested(noc.chequeDetails, cleanPath, val);
    }
  }

  /* -----------------------------------
     12. Save final NOC
  --------------------------------------*/
  await noc.save();
  return noc;
}



  async addNocUserContribution(
    payload: IAddNocFormUserContributionBody
  ): Promise<INocForm[]> {
    const { userContribution } = payload;
    const { plotNo: userPlotNo } = userContribution;
    console.log(userPlotNo, "userPlotNo");

    // Split the user's plot numbers (handle comma-separated values)
    const userPlotNumbers = userPlotNo
      .split(",")
      .map((plot) => plot.trim())
      .filter((plot) => plot);

    if (userPlotNumbers.length === 0) {
      throw new ApiError(
        RESPONSE_CODE.BAD_REQUEST,
        "No valid plot numbers provided"
      );
    }

    // Create regex patterns for each plot number to match in NOC records
    const plotNumberConditions = userPlotNumbers.map((plotNum) => ({
      plotNo: {
        $regex: new RegExp(`(^|,)\\s*${plotNum}\\s*(,|$)`, "i"),
      },
    }));

    // Find all NOC records that contain any of the user's plot numbers
    const nocRecords = await NocFormModel.find({
      $or: plotNumberConditions,
    }).lean<INocForm[]>();

    if (!nocRecords || nocRecords.length === 0) {
      throw new ApiError(
        RESPONSE_CODE.NOT_FOUND,
        `No NOC records found for plot numbers: ${userPlotNumbers.join(", ")}`
      );
    }

    const updatedNocRecords: INocForm[] = [];

    // Update each matching NOC record
    for (const nocRecord of nocRecords) {
      const updatedNoc = await NocFormModel.findByIdAndUpdate(
        nocRecord._id,
        {
          $set: {
            userContribution: userContribution,
          },
        },
        { new: true }
      ).lean<INocForm>();

      if (updatedNoc) {
        updatedNocRecords.push(updatedNoc);
      }
    }

    if (updatedNocRecords.length === 0) {
      throw new ApiError(
        RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        "Failed to update NOC records"
      );
    }

    return updatedNocRecords;
  }

  // async getNocUserContributionList(): Promise<any> {
  //   // Fetch only specific fields from NOC documents
  //   const nocs = await NocFormModel.find(
  //     {},
  //     {
  //       _id: 1,
  //       userId: 1,
  //       refNo: 1,
  //       userContribution: 1,
  //     }
  //   ).lean();

  //   return {
  //     data: nocs,
  //     totalCount: nocs.length,
  //   };
  // }

  async getNocUserContributionList(): Promise<any> {
  const nocs = await NocFormModel.find(
    {},
    {
      _id: 1,
      userId: 1,
      refNo: 1,
      userContribution: 1,
    }
  )
    .sort({ createdAt: -1 }) // 🔥 Latest first
    .lean();

  return {
    data: nocs,
    totalCount: nocs.length,
  };
}

  async deleteNoc(nocId: string): Promise<void> {
    const deletedNoc = await NocFormModel.findByIdAndDelete(nocId);
    if (!deletedNoc) {
      throw new ApiError(RESPONSE_CODE.NOT_FOUND, "NOC not found");
    }
  }
}




/* ---------------------------------------------------------
   FILE FIELD MAP
--------------------------------------------------------- */
const FIELD_MAP: Record<string, string> = {
  "attachments[applicationLetter]": "applicationLetter",
  "attachments[waterBill]": "waterBill",
  "attachments[lightBill]": "lightBill",
  "attachments[taxBill]": "taxBill",
  "attachments[otherDocumentImage]": "otherDocumentImage",

  "chequeDetails[chequePhoto]": "chequePhoto",
};

function flattenObject(obj: any, prefix = "") {
  let result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}