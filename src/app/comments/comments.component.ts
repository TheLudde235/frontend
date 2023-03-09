import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../data-types';
import { Session } from '../store/models/runtime';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  comments: Comment[] = [];
  header: any;
  useruuid: string = '';
  admin: boolean = false;

  @Input() commentValue: string = '';

  constructor(private route: ActivatedRoute, private _httpClient: HttpClient, private _store: Store<{session: Session}>) {
    this.refresh();
    this._store.select('session').subscribe(session => {
      this.useruuid = session.uuid;
      this.admin = session.admin;
    })
  }

  refresh() {
    this.route.params.subscribe((params) => {
      this._httpClient
        .get<{ comments: Comment[] }>(
          environment.endpoint + 'comments/' + params['taskuuid']
        )
        .subscribe((c) => {
          this.header = c.comments.shift();
          this.comments = c.comments;
        });
    });
  }

  submitFunction($event: KeyboardEvent) {
    if ($event.code == 'Enter') {
      this.sendComment();
    }
  }

  sendComment() {
    this.route.params.subscribe((params) => {
      this._httpClient
        .post(environment.endpoint + 'comment/' + params['taskuuid'], {
          text: this.commentValue,
        })
        .subscribe(() => {
          this.refresh();
          this.commentValue = '';
        });
    });
  }

  delete(commentuuid: string) {
    this._httpClient
      .delete(environment.endpoint + 'comment/' + commentuuid)
      .subscribe(() => {
        this.refresh();
      });
  }
}
