import multer from 'multer';
import path from 'path';
import FileHelper from './fileHelper';
import Config from '../../config';

class FileService {
  private fileHelper: FileHelper;
  private uploadPath: string; // Store the upload path
  private uploadFolder: string;

  constructor(uploadFolder = 'uploads') {
    this.uploadFolder = uploadFolder;
    this.uploadPath = path.resolve(uploadFolder); // Set the upload path
    this.fileHelper = new FileHelper(); // Instantiate FileHelper

    // Ensure the upload directory exists
    this.fileHelper.ensureDirectoryExists(this.uploadPath);
  }

  // Configure multer storage
  private multerStorage(
    modulesMap: Record<string, { module: Function; fileNameGenerator?: Function }>
  ) {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        const config = modulesMap[file.fieldname];
        if (!config) {
          return cb(
            new Error(`No module configured for field: ${file.fieldname}`),
            ''
          );
        }

        // Determine the target subdirectory based on the module
        const modulePath = config.module(req);

if (!modulePath || typeof modulePath !== 'string') {
  return cb(
    new Error(`Invalid module path for field: ${file.fieldname}`),
    ''
  );
}

const targetDir = path.resolve(this.uploadPath, modulePath);

        // const targetDir = path.resolve(this.uploadPath, config.module(req));
        
        await this.fileHelper.ensureDirectoryExists(targetDir); // Use FileHelper
        cb(null, targetDir);
      },
      filename: (req, file, cb) => {
        const config = modulesMap[file.fieldname];
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const defaultFileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
        const fileName =
          config?.fileNameGenerator?.(req, file) ?? defaultFileName;
        cb(null, fileName);
      },
    });
  }

  // Multer middleware
  public multerMiddleware(
    modulesMap: Record<
      string,
      {
        module: Function;
        fileNameGenerator?: Function;
        maxSize?: number;
        allowedTypes?: string[];
      }
    >
  ) {
    return multer({
      storage: this.multerStorage(modulesMap),
      limits: {
        fileSize: Math.max(
          ...Object.values(modulesMap).map((config) => config.maxSize || 0)
        ),
      },
      fileFilter: (req, file, cb) => {
        console.log('MULTER FIELDNAME:', file.fieldname);

        const config = modulesMap[file.fieldname];
        if (!config) {
          return cb(new Error(`No configuration for field: ${file.fieldname}`));
        }

        if (
          config.allowedTypes &&
          config.allowedTypes.length > 0 &&
          !config.allowedTypes.includes(file.mimetype)
        ) {
          return cb(new Error(`Invalid file type: ${file.mimetype}`));
        }
        cb(null, true);
      },
    });
  }

  // Get file path
  public getFilePath(module: string, filename: string): string {
    return this.fileHelper.getFilePath(
      path.resolve(this.uploadPath, module, filename)
    ); // Use uploadPath in conjunction with FileHelper
  }

  // Get media folder path
  public getMediaFolderPath(module: string): string {
    return this.fileHelper.getDirectoryPath(
      path.resolve(this.uploadPath, module)
    ); // Use uploadPath in conjunction with FileHelper
  }

  // Delete single file
  public async deleteFile(module: string, filename: string): Promise<void> {
    const filePath = this.getFilePath(module, filename);
    await this.fileHelper.deleteFile(filePath); // Use FileHelper
  }

  // Delete multiple files
  public async deleteFiles(module: string, filenames: string[]): Promise<void> {
    const deletePromises = filenames.map((filename) =>
      this.deleteFile(module, filename)
    );
    await Promise.all(deletePromises);
  }

  // Create directory
  public async createDirectory(
    module: string,
    directoryName: string
  ): Promise<string> {
    const directoryPath = path.resolve(this.uploadPath, module, directoryName);
    await this.fileHelper.createDirectory(directoryPath); // Use FileHelper
    return directoryPath;
  }

  // Delete directory
  public async deleteDirectory(
    module: string,
    directoryName: string
  ): Promise<void> {
    const directoryPath = path.resolve(this.uploadPath, module, directoryName);
    await this.fileHelper.deleteDirectory(directoryPath); // Use FileHelper
  }

  // List files in a module's directory
  public async listFiles(
    module: string,
    directoryName = ''
  ): Promise<string[]> {
    const directoryPath = path.resolve(this.uploadPath, module, directoryName);
    return this.fileHelper.listFiles(directoryPath); // Use FileHelper
  }
  public getFilePathFromDatabase(
    module: string,
    submodules: string[] = []
  ): string {
    const nestedPath =
      submodules.length > 0 ? `${module}/${submodules.join('/')}` : module;

    return `${Config.BaseUrl}/${this.uploadFolder}/${nestedPath}`;
    // return `${this.uploadFolder}/${nestedPath}/`;
  }
}

export default FileService;
