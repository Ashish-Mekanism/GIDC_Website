"use strict";
// import app from './app';
// import logger from './src/config/logger';
// import { Server } from 'http';
// import startServer from './src/config/serverInit';
// import Config from './src/config';
// import seederInit from './src/config/seederInit';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // must be FIRST
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./src/config/logger"));
const http_1 = require("http");
const https_1 = require("https");
const fs_1 = __importDefault(require("fs"));
const serverInit_1 = __importDefault(require("./src/config/serverInit"));
const config_1 = __importDefault(require("./src/config"));
const seederInit_1 = __importDefault(require("./src/config/seederInit"));
const constants_1 = require("./src/utils/constants");
const PORT = config_1.default.PORT || 5000;
let server;
////////////////////  Start Server ////////////////////
(0, serverInit_1.default)()
    .then(() => {
    if (config_1.default.NODE_ENV === constants_1.NODE_ENVIRONMENT.PRODUCTION) {
        try {
            // Load SSL certificates
            const privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/matchnmeet.io/privkey.pem", "utf8");
            const certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/matchnmeet.io/cert.pem", "utf8");
            const ca = fs_1.default.readFileSync("/etc/letsencrypt/live/matchnmeet.io/chain.pem", "utf8");
            const credentials = { key: privateKey, cert: certificate, ca: ca };
            server = (0, https_1.createServer)(credentials, app_1.default);
        }
        catch (error) {
            logger_1.default.error(`❌ Failed to start HTTPS server: ${error.message}`);
            process.exit(1);
        }
    }
    else {
        server = (0, http_1.createServer)(app_1.default);
        logger_1.default.info("✅ Using HTTP in development");
    }
    return server;
})
    .then((server) => {
    server.listen(PORT, () => {
        logger_1.default.info(`                                                   `);
        logger_1.default.info(`            🧰  DB Connected  🧰                  `);
        logger_1.default.info(` ⚡  Server successfully running on port ${PORT} ⚡`);
        logger_1.default.info(`          Environment: ${config_1.default.NODE_ENV}         `);
    });
}).then(() => {
    (0, seederInit_1.default)();
    //processCSV();
})
    .catch((error) => {
    logger_1.default.error(`Failed to start the server: ${error.message}`);
    process.exit(1);
});
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info("Server closed");
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
