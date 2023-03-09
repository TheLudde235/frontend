import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estate } from '../data-types';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent {
  invites$: Observable<{confirmationcode: string, information: string, estate?: Estate}[]>
  constructor(private _httpClient: HttpClient, private _router: Router) {
    this.invites$ = this._httpClient.get<{confirmationcode: string, information: string, estate?: Estate}[]>(environment.endpoint + 'myinvites').pipe(
      map(invites => {
        invites.forEach(invite => {
          this._httpClient.get<{estate: Estate}>(environment.endpoint + 'estate/' + invite.information).subscribe(estate => {
            invite.estate = estate.estate;
          })
        })
        return invites;
      })
    );
  }

  accept(confirmationcode: string, estateuuid: string): void {
    this._httpClient.get(environment.endpoint + 'confirmMail/' + confirmationcode +'?type=acceptinvite').subscribe(() => this._router.navigateByUrl('/estate/' + estateuuid));
  }
}
