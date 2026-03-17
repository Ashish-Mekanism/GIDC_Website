import mongoose, { Schema, Model } from 'mongoose';
import { DbModel } from '../utils/constants';
import { IBlackListToken } from '../types/models';

const blackListTokenSchema: Schema<IBlackListToken> = new Schema({
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const BlackListToken: Model<IBlackListToken> = mongoose.model<IBlackListToken>(
  DbModel.BlackListToken,
  blackListTokenSchema
);

export default BlackListToken;
