import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adminconfirmation',
  templateUrl: './adminconfirmation.component.html',
  styleUrls: ['./adminconfirmation.component.scss']
})
export class AdminconfirmationComponent implements OnInit {

  constructor(private _httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  @Input() code = ''

  confirm() {
    const url = new URL(environment.endpoint + `confirmMail/${this.code}/`);
    url.searchParams.set('type', 'adminregister');
    this._httpClient.get(url.toString()).subscribe(console.log);
  }

}
