import { Response } from "express";
import ComplaintModel from "../../../models/Complaint";
import ServiceCategory from "../../../models/ServiceCategory";
import {
  COMPLAINT_STATUS,
  COMPLAINT_STATUS_QUERY,
  DEFAULT_SERVICE_CATEGORIES,
} from "../../../utils/constants";
import { isValidDayjs } from "../../../utils/helper";
import ExcelService from "../base/excelService";

interface IServiceRequestFilters {
  key: string;
  status: string;
  fromDate: Date | null | string;
  toDate: Date | null | string;
}
export interface IComplaint {
  _id: string;
  userId: string;
  email: string;
  mobile: string;
  phone: string;
  complaint_photo: string[];
  companyName: string;
  personName: string;
  roadNo: string;
  address: string;
  serviceCategory?: {
    _id: string;
    key: string;
    ServiceCategoryName: string;
    __v: number;
    active: boolean;
  } | null;
  ServiceCategoryName: string;
  serviceDetails: string;
  status: number;
  waterConnectionNo: string;
  createdAt: string;
  updatedAt: string;
  serviceNumber: number;
  __v: number;
  assignContractor?: {
    _id: string;
    ServiceIds: string[];
    ContractorName: string;
    ContractorEmail: string;
    active: boolean;
    __v: number;
  } | null;
  assignedContractorAt?: string;
  completedServiceAt?: string;
}

class ServiceRequestsExcel extends ExcelService {
  private workSheetName = "ServiceRequests";

  async getServiceRequestFilters(filters: IServiceRequestFilters) {
    const { key, status, fromDate, toDate } = filters;

    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);

    const allServiceCategories = await ServiceCategory.find({}).lean();
    const defaultKeys = DEFAULT_SERVICE_CATEGORIES.map((cat) => cat.key);
    const matchStage: any = {};

    // Date Filter
    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    const statusFilters: any[] = [
      { status: { $ne: COMPLAINT_STATUS.DELETED } },
    ];

    if (status === COMPLAINT_STATUS_QUERY.PENDING_ASSIGNED?.toString()) {
      statusFilters.push({
        status: { $in: [COMPLAINT_STATUS.PENDING, COMPLAINT_STATUS.ASSIGN] },
      });
    } else if (status === COMPLAINT_STATUS_QUERY.COMPLETED?.toString()) {
      statusFilters.push({
        status: { $eq: COMPLAINT_STATUS.COMPLETED },
      });
    }

    if (statusFilters.length > 1) {
      // APPLY FILTER WITH DELETE AND STATUS
      matchStage.$and = statusFilters;
    } else {
      // APPLY ONLY DELETE FILTER IF NOT STATUS
      Object.assign(matchStage, statusFilters[0]);
    }

    // Key Filter
    // If key is passed and it's "others"
    if (key === "others") {
      const nonOtherCategoryIds = allServiceCategories
        .filter((cat) => defaultKeys.includes(cat.key))
        .map((cat) => cat._id);

      matchStage.$or = [
        { serviceCategory: { $exists: false } },
        { serviceCategory: { $nin: nonOtherCategoryIds } },
      ];
    } else if (key && defaultKeys.includes(key)) {
      const matchedCategory = allServiceCategories.find(
        (cat) => cat.key === key
      );
      if (matchedCategory) {
        matchStage.serviceCategory = matchedCategory._id;
      }
    }
    return matchStage;
  }
  mapComplaintToRow(complaint: any): {
    ID: string;
    UserID: string;
    Email: string;
    Mobile: string;
    Phone: string;
    ComplaintPhotos: string;
    CompanyName: string;
    PersonName: string;
    RoadNo: string;
    Address: string;
    ServiceCategoryID: string;
    ServiceCategoryKey: string;
    ServiceCategoryName: string;
    ServiceDetails: string;
    Status: string;
    WaterConnectionNo: string;
    CreatedAt: string;
    UpdatedAt: string;
    ServiceNumber: number;
    ContractorID: string;
    ContractorName: string;
    ContractorEmail: string;
    AssignedContractorAt: string;
    CompletedServiceAt: string;
    isCreatedByAdmin: boolean;
  } {
    return {
      ID: complaint?._id ?? "",
      UserID: complaint?.userId ?? "",
      Email: complaint?.email ?? "",
      Mobile: complaint?.mobile ?? "",
      Phone: complaint?.phone ?? "",
      ComplaintPhotos: complaint?.complaint_photo?.join(", "),
      CompanyName: complaint?.companyName ?? "",
      PersonName: complaint?.personName ?? "",
      RoadNo: complaint?.roadNo ?? "",
      Address: complaint?.address ?? "",
      ServiceCategoryID: complaint.serviceCategory?._id ?? "",
      ServiceCategoryKey: complaint.serviceCategory?.key ?? "",
      ServiceCategoryName:
        complaint.serviceCategory?.ServiceCategoryName ??
        complaint.ServiceCategoryName,
      ServiceDetails: complaint?.serviceDetails ?? "",
      Status: complaint?.status ?? "",
      WaterConnectionNo: complaint?.waterConnectionNo ?? "",
      CreatedAt: complaint.createdAt ?? "",
      UpdatedAt: complaint.updatedAt ?? "",
      ServiceNumber: complaint?.serviceNumber ?? "",
      ContractorID: complaint.assignContractor?._id ?? "",
      ContractorName: complaint.assignContractor?.ContractorName ?? "",
      ContractorEmail: complaint.assignContractor?.ContractorEmail ?? "",
      AssignedContractorAt: complaint.assignedContractorAt ?? "",
      CompletedServiceAt: complaint.completedServiceAt ?? "",
      isCreatedByAdmin: true,
    };
  }

  async generate(
    res: Response,
    {
      filters,
    }: {
      filters: IServiceRequestFilters;
    }
  ) {
    const sheet = this.createWorksheet(this.workSheetName);
    const matchStage = (await this.getServiceRequestFilters(filters)) || {};

    const complaints = await ComplaintModel.find(matchStage)
      .populate("serviceCategory assignContractor")
      .lean();
    const rows = complaints.map(this.mapComplaintToRow);
    this.setColumns(sheet, [
      { header: "Service Number", key: "ServiceNumber", width: 20 },
      { header: "Email", key: "Email", width: 25 },
      { header: "Mobile", key: "Mobile", width: 15 },
      { header: "Phone", key: "Phone", width: 15 },
      { header: "Name", key: "PersonName", width: 25 },
      { header: "Company", key: "CompanyName", width: 30 },
      { header: "Road No", key: "RoadNo", width: 10 },
      { header: "Address", key: "Address", width: 30 },
      { header: "Water Connection No", key: "WaterConnectionNo", width: 20 },
      { header: "Service Category", key: "ServiceCategoryName", width: 20 },
      { header: "Service Details", key: "ServiceDetails", width: 40 },
      { header: "Status", key: "Status", width: 12 },
      { header: "Created At", key: "CreatedAt", width: 20 },
      {
        header: "Assigned Contractor At",
        key: "AssignedContractorAt",
        width: 20,
      },
      { header: "Completed At", key: "CompletedServiceAt", width: 20 },
      { header: "Contractor Name", key: "ContractorName", width: 25 },
      { header: "Contractor Email", key: "ContractorEmail", width: 25 },
    ]);
    this.addRows(sheet, rows);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=complaints.xlsx"
    );

    await this.workbook.xlsx.write(res);
    res.end();
  }
}

export default ServiceRequestsExcel;
