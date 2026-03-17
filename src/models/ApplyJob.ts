import { model, Schema } from "mongoose";
import { DbModel } from "../utils/constants";
import { IApplyJob } from "../types/models";

const ApplyJobSchema= new Schema<IApplyJob>(
    {
        careerOpportunityId: {
          type: Schema.Types.ObjectId,
          ref: DbModel.CareerOpportunity,
          
        },
      name: {
        type: String,
        
      },
      email: {
        type: String,
       
      },
      industryJob: {
        type: String,
        
      },
      contactNo: {
        type: String,
        
      },
      currentAddress: {
        type: String,
     
      },
      resume: {
        type: String,
      }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
  );
  

  const ApplyJob = model<IApplyJob>(
      DbModel.ApplyJob,
      ApplyJobSchema
  );

  export default ApplyJob;