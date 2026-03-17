
import { IQuickLink } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const QuickLinkSchema: Schema<IQuickLink> = new Schema(
    {
        CreatedBy: {
              type: SchemaTypes.ObjectId,
              ref: DbModel.User,
              index: true,
              required: true
          },
        Icon: { type: String}, // Optional icon URL
        Title: { type: String},
        Links: [
            {
                title: { type: String},
                url: { type: String},
            },
        ],
    },
    { timestamps: true }
);

const QuickLink = model<IQuickLink>(DbModel.QuickLink, QuickLinkSchema);

export default QuickLink;