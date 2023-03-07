import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective, NgForm, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { DialogOkComponent } from '../dialogs/dialog-ok/dialog-ok.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public _httpClient: HttpClient, private _translateService: TranslateService, private _dialog: MatDialog, private _router: Router) { }

  ngOnInit(): void {
  }

  usernameColor: ThemePalette = 'primary';

  loading: boolean = false;


  @Input() usernameValue = '';
  @Input() emailValue = '';
  
  usernameUnique: boolean = false;
  emailUnique: boolean = false;
  
  esMatcher = new RegisterErrorStateMatcher();

  usernameFormControl = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]);
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]);

  password1FormControl = new FormControl('', [Validators.required]);
  password2FormControl = new FormControl('', [Validators.required]);
  
  passwordConfirmed: boolean = false;

  @Input() password1 = '';
  @Input() password2 = '';

  usernameTimer: NodeJS.Timeout | undefined;
  validateUsername() {
    const url: URL = new URL(environment.endpoint + 'adminregistered?');
    const params: URLSearchParams = new URLSearchParams(url.search);
    params.set('username', this.usernameValue);

    this.usernameUnique = false;

    clearTimeout(this.usernameTimer);
    this.usernameTimer = setTimeout(() => {
      this._httpClient.get<any>(url + params.toString()).pipe(
        catchError((err, caught) => {
          return err ? err.message : caught;
        })
      ).subscribe(r => {
        if (r.msg){
          return this.usernameFormControl.setErrors({notUnique: true})
        }
        this.usernameUnique = true;
      })
    }, 1500)
  }

  emailTimer: NodeJS.Timeout | undefined;
  validateEmail(): void {
    const url: URL = new URL(environment.endpoint + 'adminregistered?');
    const params: URLSearchParams = new URLSearchParams(url.search);
    params.set('email', this.emailValue);

    this.emailUnique = false;

    clearTimeout(this.emailTimer);
    this.emailTimer = setTimeout(() => {
      this._httpClient.get<any>(url + params.toString()).pipe(
        catchError((err, caught) => {
          return err ? err.message : caught;
        })
      ).subscribe(r => {
        if (r.msg){
          return this.emailFormControl.setErrors({notUnique: true})
        }
        this.emailUnique = true;
      })
    }, 1500)
  }

  validateConfirmationPassword(): void {    
    if (this.password1 == this.password2) {
      this.passwordConfirmed = true;
      this.password2FormControl.setErrors(null);
    } else {
      if (this.password1 != this.password2) {
        this.passwordConfirmed = false;
        this.password2FormControl.setErrors({...this.password2FormControl.errors, different: true})
      }
    }
  }

  formIsDone() {
    return Object.keys({...this.usernameFormControl.errors, ...this.emailFormControl.errors, ...this.password1FormControl.errors, ...this.password2FormControl.errors}).length < 1;
  }

  register(): void {
    this.loading = true;
    const url = new URL(environment.endpoint + 'register');
    this._httpClient.post(url.toString(), {
      username: this.usernameValue,
      password: this.password1,
      email: this.emailValue
    }).pipe(
      catchError((err, caught) => {
         if (err.status == 0) {
          const dialogContent = forkJoin([
            this._translateService.get('server.error.title'),
            this._translateService.get('server.error.content')
          ]).subscribe(text => {
            this.openDialog(text[0], text[1]);
          });
        } else if (err.error) {
            this.openDialog('Login Failed', err.error.msg);
        }
        return of(err) ?? caught;
      })
    )
    .subscribe(() => {
      this.loading = false;
      this._router.navigateByUrl('/confirmation/adminregister')
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

export class RegisterErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
