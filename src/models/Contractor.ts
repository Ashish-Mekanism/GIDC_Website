import { model, Schema, SchemaTypes } from 'mongoose';
import { DbModel } from '../utils/constants';
import { IContractor } from '../types/models';

const requiredIfNotExported = function (this: any) {
  return !this.isExported;
};
const ContractorSchema: Schema<IContractor> = new Schema({
  ServiceIds: [
    {
      type: SchemaTypes.ObjectId,
      ref: DbModel.ServiceCategory,
      index: true,
      required: requiredIfNotExported,
    },
  ],

  ContractorName: { type: String, required: true, unique: true },
  ContractorEmail: { type: String, required: requiredIfNotExported },
  isExported: { type: Boolean, default: false },
  active: { type: Boolean },
});

const Contractor = model<IContractor>(DbModel.Contractor, ContractorSchema);

export default Contractor;
