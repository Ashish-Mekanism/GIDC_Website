"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seeders_1 = __importDefault(require("../seeders"));
const actionSeeder_1 = __importDefault(require("../seeders/actionSeeder"));
const adminSeeder_1 = __importDefault(require("../seeders/adminSeeder"));
const configSeeder_1 = __importDefault(require("../seeders/configSeeder"));
const emailTemplateSeeder_1 = __importDefault(require("../seeders/emailTemplateSeeder"));
const roleSeeder_1 = __importDefault(require("../seeders/roleSeeder"));
const serviceCategorySeeder_1 = __importDefault(require("../seeders/serviceCategorySeeder"));
const logger_1 = __importDefault(require("./logger"));
const seederInit = () => {
    const seeder = new seeders_1.default([
        new adminSeeder_1.default(),
        new roleSeeder_1.default(),
        new actionSeeder_1.default(),
        new configSeeder_1.default(),
        new serviceCategorySeeder_1.default(),
        new emailTemplateSeeder_1.default(),
    ]);
    seeder
        .seed()
        .then(() => {
        logger_1.default.info('          🌲All seeders completed.🌲       ');
    })
        .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });
};
exports.default = seederInit;
