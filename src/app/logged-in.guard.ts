import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Session } from './store/models/runtime';

@Injectable({
  providedIn: 'root'
})
export class WorkerGuard implements CanActivate {
  loggedIn: boolean = false;
  admin: boolean = true;

  constructor(private _store: Store<{session: Session}>) {
    _store.select('session').subscribe(r =>{
      this.loggedIn = r.loggedIn;
      this.admin = r.admin;
    });
  };

  canActivate() {
    if (this.loggedIn && !this.admin) { 
      return true;
    } else {
      return false;
    }
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate{
  loggedIn: boolean = false;
  admin: boolean = false;
  constructor(private _store: Store<{session: Session}>, private _router: Router) {
    _store.select('session').subscribe(r => {
      this.loggedIn = r.loggedIn;
      this.admin = r.admin;
    })
  }

  canActivate() {
    if (this.loggedIn && this.admin) {
      return true;
    } else {
      this._router.navigateByUrl('/login');
      return false;
    }
  }
}