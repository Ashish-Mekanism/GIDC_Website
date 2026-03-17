"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("../database/connection");
const mongoose_1 = require("mongoose");
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to the database
            yield (0, connection_1.MongoDBConnection)();
            // Start the server
            // const server = app.listen(PORT, () => {
            //   logger.info(`                                                   `);
            //   logger.info(`            🧰  DB Connected  🧰                  `);
            //   logger.info(` ⚡  Server successfully running on port ${PORT} ⚡`);
            //   logger.info(`          Environment: ${Config.NODE_ENV}         `);
            // });
            // return server;
        }
        catch (error) {
            if (error instanceof mongoose_1.MongooseError) {
                throw new Error(error.message);
            }
        }
    });
}
exports.default = connectDB;
