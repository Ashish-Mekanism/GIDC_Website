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
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class FileHelper {
    // Get the absolute file path
    getFilePath(filename) {
        return path_1.default.resolve(filename); // Only resolve the filename
    }
    // Get the absolute directory path
    getDirectoryPath(directoryPath) {
        return path_1.default.resolve(directoryPath);
    }
    // Ensure a directory exists, or create it if it doesn't
    ensureDirectoryExists(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.access(directory);
            }
            catch (_a) {
                yield promises_1.default.mkdir(directory, { recursive: true });
            }
        });
    }
    // Delete a single file
    deleteFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.getFilePath(filename);
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (error) {
                console.error(`Error deleting file: ${filePath}`, error);
            }
        });
    }
    // Delete multiple files
    deleteFiles(filenames) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePromises = filenames.map((filename) => this.deleteFile(filename));
            yield Promise.all(deletePromises);
        });
    }
    // Create a directory
    createDirectory(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureDirectoryExists(directoryPath);
            return directoryPath;
        });
    }
    // Delete a directory
    deleteDirectory(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.rm(directoryPath, { recursive: true, force: true });
            }
            catch (error) {
                console.error(`Error deleting directory: ${directoryPath}`, error);
            }
        });
    }
    // List files in a directory
    listFiles(directoryPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield promises_1.default.readdir(directoryPath);
                return files;
            }
            catch (error) {
                console.error(`Error listing files in directory: ${directoryPath}`, error);
                return [];
            }
        });
    }
}
exports.default = FileHelper;
