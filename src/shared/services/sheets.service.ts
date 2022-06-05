import { Injectable } from '@angular/core';
import { StorageService } from '../storage/interfaces/storage';
import { Settings } from '../model/settings';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root',
})
export class SheetsService {
  private inited = false;
  private spreadSheet?: gapi.client.sheets.Spreadsheet;
  private readonly categoriesSheetTitle = 'categories';
  private readonly currentYearSheetTitle = new Date().getFullYear().toString();
  private infoLoadResolve: (value?: unknown) => void;
  private onInfoLoaded = new Promise(
    (resolve, reject) => (this.infoLoadResolve = resolve)
  );

  constructor(private storage: StorageService) {}

  public init(): void {
    const settings = this.storage.get(Settings);

    if (this.inited) return;

    if (!settings || !settings.sheetId) return;

    this.loadSpreadSheetInfo().then(this.initSpreadSheet);
  }

  private initSpreadSheet = (spreadSheet: gapi.client.sheets.Spreadsheet) => {
    let hasCategoriesSheet = false;
    let hasCurrentYearSheet = false;
    spreadSheet.sheets.forEach((sheet) => {
      hasCategoriesSheet =
        hasCategoriesSheet ||
        sheet.properties.title === this.categoriesSheetTitle;
      hasCurrentYearSheet =
        hasCurrentYearSheet ||
        sheet.properties.title === this.currentYearSheetTitle;
    });

    if (!hasCategoriesSheet) {
      //add Sheet `categories`
      this.addSheet(this.categoriesSheetTitle).then((x) =>
        console.log(`Sheet ${this.categoriesSheetTitle} added`, x)
      );
    }

    if (!hasCurrentYearSheet) {
      //add Sheet `currentYear`
      this.addSheet(this.currentYearSheetTitle).then((x) =>
        console.log(`Sheet ${this.currentYearSheetTitle} added`, x)
      );
    }
  };

  private addSheet(
    title: string
  ): Promise<
    gapi.client.Response<gapi.client.sheets.BatchUpdateSpreadsheetResponse>
  > {
    return gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadSheet.spreadsheetId,
      resource: { requests: [{ addSheet: { properties: { title } } }] },
    });
  }

  /**
   * get info about Spreadsheet Properties and created sheets
   */
  public loadSpreadSheetInfo(): Promise<gapi.client.sheets.Spreadsheet> {
    const settings = this.storage.get(Settings);

    return gapi.client.sheets.spreadsheets
      .get({ spreadsheetId: settings.sheetId })
      .then((response) => {
        if (response.result) {
          this.spreadSheet = response.result;
          this.inited = true;
        }
        this.infoLoadResolve();
        return Promise.resolve(response.result);
      });
  }

  public addCategory(id: number, name: string) {}

  public getCategories(): Promise<Category[]> {
    return this.onInfoLoaded
      .then(() =>
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: this.spreadSheet.spreadsheetId,
          valueRenderOption: 'UNFORMATTED_VALUE',
          range: `${this.categoriesSheetTitle}!A:B`,
        })
      )
      .then((response) => {
        let categories: Category[] = [];
        if (response.result.values)
          categories = response.result.values.map((value) => ({
            id: value[0],
            name: value[1],
          }));

        return categories;
      });
  }

  public addExpense() {
    gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: this.spreadSheet.spreadsheetId,
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'USER_ENTERED',
        range: '2020!A:D',
        resource: { values: [[new Date(), 'B123', 'C123', 'asd']] },
      })
      .then((x) => {
        console.log(x);
      });
  }
}
