import { model, Schema } from "mongoose";
import { DbModel } from "../utils/constants";
import { IRole } from "../types/models";




const RoleSchema: Schema<IRole> = new Schema({

    role_Name: { type: String, required: true, unique: true },
    
  });
  

const Role = model<IRole>(DbModel.Role, RoleSchema);

export default Role;


