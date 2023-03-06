import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {Observable, catchError, of} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estate } from '../data-types';
import { DialogEstateComponent } from '../dialogs/dialog-estate/dialog-estate.component';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';
import { UpdateSession } from '../store/actions/session.actions';
import { Session } from '../store/models/runtime';

@Component({
  selector: 'app-myestates',
  templateUrl: './myestates.component.html',
  styleUrls: ['./myestates.component.scss']
})
export class MyestatesComponent {
  estates$: Observable<Estate[]>;
  loading: boolean = false;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient, public dialog: MatDialog) {
    this.estates$ = _httpClient.get<Estate[]>(environment.endpoint + 'myestates');
  }


  refresh() {
    this.loading = true;
    this._httpClient.get<Estate[]>(environment.endpoint + 'myestates')
      .pipe(
        catchError((err, caught) => {
          return of(err) ?? caught;
        })
      ).subscribe(r =>{
        this.loading = false;
        this.store.dispatch(new UpdateSession({estates: r}));
      });
  }

  addTask(estateuuid: string) {
    const dialogRef = this.dialog.open(DialogTaskComponent, {
      data: {
        title: '',
        priority: 0,
        deadline: 0,
        description: '',
        open: false
      }
    });

    dialogRef.afterClosed().subscribe(dialogData => {
      this._httpClient.post(environment.endpoint + 'task/' + estateuuid, dialogData).subscribe(console.log);
    });
  }

  update(data: Estate) {
    const dialogRef = this.dialog.open(DialogEstateComponent, {
      data: JSON.parse(JSON.stringify(data))
    });

    dialogRef.afterClosed().subscribe(data => {
      this._httpClient.put(environment.endpoint + 'estate/' + data.estateuuid, data).subscribe(console.log);
    });
  }

  delete(estateuuid: string) {

  }
}
