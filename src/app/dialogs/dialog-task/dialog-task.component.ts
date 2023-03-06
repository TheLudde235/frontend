import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Estate } from 'src/app/data-types';
import { Language, Session } from 'src/app/store/models/runtime';
import { environment } from 'src/environments/environment';

export interface DialogData {
  title: string;
  description: string;
  estateuuid: string;
  priority: number;
  deadline: Date;
  open: boolean;
};

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.scss']
})
export class DialogTaskComponent {
  estates$: Observable<Estate[]>;
  constructor(
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private _adapter: DateAdapter<any>,
    private store: Store<{lang: Language, session: Session}>,
    private _httpClient: HttpClient
  ) {
    store.select('lang').subscribe(r => {
      this._locale = r == 'sv' || r == 'eo' ? 'fr' : r;
      this._adapter.setLocale(r == 'sv' || r == 'eo' ? 'fr' : r);
    });
    this.estates$ = this._httpClient.get<Estate[]>(environment.endpoint + 'myestates');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
