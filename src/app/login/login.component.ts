import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogOkComponent } from '../dialogs/dialog-ok/dialog-ok.component';
import { SetSession } from '../store/actions/session.actions';
import { Token } from '../token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public _httpClient: HttpClient, public _dialog: MatDialog, public _translateService: TranslateService, private store: Store) { }

  ngOnInit(): void {
  }

  usernameValue: string = '';
  passwordValue: string = '';

  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]);
  passwordFormControl = new FormControl('', [Validators.required]);

  esMatcher = new LoginErrorStateMatcher();

  loading = false;

  login(): void {
    this.loading = true;
    this._httpClient.post<any>(environment.endpoint + 'login', {
      username: this.usernameValue,
      password: this.passwordValue
    }).pipe(
      catchError((err, caught) => {
        if (err.status == 0) {
          forkJoin([
            this._translateService.get('errors.dialog.server.title'),
            this._translateService.get('errors.dialog.server.content')
          ]).subscribe(text => {
            this.openDialog(text[0], text[1]);
          });
        } else if (err.error) {
          forkJoin([
            this._translateService.get('errors.dialog.failed_login'),
            this._translateService.get(err.error.msg)
          ]).subscribe(text =>{
            this.openDialog(text[0], text[1]);
          })
        }
        return of(err) ?? caught;
      })
    ).subscribe(r => {
      this.loading = false;
      const user: Token = JSON.parse(atob(r.token.split('.')[1]));
      console.log(user)
      this.store.dispatch(new SetSession({
        ...user,
        token: r.token,
        loggedIn: true
      }))
      location.href = '/mypages'
    });
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