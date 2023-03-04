import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, withLatestFrom, zipWith } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Taxami';

  @ViewChild('drawer')
  public drawer!: MatDrawer;

  constructor (public _translate: TranslateService) {}
  



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
