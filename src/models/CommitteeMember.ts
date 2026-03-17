import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import { ICommitteeMember } from "../types/models";

const CommitteeMemberSchema: Schema<ICommitteeMember> = new Schema({

    CommitteeModelId: {
          type: SchemaTypes.ObjectId,
          ref: DbModel.Committee,
          index: true,
          required: true
      },
      CreatedBy: {
        type: SchemaTypes.ObjectId,
        ref: DbModel.User,
        index: true,
        required: true
    },
      Name:{
        type:String,
        require:true,
      },
      Designation:{
        type:String,
        require:true,
      },
      Photo:{
        type:String,
      },
 
  },
  { timestamps: true });
  

const  CommitteeMember = model<ICommitteeMember>(DbModel.CommitteeMember, CommitteeMemberSchema);

export default  CommitteeMember;


