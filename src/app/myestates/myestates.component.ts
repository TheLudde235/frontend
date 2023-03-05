import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {Observable, catchError, of} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estate } from '../data-types';
import { UpdateSession } from '../store/actions/session.actions';
import { Session } from '../store/models/runtime';

@Component({
  selector: 'app-myestates',
  templateUrl: './myestates.component.html',
  styleUrls: ['./myestates.component.scss']
})
export class MyestatesComponent {
  session$: Observable<Session>;
  loading: boolean = false;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient) {
    this.session$ = store.select('session');
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
}
