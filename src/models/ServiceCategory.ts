import { model, Schema } from 'mongoose';
import { DbModel } from '../utils/constants';
import { IServiceCategory } from '../types/models';

const ServiceCategorySchema: Schema<IServiceCategory> = new Schema({
  ServiceCategoryName: { type: String, required: true, unique: true },
  active: { type: Boolean },
  key: {
    type: String,
    unique: true,
    sparse: true,
  },
});

const ServiceCategory = model<IServiceCategory>(
  DbModel.ServiceCategory,
  ServiceCategorySchema
);

export default ServiceCategory;
