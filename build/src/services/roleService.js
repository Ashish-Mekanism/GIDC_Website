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
exports.RoleService = void 0;
const Roles_1 = __importDefault(require("../models/Roles"));
class RoleService {
    constructor() {
        this.roles = [
            { role_Name: 'CMS' },
            { role_Name: 'PHOTO_GALLERY' },
            { role_Name: 'COMPLAINT' },
        ];
    }
    seedRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingRoles = yield Roles_1.default.find({
                role_Name: { $in: this.roles.map(role => role.role_Name) }
            });
            const existingRoleNames = new Set(existingRoles.map(role => role.role_Name));
            const newRoles = this.roles.filter(role => !existingRoleNames.has(role.role_Name));
            if (newRoles.length > 0) {
                yield Roles_1.default.insertMany(newRoles);
            }
        });
    }
}
exports.RoleService = RoleService;
