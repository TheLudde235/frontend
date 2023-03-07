import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    private _router: Router
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
      this._httpClient.get(url.toString()).subscribe((data) => {
        if (data) this._router.navigateByUrl('/');
      });
    } else {
      this._httpClient
        .get(environment.endpoint + 'confirmMail/' + this.code)
        .subscribe((data) => {
          if (data) this._router.navigateByUrl('/');
        });
    }
  }
}
