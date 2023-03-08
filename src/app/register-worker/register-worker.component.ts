import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Worker } from '../data-types';
import { RegisterErrorStateMatcher } from '../register/register.component';

@Component({
  selector: 'app-register-worker',
  templateUrl: './register-worker.component.html',
  styleUrls: ['./register-worker.component.scss']
})
export class RegisterWorkerComponent {
  worker: Worker = {firstname: '', lastname: '', phone: '', email: ''};

  emailUnique: boolean = false;

  constructor(private _httpClient: HttpClient, private _router: Router) {}

  esMatcher = new RegisterErrorStateMatcher()

  emailFormControl = new FormControl('', [Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]);

  emailTimer: NodeJS.Timeout | undefined;
  validateEmail(): void {
    const url: URL = new URL(environment.endpoint + 'workerregistered?');
    const params: URLSearchParams = new URLSearchParams(url.search);
    params.set('email', this.worker.email);

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
  formIsDone() {
    return Object.keys({...this.emailFormControl.errors}).length < 1;
  }
  register() {
    this._httpClient.post(environment.endpoint + 'worker', this.worker).subscribe(() => this._router.navigateByUrl('/confirmation/worker'))
  }
}
