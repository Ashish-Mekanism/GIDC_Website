import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import {  ISubTelephone } from "../types/models";




const SubTelephoneSchema: Schema<ISubTelephone> = new Schema({

    TelephoneModelId: {
          type: SchemaTypes.ObjectId,
          ref: DbModel.User,
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
      Address:{
        type:String,
        require:true,
      },
      Contact1:{
        type:Number,
     
      },
      Contact2:{
        type:Number,
     
      },
      Photo:{
        type:String,
      },
 
  },
  { timestamps: true });
  

const SubTelephone = model<ISubTelephone>(DbModel.SubTelephone, SubTelephoneSchema);

export default SubTelephone;


