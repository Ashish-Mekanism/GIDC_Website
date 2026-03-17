import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import {  ICommittee } from "../types/models";




const CommitteeSchema: Schema<ICommittee> = new Schema({

    CommitteeName: { type: String, required: true, unique: true },
   CreatedBy: {
          type: SchemaTypes.ObjectId,
          ref: DbModel.User,
          index: true,
          required: true
      },
    //   Active:{
    //     type:Boolean,
    //     require:true,
    //   }
  },
  { timestamps: true });
  

const Committee = model<ICommittee>(DbModel.Committee, CommitteeSchema);

export default Committee;


