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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileHelper_1 = __importDefault(require("./fileHelper"));
const config_1 = __importDefault(require("../../config"));
class FileService {
    constructor(uploadFolder = 'uploads') {
        this.uploadFolder = uploadFolder;
        this.uploadPath = path_1.default.resolve(uploadFolder); // Set the upload path
        this.fileHelper = new fileHelper_1.default(); // Instantiate FileHelper
        // Ensure the upload directory exists
        this.fileHelper.ensureDirectoryExists(this.uploadPath);
    }
    // Configure multer storage
    multerStorage(modulesMap) {
        return multer_1.default.diskStorage({
            destination: (req, file, cb) => __awaiter(this, void 0, void 0, function* () {
                const config = modulesMap[file.fieldname];
                if (!config) {
                    return cb(new Error(`No module configured for field: ${file.fieldname}`), '');
                }
                // Determine the target subdirectory based on the module
                const modulePath = config.module(req);
                if (!modulePath || typeof modulePath !== 'string') {
                    return cb(new Error(`Invalid module path for field: ${file.fieldname}`), '');
                }
                const targetDir = path_1.default.resolve(this.uploadPath, modulePath);
                // const targetDir = path.resolve(this.uploadPath, config.module(req));
                yield this.fileHelper.ensureDirectoryExists(targetDir); // Use FileHelper
                cb(null, targetDir);
            }),
            filename: (req, file, cb) => {
                var _a, _b;
                const config = modulesMap[file.fieldname];
                const ext = path_1.default.extname(file.originalname);
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const defaultFileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
                const fileName = (_b = (_a = config === null || config === void 0 ? void 0 : config.fileNameGenerator) === null || _a === void 0 ? void 0 : _a.call(config, req, file)) !== null && _b !== void 0 ? _b : defaultFileName;
                cb(null, fileName);
            },
        });
    }
    // Multer middleware
    multerMiddleware(modulesMap) {
        return (0, multer_1.default)({
            storage: this.multerStorage(modulesMap),
            limits: {
                fileSize: Math.max(...Object.values(modulesMap).map((config) => config.maxSize || 0)),
            },
            fileFilter: (req, file, cb) => {
                console.log('MULTER FIELDNAME:', file.fieldname);
                const config = modulesMap[file.fieldname];
                if (!config) {
                    return cb(new Error(`No configuration for field: ${file.fieldname}`));
                }
                if (config.allowedTypes &&
                    config.allowedTypes.length > 0 &&
                    !config.allowedTypes.includes(file.mimetype)) {
                    return cb(new Error(`Invalid file type: ${file.mimetype}`));
                }
                cb(null, true);
            },
        });
    }
    // Get file path
    getFilePath(module, filename) {
        return this.fileHelper.getFilePath(path_1.default.resolve(this.uploadPath, module, filename)); // Use uploadPath in conjunction with FileHelper
    }
    // Get media folder path
    getMediaFolderPath(module) {
        return this.fileHelper.getDirectoryPath(path_1.default.resolve(this.uploadPath, module)); // Use uploadPath in conjunction with FileHelper
    }
    // Delete single file
    deleteFile(module, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = this.getFilePath(module, filename);
            yield this.fileHelper.deleteFile(filePath); // Use FileHelper
        });
    }
    // Delete multiple files
    deleteFiles(module, filenames) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePromises = filenames.map((filename) => this.deleteFile(module, filename));
            yield Promise.all(deletePromises);
        });
    }
    // Create directory
    createDirectory(module, directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const directoryPath = path_1.default.resolve(this.uploadPath, module, directoryName);
            yield this.fileHelper.createDirectory(directoryPath); // Use FileHelper
            return directoryPath;
        });
    }
    // Delete directory
    deleteDirectory(module, directoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const directoryPath = path_1.default.resolve(this.uploadPath, module, directoryName);
            yield this.fileHelper.deleteDirectory(directoryPath); // Use FileHelper
        });
    }
    // List files in a module's directory
    listFiles(module_1) {
        return __awaiter(this, arguments, void 0, function* (module, directoryName = '') {
            const directoryPath = path_1.default.resolve(this.uploadPath, module, directoryName);
            return this.fileHelper.listFiles(directoryPath); // Use FileHelper
        });
    }
    getFilePathFromDatabase(module, submodules = []) {
        const nestedPath = submodules.length > 0 ? `${module}/${submodules.join('/')}` : module;
        return `${config_1.default.BaseUrl}/${this.uploadFolder}/${nestedPath}`;
        // return `${this.uploadFolder}/${nestedPath}/`;
    }
}
exports.default = FileService;
