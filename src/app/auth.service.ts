import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Session } from './store/models/runtime';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | undefined;

  constructor(private store: Store<{session: Session}>) {
    store.select('session').subscribe(s => this.token = s.token)
  }

  getToken() {
    return this.token;
  }
}
