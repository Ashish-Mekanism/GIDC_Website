import fs from 'fs/promises';
import path from 'path';


class FileHelper {

  // Get the absolute file path
  public getFilePath(filename: string): string {
    return path.resolve(filename); // Only resolve the filename
  }

  // Get the absolute directory path
  public getDirectoryPath(directoryPath: string): string {
    return path.resolve(directoryPath);
  }

  // Ensure a directory exists, or create it if it doesn't
  public async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.access(directory);
    } catch {
      await fs.mkdir(directory, { recursive: true });
    }
  }

  // Delete a single file
  public async deleteFile(filename: string): Promise<void> {
    const filePath = this.getFilePath(filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }

  // Delete multiple files
  public async deleteFiles(filenames: string[]): Promise<void> {
    const deletePromises = filenames.map((filename) =>
      this.deleteFile(filename)
    );
    await Promise.all(deletePromises);
  }

  // Create a directory
  public async createDirectory(directoryPath: string): Promise<string> {
    await this.ensureDirectoryExists(directoryPath);
    return directoryPath;
  }

  // Delete a directory
  public async deleteDirectory(directoryPath: string): Promise<void> {
    try {
      await fs.rm(directoryPath, { recursive: true, force: true });
    } catch (error) {
      console.error(`Error deleting directory: ${directoryPath}`, error);
    }
  }

  // List files in a directory
  public async listFiles(directoryPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(directoryPath);
      return files;
    } catch (error) {
      console.error(
        `Error listing files in directory: ${directoryPath}`,
        error
      );
      return [];
    }
  }
}

export default FileHelper;
