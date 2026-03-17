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
const auth_1 = __importDefault(require("../services/admin/auth"));
const config_1 = __importDefault(require("../config"));
const admin_1 = __importDefault(require("../services/admin"));
class AdminSeeder {
    constructor() {
        this.adminAuthService = new auth_1.default();
        this.adminService = new admin_1.default();
    }
    seed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserData = {
                    email: config_1.default.SUPER_ADMIN_EMAIL,
                    password: config_1.default.SUPER_ADMIN_PASSWORD,
                    //first_name: 'Admin',
                };
                const admin = yield this.adminService.findAdminByEmail(adminUserData === null || adminUserData === void 0 ? void 0 : adminUserData.email);
                if (admin) {
                    return;
                }
                yield this.adminAuthService.register(adminUserData);
            }
            catch (error) {
                console.error('Error seeding admin user:', error);
            }
        });
    }
}
exports.default = AdminSeeder;
