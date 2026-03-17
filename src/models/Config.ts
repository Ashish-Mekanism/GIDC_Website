import { model, Schema } from 'mongoose';
import { DbModel } from '../utils/constants';
import { IConfig } from '../types/models';

const ConfigSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const ConfigModel = model<IConfig>(DbModel.Config, ConfigSchema);

export default ConfigModel;
