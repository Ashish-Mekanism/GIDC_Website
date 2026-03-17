import express, { NextFunction, Request, Response } from "express";

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import "./src/config";
import routes from "./src/routes";
import morgan from "./src/config/morgan";
import {
  FOLDER_NAMES,
  NODE_ENVIRONMENT,
  RESPONSE_CODE
} from "./src/utils/constants";

import ApiError from "./src/utils/ApiError";
import { errorConverter, errorHandler } from "./src/middlewares/error";

import Config from "./src/config";
import { resourceLimits } from "worker_threads";
import path from "path";
import { Server } from "http";

const rootDir = process.cwd();
const app = express();
// Serve Static Files
app.use(
  `${Config.baseRoute}/uploads`,
  express.static(path.join(rootDir, FOLDER_NAMES.UPLOADS))
);

if (Config.NODE_ENV !== NODE_ENVIRONMENT.STAGING) {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// parse json request body
app.use(express.json());

// set security HTTP headers
app.use(helmet());

//middleware for cookies
app.use(cookieParser());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

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
app.use("/oiabackend", routes);
app.get("/shutdown", async (req, res) => {
  res.send("Server shutting down...");
  console.log("Server closed");
  process.exit(0); // graceful exit
});
// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(RESPONSE_CODE.NOT_FOUND, "RouteNotFound"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
