import { Component } from '@angular/core';
import { Session } from '../store/models/runtime';
import { Observable, catchError, of } from 'rxjs'
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Estate } from '../data-types';
import { UpdateSession } from '../store/actions/session.actions';
import { MatDialog } from '@angular/material/dialog';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';

@Component({
  selector: 'app-mypages',
  templateUrl: './mypages.component.html',
  styleUrls: ['./mypages.component.scss']
})
export class MypagesComponent {
  session$: Observable<Session>
  loading: boolean = false;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient, public _dialog: MatDialog) {
    this.session$ = store.select('session');
  }

  openAddTaskDialog() {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      data: {
        title: '',
        estateuuid: '',
        priority: 0,
        deadline: 0,
        open: true
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        res.deadline != 0 ? res.deadline = res.deadline.toISOString() : '';
        const {title, priority, deadline, open, description} = res;
        this._httpClient.post(environment.endpoint + 'task/' + res.estateuuid, {
          title,
          priority,
          deadline,
          description,
          open
        }).subscribe(console.log)
      }
    })
  }

}
