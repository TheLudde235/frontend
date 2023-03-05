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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Taxami';

  @ViewChild('drawer')
  public drawer!: MatDrawer;
  public loggedIn: boolean = false;
  public session: Session | undefined;

  constructor (private _translate: TranslateService, private store: Store<{lang: string, session: Session}>, private _dialog: MatDialog) {
    store.select('lang').subscribe(data => {
      _translate.use(data);
    });
    store.select('session').subscribe(data => {
      this.loggedIn = data.loggedIn;
      this.session = data;
    })
  }
  
  openDialog() {
    this._dialog.open(DialogOkComponent, {
      data: {
        title: 'Data',
        content: this.session
      }
    })
  }

  changeLanguage(lang: Language) {
    this.store.dispatch(new Set(lang));
  }

  logout( ){
    this.store.dispatch(new ResetSession());
  }
  ngAfterViewInit(): void {
  fromEvent<TouchEvent>(document, 'touchstart')
    .pipe(
      zipWith(
        fromEvent<TouchEvent>(document, 'touchend').pipe(
          withLatestFrom(fromEvent<TouchEvent>(document, 'touchmove'))
        )
      )
    ).subscribe(([touchstart, [_, touchmove]]) => {
      const xDiff = touchstart.touches[0].clientX - touchmove.touches[0].clientX;
      if (Math.abs(xDiff) > 0.2 * document.body.clientWidth &&
          touchstart.timeStamp <= touchmove.timeStamp) {
        if (xDiff > 0) {
          this.drawer.close();
        } else {
          this.drawer.open();   
        }
      }
    });
}
}
