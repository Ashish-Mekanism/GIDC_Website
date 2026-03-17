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
exports.ActionService = void 0;
const Action_1 = __importDefault(require("../models/Action"));
class ActionService {
    constructor() {
        this.actions = [
            { Action: 'EDIT' },
            { Action: 'VIEW' },
            { Action: 'DELETE' },
            { Action: 'PRINT' },
        ];
    }
    seedAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingAction = yield Action_1.default.find({
                Action: { $in: this.actions.map(action => action.Action) }
            });
            const existingActionName = new Set(existingAction.map(action => action.Action));
            const newAction = this.actions.filter(action => !existingActionName.has(action.Action));
            if (newAction.length > 0) {
                yield Action_1.default.insertMany(newAction);
            }
        });
    }
}
exports.ActionService = ActionService;
