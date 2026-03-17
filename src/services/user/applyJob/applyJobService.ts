import ApplyJob from "../../../models/ApplyJob";
import { IApplyJob } from "../../../types/models";

export class ApplyJobService {
 
    async applyJob( payload: Partial<IApplyJob>,file:any): Promise<IApplyJob> {
    
        const application = await ApplyJob.create({
          ...payload,
          resume: file?.filename 
        });
    
        return application;
       
      }
    }
