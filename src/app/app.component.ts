import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, withLatestFrom, zipWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { Set } from './store/actions/i18n.actions';
import { ResetSession } from './store/actions/session.actions';
import { Language, Session } from './store/models/runtime';
import { DialogOkComponent } from './dialogs/dialog-ok/dialog-ok.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Taxami';

  @ViewChild('drawer')
  public drawer!: MatDrawer;
  public loggedIn: boolean = false;
  public admin: boolean = false;

  constructor(
    private _translate: TranslateService,
    private store: Store<{ lang: string; session: Session }>,
    private _dialog: MatDialog,
    private _authService: AuthService,
    private _router: Router
  ) {
    store.select('lang').subscribe((data) => {
      _translate.use(data);
    });
    store.select('session').subscribe((data) => {
      this.loggedIn = data.loggedIn;
      this.admin = data.admin;
    });
  }

  changeLanguage(lang: Language) {
    this.store.dispatch(new Set(lang));
  }

  logout() {
    this._authService.logout();
    this._router.navigateByUrl('/');
  }

  ngAfterViewInit(): void {
    fromEvent<TouchEvent>(document, 'touchstart')
      .pipe(
        zipWith(
          fromEvent<TouchEvent>(document, 'touchend').pipe(
            withLatestFrom(fromEvent<TouchEvent>(document, 'touchmove'))
          )
        )
      )
      .subscribe(([touchstart, [_, touchmove]]) => {
        const xDiff =
          touchstart.touches[0].clientX - touchmove.touches[0].clientX;
        if (
          Math.abs(xDiff) > 0.2 * document.body.clientWidth &&
          touchstart.timeStamp <= touchmove.timeStamp &&
          Math.abs(touchmove.timeStamp - touchstart.timeStamp) < 500
        ) {
          if (xDiff > 0) {
            this.drawer.close();
          } else {
            this.drawer.open();
          }
        }
      });
  }
}
