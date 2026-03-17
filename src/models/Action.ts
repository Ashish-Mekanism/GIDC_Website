import { model, Schema } from "mongoose";
import { DbModel } from "../utils/constants";
import { IAction } from "../types/models";




const ActionSchema: Schema<IAction> = new Schema({

    Action: { type: String, required: true, unique: true },
    
  });
  

const Action = model<IAction>(DbModel.Action, ActionSchema);

export default Action;


