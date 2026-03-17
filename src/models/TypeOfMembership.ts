
import { ITypeOfMembership } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const TypeOfMembershipSchema: Schema<ITypeOfMembership> = new Schema(
    {
        CreatedBy: {
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },

        Title: { type: String },
        Description1: { type: String },
        Description2: { type: String },
        MembershipPoints: { type: [String] },

    },
    { timestamps: true }
);

const TypeOfMembership = model<ITypeOfMembership>(DbModel.TypeOfMembership, TypeOfMembershipSchema);

export default TypeOfMembership;