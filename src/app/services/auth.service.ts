import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { ResetSession, SetSession } from '../store/actions/session.actions';
import { Session } from '../store/models/runtime';
import { catchError, of, Observable, map } from 'rxjs';
import { JWTService } from './jwt.service';
import { initialState } from '../store/reducers/session.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined;
  private expTimer: number | undefined;

  constructor(private store: Store<{session: Session}>, private _httpClient: HttpClient, private _jwtService: JWTService) {
    store.select('session').subscribe(s => this.token = s.token)
  }

  getToken = () => this.token;

  public adminLogin(username: string, password: string): Observable<any> { 
      return this._httpClient.post<any>(environment.endpoint + 'login', {
        username,
        password
      }).pipe(
        catchError((err, caught) => {
          return of(err) ?? caught
        }),
        map(data => {
          if (data.ok !== undefined && data.ok === false) return {err: true, status: data.status, message: data.error.msg};
          return this.store.dispatch(new SetSession({...initialState, ...this._jwtService.getData(data.token), loggedIn: true, token: data.token}));
        })
      )
  }

  public logout() {
    this.store.dispatch(new ResetSession());
  }
}
