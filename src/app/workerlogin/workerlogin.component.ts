import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { DialogOkComponent } from '../dialogs/dialog-ok/dialog-ok.component';
import { forkJoin, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-workerlogin',
  templateUrl: './workerlogin.component.html',
  styleUrls: ['./workerlogin.component.scss'],
})
export class WorkerloginComponent {
  @Input() emailValue = '';

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _dialog: MatDialog,
    private _translateService: TranslateService,
    private _authService: AuthService
  ) {}

  resend() {
    this._httpClient
      .get(environment.endpoint + 'resendConfirmation/' + this.emailValue + '?type=login')
      .subscribe((data) => {
        if (!data) return;
        this._router.navigateByUrl('/confirmation/login');
      });
  }

  login() {
    this._httpClient
      .get<{ token: string }>(
        environment.endpoint + 'workerlogin/' + this.emailValue
      )
      .pipe(
        catchError((err, caught) => {
            forkJoin([
              this._translateService.get(err.error.msg.title),
              this._translateService.get(err.error.msg.content, {
                email: this.emailValue,
              }),
            ]).subscribe((text) => {
              this._dialog.open(DialogOkComponent, {
                data: {
                  title: text[0],
                  content: text[1],
                },
              });
            });
            return of(err ?? caught);
        })
      ).subscribe(data => {
        if (data.msg) {
          this._router.navigateByUrl('/confirmation/login')
        }
      })
  }
}
