
import { IAbout } from "../types/models";
import { DbModel } from "../utils/constants";
import { model, Schema, SchemaTypes } from "mongoose";

const AboutSchema: Schema<IAbout> = new Schema(
    {
        CreatedBy:{
            type: SchemaTypes.ObjectId,

            ref: DbModel.User,
            index: true,
            required: true
        },
        Paragraph1:{ type: String },
        Paragraph2:{ type: String },
        Paragraph3:{ type: String },
       
    },
    { timestamps: true }
);

const About = model<IAbout>(DbModel.About, AboutSchema);

export default About;