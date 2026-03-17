import { model, Schema } from 'mongoose';
import { DbModel } from '../utils/constants';
import { IEmailTemplate } from '../types/models';

const EmailTemplateSchema: Schema<IEmailTemplate> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    emailTo: {
      type: [String],
    },
  },
  { timestamps: true }
);

const EmailTemplateModel = model<IEmailTemplate>(
  DbModel.EmailTemplate,
  EmailTemplateSchema
);

export default EmailTemplateModel;
