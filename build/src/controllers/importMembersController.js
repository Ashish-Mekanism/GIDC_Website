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
exports.processNonMemberCSV = exports.processCSV = exports.csvToMongoMap = void 0;
const path_1 = __importDefault(require("path"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const helper_1 = require("../utils/helper");
const constants_1 = require("../utils/constants");
dotenv_1.default.config();
const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || '123456';
// export const csvToMongoMap: { [key: string]: string } = {
//   membership_no: 'membership_Id',
//   member_comname: 'memberCompanyName',
//   plot_no: 'plotShedNo',
//   road_no: 'roadNo',
//   company_type: 'companyType',
//   member_email: 'email',
//   member_phone: 'phone',
//   member_mobile: 'mobile',
//   member_website: 'website',
//   member_productname: 'productName',
//   member_comcategory: 'companyCategory',
//   member_gstno: 'gstNo',
//   member_amc_tenement: 'amcTenementNo',
//   member_udhyog_adhar_no: 'udyogAadharNo',
//   member_torrentno: 'torrentServiceNo',
//   mem_allotment_letter: 'attachments.allotmentLetter',
//   mem_posse_letter: 'attachments.possessionLetter',
//   mem_office_order: 'attachments.officeOrder',
//   mem_transfer_order: 'attachments.transferOrder',
//   other_doc_onename: 'otherDocuments[0].name',
//   other_doc_oneattach: 'otherDocuments[0].file',
//   other_doc_twoname: 'otherDocuments[1].name',
//   other_doc_twoattach: 'otherDocuments[1].file',
//   respresentative_nameone: 'representativeDetails[0].name',
//   respresentative_designationone: 'representativeDetails[0].designation',
//   respresentative_emailone: 'representativeDetails[0].email',
//   respresentative_mobileone: 'representativeDetails[0].mobile',
//   respresentative_phoneone: 'representativeDetails[0].phone',
//   respresentative_photoone: 'representativeDetails[0].photo',
//   respresentative_nametwo: 'representativeDetails[1].name',
//   respresentative_designationtwo: 'representativeDetails[1].designation',
//   respresentative_emailtwo: 'representativeDetails[1].email',
//   respresentative_mobiletwo: 'representativeDetails[1].mobile',
//   respresentative_phonetwo: 'representativeDetails[1].phone',
//   respresentative_phototwo: 'representativeDetails[1].photo',
//   plot_shed_size: 'propertyDetails[0].plotShedSize',
//   water_connection_noone: 'propertyDetails[0].waterConnectionNo',
//   con_sizeone: 'propertyDetails[0].connectionSizeMM',
//   area_sizeone: 'propertyDetails[0].areaSizeSqMtrs',
//   water_connection_notwo: 'propertyDetails[1].waterConnectionNo',
//   con_sizetwo: 'propertyDetails[1].connectionSizeMM',
//   area_sizetwo: 'propertyDetails[1].areaSizeSqMtrs'
// };
exports.csvToMongoMap = {
    'Membership ID': 'membership_Id',
    'Company Name': 'memberCompanyName',
    'Plot/Shed No': 'plotShedNo',
    'Road No': 'roadNo',
    'Company Type': 'companyType',
    Email: 'email',
    Phone: 'phone',
    Mobile: 'mobile',
    Website: 'website',
    'Product Name': 'productName',
    'Company Category': 'companyCategory',
    'GST No': 'gstNo',
    'AMC Tenement No': 'amcTenementNo',
    'Udyog Aadhar No': 'udyogAadharNo',
    'Torrent Service No': 'torrentServiceNo',
    'Allotment Letter': 'attachments.allotmentLetter',
    'Possession Letter': 'attachments.possessionLetter',
    'Office Order': 'attachments.officeOrder',
    'Transfer Order': 'attachments.transferOrder',
    'Cheque No': 'payment.chequeNo',
    'Cheque Date': 'payment.chequeDate',
    'Cheque Amount (Number)': 'payment.chequeAmountNumber',
    'Cheque Amount (Words)': 'payment.chequeAmountWords',
    'Cheque Photo': 'payment.chequePhoto',
    Receipt: 'payment.receipt',
    'Receipt Photo': 'payment.receiptPhoto',
    Rep_1_Name: 'representativeDetails[0].name',
    Rep_1_Email: 'representativeDetails[0].email',
    Rep_1_Designation: 'representativeDetails[0].designation',
    Rep_1_Mobile: 'representativeDetails[0].mobile',
    Rep_1_Phone: 'representativeDetails[0].phone',
    Rep_1_Photo: 'representativeDetails[0].photo',
    Rep_2_Name: 'representativeDetails[1].name',
    Rep_2_Email: 'representativeDetails[1].email',
    Rep_2_Designation: 'representativeDetails[1].designation',
    Rep_2_Mobile: 'representativeDetails[1].mobile',
    Rep_2_Phone: 'representativeDetails[1].phone',
    Rep_2_Photo: 'representativeDetails[1].photo',
    Prop_1_PlotSize: 'propertyDetails[0].plotShedSize',
    Prop_1_WaterConn: 'propertyDetails[0].waterConnectionNo',
    Prop_1_ConnSizeMM: 'propertyDetails[0].connectionSizeMM',
    Prop_1_AreaSize: 'propertyDetails[0].areaSizeSqMtrs',
    Prop_2_PlotSize: 'propertyDetails[1].plotShedSize',
    Prop_2_WaterConn: 'propertyDetails[1].waterConnectionNo',
    Prop_2_ConnSizeMM: 'propertyDetails[1].connectionSizeMM',
    Prop_2_AreaSize: 'propertyDetails[1].areaSizeSqMtrs',
    Prop_3_WaterConn: 'propertyDetails[2].waterConnectionNo',
    Prop_3_ConnSizeMM: 'propertyDetails[2].connectionSizeMM',
    Prop_3_AreaSize: 'propertyDetails[2].areaSizeSqMtrs',
    Prop_4_WaterConn: 'propertyDetails[3].waterConnectionNo',
    Prop_4_ConnSizeMM: 'propertyDetails[3].connectionSizeMM',
    Prop_4_AreaSize: 'propertyDetails[3].areaSizeSqMtrs',
    Prop_5_WaterConn: 'propertyDetails[4].waterConnectionNo',
    Prop_5_ConnSizeMM: 'propertyDetails[4].connectionSizeMM',
    Prop_5_AreaSize: 'propertyDetails[4].areaSizeSqMtrs',
    Doc_1_Name: 'otherDocuments[0].name',
    Doc_1_File: 'otherDocuments[0].file',
    Doc_2_Name: 'otherDocuments[1].name',
    Doc_2_File: 'otherDocuments[1].file',
    Doc_3_Name: 'otherDocuments[2].name',
    Doc_3_File: 'otherDocuments[2].file',
};
//const csvFilePath = path.join(__dirname, '..', 'membership.csv');
//const csvFilePath = '/Users/kunjpatel/Downloads/member_export.csv';
//const csvFilePath = path.join(__dirname, '..', '..', 'member_export.csv');
//const csvFilePath = process.cwd() + "member_export.csv";
const csvFilePath = path_1.default.join(process.cwd(), 'membership_import.csv');
// if (!fs.existsSync(csvFilePath)) {
//   throw new Error(`CSV file not found at path: ${csvFilePath}`);
// }
const setNestedValue = (obj, path, value) => {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
            acc[key] = value;
        }
        else {
            if (!acc[key]) {
                acc[key] = isNaN(Number(keys[index + 1])) ? {} : [];
            }
            return acc[key];
        }
        return acc;
    }, obj);
};
// export const processCSV = async () => {
//   const jsonArray = await csv().fromFile(csvFilePath);
//   for (const row of jsonArray) {
//     try {
//       // Check if email already exists
//       const existingUser = await User.findOne({ email: row.member_email });
//       if (existingUser) {
//         console.log(`Skipping: User with email ${row.member_email} already exists.`);
//         continue;
//       }
//       // Create user with default password
//       const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
//       const user = new User({
//         email: row.member_email,
//         password: hashedPassword,
//         is_Member: true,
//         user_type: 3,
//         is_Email_Verified: true,
//         account_status: 1,
//         roleName: [],
//         approval_status: 1
//       });
//       const savedUser = await user.save();
//       // Map CSV fields to membership fields
//       const membershipData: any = {
//         userId: savedUser._id
//       };
//       for (const [csvKey, mongoPath] of Object.entries(csvToMongoMap)) {
//         if (row[csvKey]) {
//           setNestedValue(membershipData, mongoPath, row[csvKey]);
//         }
//       }
//       // Create and save membership document
//       const membership = new MembershipModel(membershipData);
//       await membership.save();
//       console.log(`Successfully imported user: ${row.member_email}`);
//     } catch (error) {
//       console.error(`Error processing row for email ${row.member_email}:`, error);
//     }
//   }
//   console.log('CSV processing completed.');
//   mongoose.disconnect();
// };
//processCSV();
const processCSV = () => __awaiter(void 0, void 0, void 0, function* () {
    const jsonArray = yield (0, csvtojson_1.default)().fromFile(csvFilePath);
    const results = {
        total: jsonArray.length,
        imported: 0,
        skipped: 0,
        failed: 0,
        errors: [],
    };
    for (const row of jsonArray) {
        try {
            // const existingUser = await User.findOne({ email: row.member_email });
            // if (existingUser) {
            //   console.log(
            //     `Skipping: User with email ${row.member_email} already exists.`
            //   );
            //   results.skipped++;
            //   continue;
            // }
            console.log(row, 'row');
            const hashedPassword = yield bcrypt_1.default.hash(DEFAULT_PASSWORD, 10);
            let user;
            if (row['Membership ID'] == 'None Member') {
                user = new User_1.default({
                    email: row.Email,
                    password: hashedPassword,
                    is_Member: false,
                    user_type: constants_1.USER_TYPE.USER,
                    is_Email_Verified: true,
                    account_status: 1,
                    roleName: [],
                    approval_status: 1,
                    user_name: yield (0, helper_1.generateUniqueRandomUsername)(),
                    companyName: row['Company Name'],
                    plotShedNo: row['Plot/Shed No'] || '',
                    waterConnectionNo: row['Prop_1_WaterConn'] || '',
                });
                console.log('User is not a member', {
                    email: row.Email,
                    password: hashedPassword,
                    is_Member: false,
                    user_type: constants_1.USER_TYPE.USER,
                    is_Email_Verified: true,
                    account_status: 1,
                    roleName: [],
                    approval_status: 1,
                    user_name: yield (0, helper_1.generateUniqueRandomUsername)(),
                    companyName: row['Company Name'],
                    plotShedNo: row['Plot/Shed No'] || '',
                    waterConnectionNo: row['Prop_1_WaterConn'] || '',
                });
            }
            else {
                // continue;
                // user = new User({
                //   email: row.Email,
                //   password: hashedPassword,
                //   is_Member: true,
                //   user_type: USER_TYPE.USER,
                //   is_Email_Verified: true,
                //   account_status: 1,
                //   roleName: [],
                //   approval_status: 1,
                //   user_name: await generateUniqueUsernameUsingEmail(row.Email),
                //   companyName: row['Company Name'],
                // });
            }
            continue;
            // const savedUser = await user.save();
            // const membershipData: any = {
            //   userId: savedUser._id,
            // };
            // for (const [csvKey, mongoPath] of Object.entries(csvToMongoMap)) {
            //   if (row[csvKey]) {
            //     setNestedValue(membershipData, mongoPath, row[csvKey]);
            //   }
            // }
            // const membership = new MembershipModel(membershipData);
            // await membership.save();
            // console.log(`Successfully imported user: ${row.member_email}`);
            // results.imported++;
        }
        catch (error) {
            console.error(`Error processing row for email ${row.member_email}:`, error);
            results.failed++;
            results.errors.push({ email: row.member_email, error });
        }
    }
    //mongoose.disconnect();
    return {
        status: results.failed === 0 ? 'success' : 'partial_success',
        message: results.failed === 0
            ? 'All users imported successfully.'
            : `${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed.`,
        details: results,
    };
});
exports.processCSV = processCSV;
const processNonMemberCSV = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const jsonArray = yield (0, csvtojson_1.default)().fromFile(csvFilePath);
    const results = {
        total: jsonArray.length,
        imported: 0,
        skipped: 0,
        failed: 0,
        errors: [],
    };
    // ✅ Hash password once instead of per row
    const hashedPassword = yield bcrypt_1.default.hash(DEFAULT_PASSWORD, 10);
    // ✅ Prepare all user docs at once
    const usersToInsert = yield Promise.all(jsonArray.map((row) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (row['Membership ID'] !== 'None Member') {
                results.skipped++;
                return null;
            }
            return {
                // email: row.Email,
                password: hashedPassword,
                is_Member: false,
                user_type: constants_1.USER_TYPE.USER,
                is_Email_Verified: true,
                account_status: 1,
                roleName: [],
                approval_status: 1,
                user_name: yield (0, helper_1.generateUniqueRandomUsername)(),
                companyName: row['Company Name'],
                plotShedNo: row['Plot/Shed No'] || '',
                waterConnectionNo: row['Prop_1_WaterConn'] || '',
            };
        }
        catch (error) {
            console.log(error, 'error');
            results.failed++;
            results.errors.push({ email: row.Email || 'N/A', error });
            return null;
        }
    })));
    // ✅ Filter out nulls
    const validUsers = usersToInsert.filter(u => u !== null);
    console.log(validUsers, 'validUsers');
    try {
        // ✅ Insert in bulk
        console.log(validUsers === null || validUsers === void 0 ? void 0 : validUsers.length, 'validUsers');
        console.log(results, 'results');
        const inserted = yield User_1.default.insertMany(validUsers, { ordered: false });
        results.imported = inserted.length;
    }
    catch (error) {
        console.log(error, 'error');
        // Handle bulk insert errors
        if (error.writeErrors) {
            error.writeErrors.forEach((e) => {
                results.failed++;
                results.errors.push({
                    email: e.err.op.email,
                    error: e.errmsg,
                });
            });
            results.imported += ((_a = error.result) === null || _a === void 0 ? void 0 : _a.nInserted) || 0;
        }
        else {
            throw error;
        }
    }
    return {
        status: results.failed === 0 ? 'success' : 'partial_success',
        message: results.failed === 0
            ? 'All users imported successfully.'
            : `${results.imported} imported, ${results.skipped} skipped, ${results.failed} failed.`,
        details: results,
    };
});
exports.processNonMemberCSV = processNonMemberCSV;
