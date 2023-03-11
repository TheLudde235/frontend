import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { JWTService } from '../services/jwt.service';
import { SetSession } from '../store/actions/session.actions';
import { initialState } from '../store/reducers/session.reducer';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  loading: boolean = false;
  type: string = '';
  constructor(
    private _httpClient: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
    });
  }

  @Input() code = '';

  confirm() {
    if (this.type !== 'worker') {
      const url = new URL(
        environment.endpoint + `confirmMail/${this.code}?type=${this.type}`
      );
      this._httpClient.get<any>(url.toString()).subscribe((data) => {
        if (data) {
          this._router.navigateByUrl('/');
          this._authService.tokenLogin(data.token);
        }
      });
    } else {
      this._httpClient
        .get<any>(environment.endpoint + 'confirmMail/' + this.code)
        .subscribe((data) => {
          if (data) this._router.navigateByUrl('/');
          this._authService.tokenLogin(data.token);
        });
    }
  }
}
