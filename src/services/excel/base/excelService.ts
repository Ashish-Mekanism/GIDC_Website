import ExcelJS from 'exceljs';
import { Response } from 'express';

abstract class ExcelService {
  protected workbook: ExcelJS.Workbook;

  constructor() {
    this.workbook = new ExcelJS.Workbook();
  }

  protected createWorksheet(name: string): ExcelJS.Worksheet {
    return this.workbook.addWorksheet(name);
  }

  protected setColumns(
    sheet: ExcelJS.Worksheet,
    columns: { header: string; key: string; width?: number }[]
  ) {
    sheet.columns = columns;
  }

  protected addRows(sheet: ExcelJS.Worksheet, data: Record<string, any>[]) {
    sheet.addRows(data);
  }

  protected async saveToFile(fileName: string) {
    await this.workbook.xlsx.writeFile(fileName);
  }

  abstract generate(res:Response,obj:any):Promise<any>; 
}

export default ExcelService;
