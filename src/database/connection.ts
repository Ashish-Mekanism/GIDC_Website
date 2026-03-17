import Mongoose from 'mongoose';

import { NODE_ENVIRONMENT } from '../utils/constants';
import Config from '../config';

let connectionPromise: Promise<boolean> | null = null;

/// Connect to MongoDB database
const MongoDBConnection = async (): Promise<boolean> => {
  if (!connectionPromise) {
    connectionPromise = new Promise<boolean>((resolve, reject) => {
      let DB_URL: string;

      switch (Config.NODE_ENV) {
        case NODE_ENVIRONMENT.PRODUCTION:
          DB_URL = Config.DB_URL;
          break;
        case NODE_ENVIRONMENT.DEVELOPMENT:
          DB_URL = Config.DB_URL;
          break;
        default:
          reject(new Error('Invalid environment'));
          return;
      }
    
      Mongoose.connect(DB_URL, {})
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return connectionPromise;
};

export { MongoDBConnection };
