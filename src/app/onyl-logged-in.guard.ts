import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Session } from './store/models/runtime';

@Injectable({
  providedIn: 'root'
})
export class OnylLoggedInGuard implements CanActivate {
  loggedIn: boolean = false;
  constructor(private _store: Store<{session: Session}>) {
    _store.select('session').subscribe(r => this.loggedIn = r.loggedIn);
  };

  canActivate() {
    if (this.loggedIn) { 
      return true;
    } else {
      window.alert("You don't have permission to view this page");
      return false;
    }
  }
  
}
