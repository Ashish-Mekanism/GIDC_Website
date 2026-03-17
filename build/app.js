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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
require("./src/config");
const routes_1 = __importDefault(require("./src/routes"));
const morgan_1 = __importDefault(require("./src/config/morgan"));
const constants_1 = require("./src/utils/constants");
const ApiError_1 = __importDefault(require("./src/utils/ApiError"));
const error_1 = require("./src/middlewares/error");
const config_1 = __importDefault(require("./src/config"));
const path_1 = __importDefault(require("path"));
const rootDir = process.cwd();
const app = (0, express_1.default)();
// Serve Static Files
app.use(`${config_1.default.baseRoute}/uploads`, express_1.default.static(path_1.default.join(rootDir, constants_1.FOLDER_NAMES.UPLOADS)));
if (config_1.default.NODE_ENV !== constants_1.NODE_ENVIRONMENT.STAGING) {
    app.use(morgan_1.default.successHandler);
    app.use(morgan_1.default.errorHandler);
}
// parse json request body
app.use(express_1.default.json());
// set security HTTP headers
app.use((0, helmet_1.default)());
//middleware for cookies
app.use((0, cookie_parser_1.default)());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// gzip compression
app.use((0, compression_1.default)());
// enable cors
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
// app.use(
//     cors({
//     origin: '*', // Allow all origins
//     credentials: true, // Allow credentials (cookies, HTTP auth, etc.)
//     })
//     );
// app.use(
//     cors({
//         origin: "https://oia-app.netlify.app",
//         credentials: true,
//     })
// );
//dynamic json storage
// app.use(i18n);
//app.use(i18nMiddleware);
// Apply your custom middleware to globally set the language for each request
//app.use(i18nLanguageMiddleware);
//Hello
// routes
app.use('/oiabackend', routes_1.default);
app.get("/shutdown", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Server shutting down...");
    console.log("Server closed");
    process.exit(0); // graceful exit
}));
// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
    next(new ApiError_1.default(constants_1.RESPONSE_CODE.NOT_FOUND, ('RouteNotFound')));
});
// convert error to ApiError, if needed
app.use(error_1.errorConverter);
// handle error
app.use(error_1.errorHandler);
exports.default = app;
