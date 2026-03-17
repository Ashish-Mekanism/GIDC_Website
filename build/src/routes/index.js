"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("../utils/constants");
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
const config_1 = __importDefault(require("../config"));
const router = (0, express_1.Router)();
// All user Related Routes
router.use('/user', user_1.default);
// // All admin Related Routes
router.use('/admin', admin_1.default);
// // All Host Related Routes
// router.use('/host', hostRoutes);
// Index Route
router.get('/', (_req, res) => {
    const message = {
        message: ` [OIA] | NODE ENVIRONMENT:${config_1.default.NODE_ENV} | ${'serverRunning'} on port  ${config_1.default.PORT}`,
    };
    res.status(constants_1.RESPONSE_CODE.SUCCESS).json(message);
});
exports.default = router;
