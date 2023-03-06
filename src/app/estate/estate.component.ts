import { HttpClient } from '@angular/common/http';
import { CssSelector } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';
import { PriorityColors } from 'src/assets/colors';
import { environment } from 'src/environments/environment';
import { Estate, Priority, Task } from '../data-types';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm/dialog-confirm.component';
import { DialogEstateComponent } from '../dialogs/dialog-estate/dialog-estate.component';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';
import { Session } from '../store/models/runtime';

interface EstateData {
  estate: Estate;
  tasks: Task[];
  workers: Worker[];
}


@Component({
  selector: 'app-estate',
  templateUrl: './estate.component.html',
  styleUrls: ['./estate.component.scss'],
})
export class EstateComponent implements OnInit {
  loading: boolean = false;
  data$: Observable<EstateData> | undefined;
  prioritySort: boolean = true;
  isAdmin$: Observable<boolean>;
  reversed = false;
  
  constructor(
    private route: ActivatedRoute,
    private _httpClient: HttpClient,
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private _translateService: TranslateService,
    private _router: Router,
    private store: Store<{ session: Session }>
    ) {
      this.isAdmin$ = store
      .select('session')
      .pipe(map((session) => session.admin));
    }
    
    PriorityEnum = {
      0: 'priority.none',
      32: 'priority.neutral',
      64: 'priority.very_low',
      96: 'priority.low',
      128: 'priority.medium',
      160: 'priority.high',
      192: 'priority.very_high',
      224: 'priority.asap',
      256: 'priority.past',
    }
    
    ngOnInit() {
      this.refresh();
    }
    
    sortFunctions = {
      priority: (a: Task, b: Task) => {
      if (a.completed && b.completed) return 0;
      if (b.completed) return -1;
      if (a.completed) return 1;
      return b.priority - a.priority;
    },
    deadline: (a: Task, b: Task) => {
      if (a.deadline == null && b.deadline == null) return 0;
      if (a.deadline == null) return 1;
      if (b.deadline == null) return -1;
      return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;
    },
  };

  sortFn = this.sortFunctions.priority;

  previousSort = !this.prioritySort;

  sort(click: boolean) {
    this.sortFn = this.prioritySort
      ? this.sortFunctions.priority
      : this.sortFunctions.deadline;
    if (this.previousSort == this.prioritySort && click) {
      this.reversed = !this.reversed;
    } else {
      this.reversed = false;
    }
    this.previousSort = this.prioritySort;
    this.data$ = this.data$?.pipe(
      map((estateData) => {
        if (this.reversed) {
          estateData.tasks.sort(this.sortFn).reverse();
        } else {
          estateData.tasks.sort(this.sortFn);
        }
        return estateData;
      })
    );
  }

  refresh() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      this.loading = false;
      this.data$ = this._httpClient.get<EstateData>(
        environment.endpoint + 'estate/' + params['estateuuid']
      )
      this.sort(false);
    });
  }

  addTask(estateuuid: string) {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      data: {
        estateuuid,
        title: '',
        priority: 0,
        deadline: 0,
        description: '',
        open: false,
      },
    });

    dialogRef.afterClosed().subscribe((dialogData) => {
      if (!dialogData) return;
      const { title, priority, deadline, open, description } = dialogData;
      this._httpClient
        .post(environment.endpoint + 'task/' + estateuuid, {
          title,
          priority,
          deadline,
          open,
          description,
        })
        .subscribe((data) => {
          forkJoin([
            this._translateService.get('snackbar.task_added'),
            this._translateService.get('snackbar.ok'),
          ]).subscribe((text) => {
            this._snackbar.open(text[0], text[1], { duration: 3000 });
            this.refresh();
          });
        });
    });
  }

  update(formData: Estate) {
    const dialogRef = this._dialog.open(DialogEstateComponent, {
      data: JSON.parse(JSON.stringify(formData)),
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.loading = true;
      this._httpClient
        .put(environment.endpoint + 'estate/' + data.estateuuid, data)
        .subscribe((data) => {
          forkJoin([
            this._translateService.get('snackbar.estate_updated'),
            this._translateService.get('snackbar.ok'),
          ]).subscribe((text) => {
            this._snackbar.open(text[0], text[1], { duration: 3000 });
          });
          this.refresh();
        });
    });
  }

  delete(estateuuid: string) {
    this._httpClient
      .delete(environment.endpoint + 'estate/' + estateuuid)
      .subscribe((data) => {
        forkJoin([
          this._translateService.get('snackbar.estate_deleted'),
          this._translateService.get('snackbar.ok'),
        ]).subscribe((text) => {
          this._snackbar.open(text[0], text[1], { duration: 3000 });
          this._router.navigateByUrl('/mypages');
        });
      });
  }
  date(isoDate: string) {
    return new Date(isoDate).toLocaleDateString();
  }
  getColor(priority: Priority) {
    return PriorityColors[priority];
  }
  getPriority(priority: Priority) {
    return this.PriorityEnum[priority];
  }

  toggleDone(task: Task) {
    const { completed, taskuuid } = task;

    forkJoin([
      this._translateService.get(
        completed ? 'dialog.confirm.mark_not_done' : 'dialog.confirm.mark_done'
      ),
      this._translateService.get(
        completed
          ? 'dialog.confirm.mark_done_desc'
          : 'dialog.confirm.mark_not_done_desc'
      ),
    ]).subscribe((text) => {
      const dialogRef = this._dialog.open(DialogConfirmComponent, {data: {title: text[0], content: text[1]}});
      dialogRef.afterClosed().subscribe(confirmed => {
        if (!confirmed) return;

        this._httpClient.put(environment.endpoint + 'task/' + taskuuid, {
          completed: !completed
        }).subscribe(() => this.refresh())
      })
    });
  }
}
