import { Component, OnInit } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { SecurityService } from 'security';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private spreadSheet?: gapi.client.sheets.Spreadsheet;

  constructor() {}

  ngOnInit(): void {}

  loadSpreadSheetInfo(): Observable<gapi.client.sheets.Spreadsheet> {
    // const settings = this.storage.get(Settings);
    const settings = {
      sheetId: '1OOZYbzpNwdiR0u-9_4biglDWOH67Crrd64EPDmA7UZY',
    };

    return from(
      gapi.client.sheets.spreadsheets.get({ spreadsheetId: settings.sheetId })
    ).pipe(map((response) => response.result));
  }

  test() {
    this.loadSpreadSheetInfo().subscribe(console.log);
  }
}
