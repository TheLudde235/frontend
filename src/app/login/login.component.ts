import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { DialogOkComponent } from '../dialogs/dialog-ok/dialog-ok.component';
import { SetSession } from '../store/actions/session.actions';
import { Token } from '../data-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public _httpClient: HttpClient, public _dialog: MatDialog, public _translateService: TranslateService, private store: Store, private _authService: AuthService, private _router: Router) { }

  ngOnInit(): void {
  }

  usernameValue: string = 'Terry';
  passwordValue: string = 'Davis';

  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]);
  passwordFormControl = new FormControl('', [Validators.required]);

  esMatcher = new LoginErrorStateMatcher();

  loading = false;

  login(): void {
    this.loading = true;
    this._authService.adminLogin(this.usernameValue, this.passwordValue).pipe(catchError((err, caught) => {
      this.loading = false;
      return of(err) ?? caught
    })).subscribe((data) => {
      this.loading = false;
      if (data && data.err) {
        if (data.status === 0) {
          console.log(data);
          forkJoin([
            this._translateService.get('server.error.title'),
            this._translateService.get('server.error.content')
          ]).subscribe(text => {
            return this.openDialog(text[0], text[1])
          })
        }
        forkJoin([
          this._translateService.get('server.error.failed_login'),
          this._translateService.get(data.message)
        ]).subscribe(text => {
          return this.openDialog(text[0], text[1]);
        })

      }
      this._router.navigateByUrl('/mypages');
    })
  }

  openDialog(title: string, content: string): void {
    this._dialog.open(DialogOkComponent, {
      width: '250px',
      data: {
        title,
        content
      }
    })
  }
}

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}