import { model, Schema, SchemaTypes } from "mongoose";
import { DbModel } from "../utils/constants";
import {  ITelephone } from "../types/models";




const TelephoneSchema: Schema<ITelephone> = new Schema({

    Title: { type: String, required: true, unique: true },
   CreatedBy: {
          type: SchemaTypes.ObjectId,
          ref: DbModel.User,
          index: true,
          required: true
      },
      Active:{
        type:Boolean,
        require:true,
      }
  },
  { timestamps: true });
  

const Telephone = model<ITelephone>(DbModel.Telephone, TelephoneSchema);

export default Telephone;


