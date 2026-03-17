import { Application } from 'express';
import { MongoDBConnection } from '../database/connection';
import logger from './logger';
import Config from '.';
import { Server } from 'http';
import { MongooseError } from 'mongoose';

async function connectDB(

) {
  try {
    // Connect to the database
    await MongoDBConnection();

    // Start the server
    // const server = app.listen(PORT, () => {
    //   logger.info(`                                                   `);
    //   logger.info(`            🧰  DB Connected  🧰                  `);
    //   logger.info(` ⚡  Server successfully running on port ${PORT} ⚡`);
    //   logger.info(`          Environment: ${Config.NODE_ENV}         `);
    // });
    // return server;
  } catch (error: any) {
    if (error instanceof MongooseError) {
      throw new Error(error.message);
    }
  }
}

export default connectDB;
