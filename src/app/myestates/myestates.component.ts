import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {Observable, catchError, of, forkJoin, map} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estate } from '../data-types';
import { DialogEstateComponent } from '../dialogs/dialog-estate/dialog-estate.component';
import { DialogOkComponent } from '../dialogs/dialog-ok/dialog-ok.component';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';
import { ResetSession, UpdateSession } from '../store/actions/session.actions';
import { Session } from '../store/models/runtime';

@Component({
  selector: 'app-myestates',
  templateUrl: './myestates.component.html',
  styleUrls: ['./myestates.component.scss']
})
export class MyestatesComponent {
  estates$: Observable<Estate[]>;
  admin: boolean = false;
  loading: boolean = true;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient, private _dialog: MatDialog, private _translateService: TranslateService, private _snackbar: MatSnackBar, private _router: Router) {
    store.select('session').subscribe(session => {this.admin = session.admin});
    this.estates$ = _httpClient.get<Estate[]>(environment.endpoint + 'myestates')
    .pipe(catchError((err, caught) => {
      console.warn(err)
      const jwtSet = new Set(['jwt expired', 'invalid token', 'jwt malformed', 'jwt signature is required', 'invalid signature']);
      if (err.status === 0) {
        forkJoin([
          this._translateService.get('server.error.title'),
          this._translateService.get('server.error.content')
        ]).subscribe(text => {
          this._dialog.open(DialogOkComponent, {
            data: {
              title: text[0],
              content: text[1]
            }
          })
        })
      } else if(jwtSet.has(err.error.msg)) {
        forkJoin([
          this._translateService.get('server.error.session_expired'),
          this._translateService.get('server.error.login_again_content')
        ]).subscribe(text => {

          this._dialog.open(DialogOkComponent, {
            data: {
              title: text[0],
              content: text[1]
            }
          }).afterClosed().subscribe(() => {
            this.store.select('session').subscribe(session => {
              this.store.dispatch(new ResetSession());
              if (session.admin) {
                this._router.navigateByUrl('/login')
              } else {
                this._router.navigateByUrl('/loginworker')
              }
            })
          })
        })
        }
      this.loading = false;
      return []
    }));
  }


  refresh() {
    this.estates$ = this._httpClient.get<Estate[]>(environment.endpoint + 'myestates');
  }

  addTask(estateuuid: string) {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      data: {
        estateuuid,
        title: '',
        priority: 0,
        deadline: 0,
        description: '',
        open: false
      }
    });

    dialogRef.afterClosed().subscribe(dialogData => {
      if (!dialogData) return;
      const {title, priority, deadline, open, description} = dialogData
      this._httpClient.post(environment.endpoint + 'task/' + estateuuid, {title, priority, deadline, open, description}).subscribe(console.log);
    });
  }

  update(formData: Estate) {
    const dialogRef = this._dialog.open(DialogEstateComponent, {
      data: JSON.parse(JSON.stringify(formData))
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) return;
      this._httpClient.put(environment.endpoint + 'estate/' + data.estateuuid, data).subscribe(data => {
        forkJoin([
          this._translateService.get('snackbar.estate_updated'),
          this._translateService.get('snackbar.ok')
        ]).subscribe(text => {
          this._snackbar.open(text[0], text[1]);
        })
        this.refresh();
      });
    });
  }

  delete(estateuuid: string) {
    this._httpClient.delete(environment.endpoint + 'estate/' + estateuuid).subscribe(data => {
      forkJoin([
        this._translateService.get('snackbar.estate_deleted'),
        this._translateService.get('snackbar.ok')
      ]).subscribe(text => {
        this._snackbar.open(text[0], text[1]);
      })
      this.refresh();
    })
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
          this.refresh();
        })
    });
  }
}
