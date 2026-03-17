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
exports.NoNocDueService = void 0;
const mongoose_1 = require("mongoose");
const NocNoDue_1 = __importDefault(require("../../../models/NocNoDue"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const constants_1 = require("../../../utils/constants");
const helper_1 = require("../../../utils/helper");
const lodash_1 = __importDefault(require("lodash"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const lodash_2 = __importDefault(require("lodash"));
class NoNocDueService {
    // async createNoNocDue(
    //   payload: Partial<INocFormBody>,
    //   user_id: ObjectId,
    //   files: any
    // ): Promise<INocFormBody> {
    //   const refNo = await generateReferenceNumber();
    //   // console.log('Generated Reference Number:', refNo);
    //   const {
    //     industryName,
    //     industryAddress,
    //     email,
    //     industryType,
    //     telephoneNo,
    //     membershipNo,
    //     isMember,
    //     isContributionFiled,
    //     year,
    //     receiptNo,
    //     applicationType,
    //     feeForWaterNoc,
    //     feeForOther,
    //     attachments,
    //     user_name,
    //     plotNo,
    //     gstNo = '',
    //     roadNo = '',
    //   } = payload;
    //   // Check if files exist
    //   if (!files || Object.keys(files).length === 0) {
    //     console.warn('⚠️ No files received!');
    //   }
    //   // Define the expected attachment fields
    //   const extractedAttachments: Partial<INocAttachment> = {};
    //   for (const field in files) {
    //     const match = field.match(/\[(.*?)\]/);
    //     if (match) {
    //       const key = match[1] as keyof INocAttachment;
    //       extractedAttachments[key] = files[field][0]?.filename || '';
    //     }
    //   }
    //   const attachmentsData: INocAttachment = attachments || {};
    //   if (attachmentsData.otherDocumentName) {
    //     extractedAttachments.otherDocumentName =
    //       attachmentsData.otherDocumentName;
    //   }
    //   const sections = {
    //     gidc: ['gidcLetterRefNo', 'gidcDate'],
    //     torrent: ['torrentServiceNo', 'torrentNo', 'torrentDate', 'torrentName'],
    //     amcTaxBill: [
    //       'amcTaxTenamentNo',
    //       'amcTaxYear',
    //       'amcTaxPaidAmount',
    //       'amcTaxName',
    //     ],
    //     water: [
    //       'waterConnectionNo',
    //       'waterBillNo',
    //       'waterBillDate',
    //       'waterConsumptionPeriod',
    //       'waterBillName',
    //     ],
    //   };
    //   _.forEach(sections, (fields, key) => {
    //     const picked = _.pickBy(
    //       _.pick(attachmentsData[key as keyof INocAttachment], fields),
    //       v => v != null
    //     );
    //     if (!_.isEmpty(picked)) {
    //       (extractedAttachments as any)[key as keyof INocAttachment] = picked;
    //     }
    //   });
    //   // Extract cheque details - FIXED VERSION
    //   let extractedChequeDetails: any = {};
    //   // Extract flattened chequeDetails from payload
    //   const chequeDetailKeys = [
    //     'bankName',
    //     'branchName',
    //     'chequeNo',
    //     'chequeDate',
    //     'chequeAmountNumber',
    //     'chequeAmountWords',
    //   ];
    //   // Build chequeDetails object from flattened properties
    //   chequeDetailKeys.forEach(key => {
    //     const flattenedKey = `chequeDetails.${key}`;
    //     if ((payload as any)[flattenedKey]) {
    //       extractedChequeDetails[key] = (payload as any)[flattenedKey];
    //     }
    //   });
    //   // Add the chequePhoto if it exists in the files
    //   if (
    //     files['chequeDetails.chequePhoto'] &&
    //     files['chequeDetails.chequePhoto'][0]
    //   ) {
    //     extractedChequeDetails.chequePhoto =
    //       files['chequeDetails.chequePhoto'][0].filename;
    //   }
    //   let extractedUserContribution: any = {};
    //   const userContributionKeys = [
    //     'name',
    //     'plotNo',
    //     'bank',
    //     'chequeDate',
    //     'chequeNo',
    //     'chequeAmount',
    //   ];
    //   // Build userContribution object from flattened properties
    //   userContributionKeys.forEach(key => {
    //     const flattenedKey = `userContribution.${key}`;
    //     if ((payload as any)[flattenedKey]) {
    //       extractedUserContribution[key] = (payload as any)[flattenedKey];
    //     }
    //   });
    //   if (!payload?.publishDate) {
    //     throw new ApiError(RESPONSE_CODE.BAD_REQUEST, 'Publish Date is required');
    //   }
    //   // should be a date validation
    //   const publishDate = new Date(payload.publishDate);
    //   if (isNaN(publishDate.getTime())) {
    //     throw new ApiError(
    //       RESPONSE_CODE.BAD_REQUEST,
    //       'Publish Date must be a valid date'
    //     );
    //   }
    //   // Create new NOC document
    //   const newNocForm = new NocFormModel({
    //     userId: user_id,
    //     refNo: refNo,
    //     industryName,
    //     industryAddress,
    //     email,
    //     industryType,
    //     telephoneNo,
    //     membershipNo,
    //     isMember,
    //     isContributionFiled,
    //     year,
    //     receiptNo,
    //     applicationType,
    //     feeForWaterNoc,
    //     feeForOther,
    //     attachments: extractedAttachments,
    //     chequeDetails: extractedChequeDetails,
    //     userContribution: extractedUserContribution,
    //     plotNo,
    //     gstNo,
    //     roadNo,
    //     publishDate,
    //     isExported: payload?.isExported || false,
    //     user_name,
    //   });
    //   await newNocForm.save();
    //   console.log('✅ NOC form saved successfully!');
    //   return newNocForm;
    // }
    createNoNocDue(payload, user_id, files) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const refNo = yield (0, helper_1.generateReferenceNumber)();
            const { industryName, industryAddress, email, industryType, telephoneNo, membershipNo, isMember, isContributionFiled, year, receiptNo, applicationType, feeForWaterNoc, feeForOther, attachments, user_name, plotNo, gstNo = '', roadNo = '', } = payload;
            // Check if files exist
            if (!files || Object.keys(files).length === 0) {
                console.warn('⚠️ No files received!');
            }
            // === Handle Attachments ===
            const extractedAttachments = {};
            for (const field in files) {
                const match = field.match(/\[(.*?)\]/);
                if (match) {
                    const key = match[1];
                    extractedAttachments[key] = {
                        _id: new mongoose_1.Types.ObjectId(),
                        fileName: ((_a = files[field][0]) === null || _a === void 0 ? void 0 : _a.filename) || '',
                    };
                }
                else {
                    // Normal flat field (no array)
                    extractedAttachments[field] = {
                        _id: new mongoose_1.Types.ObjectId(),
                        fileName: ((_b = files[field][0]) === null || _b === void 0 ? void 0 : _b.filename) || '',
                    };
                }
            }
            // Merge any additional attachment data from payload
            const attachmentsData = attachments || {};
            if (attachmentsData.otherDocumentName) {
                extractedAttachments.otherDocumentName = attachmentsData.otherDocumentName;
            }
            // Sections for nested data (gidc, torrent, amcTaxBill, water)
            const sections = {
                gidc: ['gidcLetterRefNo', 'gidcDate'],
                torrent: ['torrentServiceNo', 'torrentNo', 'torrentDate', 'torrentName'],
                amcTaxBill: [
                    'amcTaxTenamentNo',
                    'amcTaxYear',
                    'amcTaxPaidAmount',
                    'amcTaxName',
                ],
                water: [
                    'waterConnectionNo',
                    'waterBillNo',
                    'waterBillDate',
                    'waterConsumptionPeriod',
                    'waterBillName',
                ],
            };
            lodash_1.default.forEach(sections, (fields, key) => {
                const picked = lodash_1.default.pickBy(lodash_1.default.pick(attachmentsData[key], fields), v => v != null);
                if (!lodash_1.default.isEmpty(picked)) {
                    extractedAttachments[key] = picked;
                }
            });
            // === Extract Cheque Details ===
            let extractedChequeDetails = {};
            const chequeDetailKeys = [
                'bankName',
                'branchName',
                'chequeNo',
                'chequeDate',
                'chequeAmountNumber',
                'chequeAmountWords',
            ];
            chequeDetailKeys.forEach(key => {
                const flattenedKey = `chequeDetails.${key}`;
                if (payload[flattenedKey]) {
                    extractedChequeDetails[key] = payload[flattenedKey];
                }
            });
            // Add cheque photo if exists
            if ((_c = files['chequeDetails.chequePhoto']) === null || _c === void 0 ? void 0 : _c[0]) {
                extractedChequeDetails.chequePhoto = {
                    _id: new mongoose_1.Types.ObjectId(),
                    fileName: files['chequeDetails.chequePhoto'][0].filename,
                };
            }
            // === Extract User Contribution ===
            let extractedUserContribution = {};
            const userContributionKeys = [
                'name',
                'plotNo',
                'bank',
                'chequeDate',
                'chequeNo',
                'chequeAmount',
            ];
            userContributionKeys.forEach(key => {
                const flattenedKey = `userContribution.${key}`;
                if (payload[flattenedKey]) {
                    extractedUserContribution[key] = payload[flattenedKey];
                }
            });
            // === Publish Date Validation ===
            if (!(payload === null || payload === void 0 ? void 0 : payload.publishDate)) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Publish Date is required');
            }
            const publishDate = new Date(payload.publishDate);
            if (isNaN(publishDate.getTime())) {
                throw new ApiError_1.default(constants_1.RESPONSE_CODE.BAD_REQUEST, 'Publish Date must be a valid date');
            }
            // === Save New NOC Form ===
            const newNocForm = new NocNoDue_1.default({
                userId: user_id,
                refNo,
                industryName,
                industryAddress,
                email,
                industryType,
                telephoneNo,
                membershipNo,
                isMember,
                isContributionFiled,
                year,
                receiptNo,
                applicationType,
                feeForWaterNoc,
                feeForOther,
                attachments: extractedAttachments,
                chequeDetails: extractedChequeDetails,
                userContribution: extractedUserContribution,
                plotNo,
                gstNo,
                roadNo,
                publishDate,
                isExported: (payload === null || payload === void 0 ? void 0 : payload.isExported) || false,
                user_name,
            });
            yield newNocForm.save();
            console.log('✅ NOC form saved successfully with _id for each attachment!');
            return newNocForm;
        });
    }
    mapRawToNocForm(raw) {
        const mapped = {
            // userId: userId ? new Types.ObjectId(userId) : undefined,
            industryName: raw['Industry Name'] || '',
            industryAddress: raw['Industry Address'] || '',
            email: raw['Email'] || '',
            industryType: raw['Industry Type'] || '',
            telephoneNo: raw['Telephone No'] || '',
            membershipNo: raw['Membership No'] || '',
            isMember: raw['Is Member'] === 'Yes' ? constants_1.YES_NO.YES : constants_1.YES_NO.NO,
            isContributionFiled: raw['Contribution Filed'] === 'Yes' ? constants_1.YES_NO.YES : constants_1.YES_NO.NO,
            year: Number(String(raw['Year']).replace(/[^0-9]/g, '')) || undefined,
            receiptNo: raw['Receipt No'] || '',
            applicationType: raw['Application Type']
                ? raw['Application Type'].split(',').map((x) => x.trim())
                : [],
            feeForWaterNoc: raw['Fee For Water NOC'] || '',
            feeForOther: raw['Fee For Other'] || '',
            plotNo: raw['Plot No'] || '',
            refNo: raw['Ref No'] || '',
            roadNo: raw['Road No'] || '',
            gstNo: raw['GST No'] || '',
            attachments: {
                applicationLetter: raw['Application Letter'] || '',
                waterBill: raw['Water Bill'] || '',
                lightBill: raw['Light Bill'] || '',
                taxBill: raw['Tax Bill'] || '',
                otherDocumentImage: raw['Other Document Image'] || '',
                otherDocumentName: raw['Other Document Name'] || '',
                gidc: {
                    gidcLetterRefNo: raw['GIDC Letter Ref No'] || '',
                    gidcDate: (0, helper_1.parseValidDate)(raw['GIDC Date']),
                },
                torrent: {
                    torrentServiceNo: raw['Torrent Service No'] || '',
                    torrentNo: raw['Torrent No'] || '',
                    torrentDate: (0, helper_1.parseValidDate)(raw['Torrent Date']),
                    torrentName: raw['Torrent Name'] || '',
                },
                amcTaxBill: {
                    amcTaxTenamentNo: raw['AMC Tax Bill Tenament No'] || '',
                    amcTaxYear: raw['AMC Tax Bill Year'] || '',
                    amcTaxPaidAmount: raw['AMC Tax Bill Paid Amount'] || '',
                    amcTaxName: raw['AMC Tax Bill Name'] || '',
                },
                water: {
                    waterConnectionNo: raw['Water Connection No'] || '',
                    waterBillNo: raw['Water Bill No'] || '',
                    waterBillDate: (0, helper_1.parseValidDate)(raw['Water Bill Date']),
                    waterConsumptionPeriod: raw['Water Consumption Period'] || '',
                    waterBillName: raw['Water Bill Name'] || '',
                },
            },
            chequeDetails: {
                bankName: raw['Cheque Bank Name'] || '',
                branchName: raw['Cheque Branch Name'] || '',
                chequeNo: raw['Cheque No'] || '',
                chequeDate: raw['Cheque Date'] || '',
                chequeAmountNumber: parseFloat(raw['Cheque Amount (₹)']) || undefined,
                chequeAmountWords: raw['Cheque Amount (Words)'] || '',
                chequePhoto: raw['Cheque Photo'] || '',
            },
            userContribution: {
                name: raw['Cheque Name'] || '',
                plotNo: raw['Cheque Plot No'] || '',
                bank: raw['Cheque Bank Name'] || '',
                chequeDate: raw['Cheque Date'] || '',
                chequeNo: raw['Cheque No'] || '',
                chequeAmount: raw['Cheque Amount (₹)'] || '',
            },
            publishDate: (0, helper_1.parseValidDate)(raw['Publish Date']),
            createdAt: (0, helper_1.parseValidDate)(raw['Created At']),
            updatedAt: (0, helper_1.parseValidDate)(raw['Updated At']),
            isExported: true,
        };
        return lodash_2.default.omitBy(mapped, lodash_2.default.isNil);
    }
    importNOCs(csvFilePath_) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = yield (0, csvtojson_1.default)().fromFile(csvFilePath_);
                console.log(`Total rows: ${json.length}`);
                if (json.length === 0) {
                    console.log('❌ No data found in CSV file');
                    return;
                }
                const BATCH_SIZE = 500;
                let ops = [];
                let totalProcessed = 0;
                let totalErrors = 0;
                for (let i = 0; i < json.length; i++) {
                    const row = json[i];
                    try {
                        const doc = this.mapRawToNocForm(row);
                        // console.log(doc, 'doc');
                        // Skip if doc is null/undefined
                        if (!doc) {
                            console.log(`⚠️ Skipping row ${i + 1}: mapRawToNocForm returned null/undefined`);
                            continue;
                        }
                        ops.push({
                            insertOne: { document: doc },
                        });
                        // When batch size reached OR last item
                        if (ops.length === BATCH_SIZE || i === json.length - 1) {
                            if (ops.length > 0) {
                                console.log(`Writing batch ${Math.ceil((i + 1) / BATCH_SIZE)} with ${ops.length} records...`);
                                try {
                                    const result = yield NocNoDue_1.default.bulkWrite(ops, {
                                    // ordered: false ,
                                    });
                                    console.log(`✅ Batch completed: ${result.insertedCount} inserted, ${result.upsertedCount} upserted`);
                                    totalProcessed += result.insertedCount + result.upsertedCount;
                                }
                                catch (bulkError) {
                                    console.error(`❌ Bulk write error for batch:`, bulkError);
                                    // Log specific errors if available
                                    if (bulkError.writeErrors) {
                                        bulkError.writeErrors.forEach((err, idx) => {
                                            console.error(`Error in document ${idx}:`, err.errmsg);
                                        });
                                    }
                                    totalErrors += ops.length;
                                }
                                ops = []; // reset batch
                            }
                        }
                    }
                    catch (mappingError) {
                        console.error(`❌ Error processing row ${i + 1}:`, mappingError);
                        console.log('Raw row data:', row);
                        totalErrors++;
                    }
                }
                console.log('📊 Import Summary:');
                console.log(`Total rows in CSV: ${json.length}`);
                console.log(`Successfully processed: ${totalProcessed}`);
                console.log(`Errors: ${totalErrors}`);
                console.log('✅ Import completed');
                return {
                    totalRows: json.length,
                    processed: totalProcessed,
                    errors: totalErrors,
                };
            }
            catch (error) {
                console.error('❌ Import failed:', error);
                throw error;
            }
        });
    }
}
exports.NoNocDueService = NoNocDueService;
