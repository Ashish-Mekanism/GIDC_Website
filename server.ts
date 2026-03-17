
// import app from './app';
// import logger from './src/config/logger';
// import { Server } from 'http';
// import startServer from './src/config/serverInit';
// import Config from './src/config';
// import seederInit from './src/config/seederInit';

// const PORT = Config.PORT || 5000;
// let server: Server | undefined;

// ////////////////////  Start Server ////////////////////
// startServer(app, PORT)
//   .then((startedServer) => {
//     server = startedServer;
//   })
//   .then(() => {
//     seederInit();
//   })
// //   .then(() => {
// //     import('./src/cron');
// //   })
//   .catch((error) => {
//     logger.error(`Failed to start the server: ${error.message}`);
//     process.exit(1);
//   });

// const exitHandler = () => {
//   if (server) {
//     server.close(() => {
//       logger.info('Server closed');
//       process.exit(1);
//     });
//   } else {
//     process.exit(1);
//   }
// };
// const unexpectedErrorHandler = (error: Error) => {
//   logger.error(error);
//   exitHandler();
// };
// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);


import dotenv from "dotenv";
dotenv.config(); // must be FIRST
import app from "./app";
import logger from "./src/config/logger";
import { Server, createServer } from "http";
import { createServer as createHttpsServer } from "https";
import fs from "fs";
import connectDB from "./src/config/serverInit";
import Config from "./src/config";
import seederInit from "./src/config/seederInit";
import { NODE_ENVIRONMENT } from "./src/utils/constants";

const PORT = Config.PORT || 5000;
let server: Server | undefined;

////////////////////  Start Server ////////////////////
connectDB()
  .then(() => {
    if (Config.NODE_ENV === NODE_ENVIRONMENT.PRODUCTION) {
      try {
        // Load SSL certificates
        const privateKey = fs.readFileSync(
          "/etc/letsencrypt/live/matchnmeet.io/privkey.pem",
          "utf8"
        );
        const certificate = fs.readFileSync(
          "/etc/letsencrypt/live/matchnmeet.io/cert.pem",
          "utf8"
        );
        const ca = fs.readFileSync(
          "/etc/letsencrypt/live/matchnmeet.io/chain.pem",
          "utf8"
        );

        const credentials = { key: privateKey, cert: certificate, ca: ca };
        server = createHttpsServer(credentials, app);
      } catch (error) {
        logger.error(`❌ Failed to start HTTPS server: ${(error as Error).message}`);
        process.exit(1);
      }
    } else {
      server = createServer(app);
      logger.info("✅ Using HTTP in development");
    }
    return server;
  })
  .then((server) => {
    server.listen(PORT, () => {
      logger.info(`                                                   `);
      logger.info(`            🧰  DB Connected  🧰                  `);
      logger.info(` ⚡  Server successfully running on port ${PORT} ⚡`);
      logger.info(`          Environment: ${Config.NODE_ENV}         `);
    })
  }).then(() => {
    seederInit();
    //processCSV();
  })
  .catch((error) => {
    logger.error(`Failed to start the server: ${error.message}`);
    process.exit(1);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);


