
import {  IMembershipBenefits } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const MembershipBenefitsSchema: Schema<IMembershipBenefits> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,
            ref: DbModel.User,
            index: true,
            required: true
        },

        MembershipBenefitDescription: { type: String },
        MebershipBenefitsPoints : {  type: [String] },
        MembershipBenefitDescription2: { type: String },
        MembershipBenefitDescription3: { type: String },
    },
    { timestamps: true }
);

const  MembershipBenefits = model<IMembershipBenefits>(DbModel.MembershipBenefits, MembershipBenefitsSchema);

export default  MembershipBenefits;