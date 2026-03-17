import ApplyJob from '../../../models/ApplyJob';
import { FOLDER_NAMES } from '../../../utils/constants';
import { isValidDayjs } from '../../../utils/helper';
import FileHelper from '../../fileService/fileHelper';
import FileService from '../../fileService/fileService';

export class AdminApplyJobService {
  fileHelper = new FileHelper();
  fileService = new FileService();

  async getAppliedJobSeekerList({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) {
    const validFromDate = isValidDayjs(fromDate);
    const validToDate = isValidDayjs(toDate);
    const matchStage: any = {};

    if (validFromDate || validToDate) {
      matchStage.createdAt = {};
      if (validFromDate) matchStage.createdAt.$gte = validFromDate;
      if (validToDate) matchStage.createdAt.$lte = validToDate;
    }

    const jobList = await ApplyJob.find({
      careerOpportunityId: { $exists: false },
      ...matchStage,
    });

    return jobList.map(job => ({
      ...job.toObject(),
      resumeUrl: job.resume
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.RESUME, [
            FOLDER_NAMES.RESUME,
            job.resume,
          ])
        : null,
    }));
  }

  async getAppliedParticularJobSeekerList(careerOpportunityId: string) {
    const jobList = await ApplyJob.find({
      careerOpportunityId: careerOpportunityId,
    });

    return jobList.map(job => ({
      ...job.toObject(),
      resumeUrl: job.resume
        ? this.fileService.getFilePathFromDatabase(FOLDER_NAMES.RESUME, [
            FOLDER_NAMES.RESUME,
            job.resume,
          ])
        : null,
    }));
  }
}
