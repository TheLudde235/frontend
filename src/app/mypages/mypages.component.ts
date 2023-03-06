import { Component } from '@angular/core';
import { Session } from '../store/models/runtime';
import { Observable, catchError, of, forkJoin } from 'rxjs'
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UpdateSession } from '../store/actions/session.actions';
import { MatDialog } from '@angular/material/dialog';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';
import { DialogEstateComponent } from '../dialogs/dialog-estate/dialog-estate.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mypages',
  templateUrl: './mypages.component.html',
  styleUrls: ['./mypages.component.scss']
})
export class MypagesComponent {
  session$: Observable<Session>
  loading: boolean = false;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient, public _dialog: MatDialog, private _snackbar: MatSnackBar, private _translateService: TranslateService) {
    this.session$ = store.select('session');
  }

  openEstateDialog() {
    const dialogRef = this._dialog.open(DialogEstateComponent, {
      data: {
        city: '',
        street: '',
        streetnumber: '',
        description: ''
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      const {city, street, streetnumber,description} = res;
      this._httpClient.post(environment.endpoint + 'registerestate', res).subscribe()
        forkJoin([
          this._translateService.get('snackbar.estate_added'),
          this._translateService.get('snackbar.ok')
        ]).subscribe(text => {
          this._snackbar.open(text[0], text[1], {
            duration: 5000
          });
        })
    });
  }

  openAddTaskDialog() {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      data: {
        title: '',
        estateuuid: '',
        priority: 0,
        deadline: 0,
        open: false
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      res.deadline != 0 ? res.deadline = res.deadline.toISOString() : '';
      const {title, priority, deadline, open, description} = res;
      this._httpClient.post(environment.endpoint + 'task/' + res.estateuuid, {
        title,
        priority,
        deadline,
        description,
        open
      }).subscribe(res => {
        forkJoin([
          this._translateService.get('snackbar.task_added'),
          this._translateService.get('snackbar.ok')
        ]).subscribe(text => {
          this._snackbar.open(text[0], text[1], {
            duration: 5000
          });
        })
      })
    })
  }

}
