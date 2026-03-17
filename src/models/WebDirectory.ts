import { model, Schema, SchemaTypes } from "mongoose";
import { IWebDirectory } from "../types/models";
import { DbModel } from "../utils/constants";

const WebDirectorySchema = new Schema<IWebDirectory>({
 userId: {
                type: SchemaTypes.ObjectId,
                ref: DbModel.User,
                required: true,
            },
            created_by: {
                type: SchemaTypes.ObjectId,
                ref: DbModel.User
              },    
    companyName: { type: String },
    companyLogo: { type: String },
    personalPhone: { type: Number },
    companyPhone: { type: Number },
    personalEmail: { type: String },
    companyEmail: { type: String },
    companyProfile: { type: String },
    productDetails: { type: String },
    product: [{
       // _id:{type:SchemaTypes.ObjectId},
        productName: { type: String },
        productImage: { type: String },

    }],
    location: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String }
    },
    active: {
        type: Boolean,
    },
    
    membershipNo: {
    type:String
    }

}, { timestamps: true });


const WebDirectoryModel = model<IWebDirectory>(
    DbModel.WebDirectory,
    WebDirectorySchema
);

export default WebDirectoryModel;