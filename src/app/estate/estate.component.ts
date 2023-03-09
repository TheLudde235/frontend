import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, map, Observable, of, catchError } from 'rxjs';
import { PriorityColors } from '../colors';
import { environment } from 'src/environments/environment';
import { Estate, Priority, Task } from '../data-types';
import { DialogConfirmComponent } from '../dialogs/dialog-confirm/dialog-confirm.component';
import { DialogEstateComponent } from '../dialogs/dialog-estate/dialog-estate.component';
import { DialogTaskComponent } from '../dialogs/dialog-task/dialog-task.component';
import { Session } from '../store/models/runtime';
import { DialogAddWorkerComponent } from '../dialogs/dialog-add-worker/dialog-add-worker.component';
import { DialogTakeTaskComponent } from '../dialogs/dialog-take-task/dialog-take-task.component';

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
  isAdmin: boolean = false;
  useruuid: string = '';
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
    store.select('session').subscribe((session) => {
      console.log(session);
      this.isAdmin = session.admin;
      this.useruuid = session.uuid;
    });
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
  };

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
    priorityReverse: (a: Task, b: Task) => {
      if (a.completed && b.completed) return 0;
      if (b.completed) return -1;
      if (a.completed) return 1;

      return a.priority - b.priority;
    },
    deadline: (a: Task, b: Task) => {
      if (b.completed) return -1;
      if (a.completed) return 1;
      if (a.deadline == null && b.deadline == null)
        return this.sortFunctions.priority(a, b);
      if (a.deadline == null) return 1;
      if (b.deadline == null) return -1;

      return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;
    },
    deadlineReverse: (a: Task, b: Task) => {
      if (b.completed) return -1;
      if (a.completed) return 1;
      if (a.deadline == null && b.deadline == null)
        return this.sortFunctions.priorityReverse(a, b);
      if (a.deadline == null) return 1;
      if (b.deadline == null) return -1;

      return a.deadline < b.deadline ? 1 : a.deadline > b.deadline ? -1 : 0;
    },
  };

  getFunction(priority: boolean, reverse: boolean) {
    if (!reverse) {
      return priority
        ? this.sortFunctions.priority
        : this.sortFunctions.deadline;
    }
    return priority
      ? this.sortFunctions.priorityReverse
      : this.sortFunctions.deadlineReverse;
  }

  previousSort = !this.prioritySort;

  sort(click: boolean) {
    if (this.previousSort == this.prioritySort && click) {
      this.reversed = !this.reversed;
    } else {
      this.reversed = false;
    }
    this.previousSort = this.prioritySort;
    this.data$ = this.data$?.pipe(
      map((estateData) => {
        if (this.reversed) {
          estateData.tasks.sort(
            this.getFunction(this.prioritySort, this.reversed)
          );
        } else {
          estateData.tasks.sort(
            this.getFunction(this.prioritySort, this.reversed)
          );
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
      );
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

  updateEstate(formData: Estate) {
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

  deleteEstate(estateuuid: string) {
    forkJoin([
      this._translateService.get('dialog.title.are_you_sure'),
      this._translateService.get('dialog.confirm.delete_estate'),
    ]).subscribe((text) => {
      const dialogRef = this._dialog.open(DialogConfirmComponent, {
        data: { title: text[0], content: text[1], color: 'warn' },
      });
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (!confirmed) return;

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
      });
    });
  }

  deleteTask(taskuuid: string) {
    forkJoin([
      this._translateService.get('dialog.title.are_you_sure'),
      this._translateService.get('dialog.confirm.delete_task'),
    ]).subscribe((text) => {
      const dialogRef = this._dialog.open(DialogConfirmComponent, {
        data: { title: text[0], content: text[1], color: 'warn' },
      });
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (!confirmed) return;

        this._httpClient
          .delete(environment.endpoint + 'task/' + taskuuid)
          .subscribe((data) => {
            forkJoin([
              this._translateService.get('snackbar.task_deleted'),
              this._translateService.get('snackbar.ok'),
            ]).subscribe((text) => {
              this._snackbar.open(text[0], text[1], { duration: 3000 });
              this.refresh();
            });
          });
      });
    });
  }

  transferTask(task: Task) {
    this.route.params.subscribe((params) => {
      this._httpClient
        .get<string[]>(environment.endpoint + 'workers/' + params['estateuuid'])
        .subscribe((workers) => {
          this._dialog
            .open(DialogAddWorkerComponent, {
              data: {
                workers,
                action: 'dialog.worker.transfer',
              },
            })
            .afterClosed()
            .subscribe((worker) => {
              this._httpClient
                .put(environment.endpoint + 'task/' + task.taskuuid, {
                  taskmaster: worker,
                })
                .subscribe(() => {
                  forkJoin([
                    this._translateService.get('snackbar.taskmaster_changed'),
                    this._translateService.get('snackbar.ok'),
                  ]).subscribe((text) => {
                    this._snackbar.open(text[0], text[1]);
                  });
                });
            });
        });
    });
  }

  updateTask(task: Task) {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      data: JSON.parse(JSON.stringify(task)),
    });

    dialogRef.afterClosed().subscribe((dialogData) => {
      if (!dialogData) return;
      const { title, priority, deadline, open, description } = dialogData;
      this._httpClient
        .put(environment.endpoint + 'task/' + task.taskuuid, {
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

  date(isoDate: string) {
    if (isoDate == null) {
      return this._translateService.get('deadline.none');
    }
    return of(new Date(isoDate).toLocaleDateString());
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
      const dialogRef = this._dialog.open(DialogConfirmComponent, {
        data: { title: text[0], content: text[1] },
      });
      dialogRef.afterClosed().subscribe((confirmed) => {
        if (!confirmed) return;

        this._httpClient
          .put(environment.endpoint + 'task/' + taskuuid, {
            completed: !completed,
          })
          .subscribe(() => this.refresh());
      });
    });
  }

  openWorkerDialog() {
    this._httpClient
      .get<Worker[]>(environment.endpoint + 'workers')
      .subscribe((workers) => {
        console.warn(workers);
        this.data$?.subscribe((d) => {
          this._dialog
            .open(DialogAddWorkerComponent, {
              data: { workers, action: 'dialog.add' },
            })
            .afterClosed()
            .subscribe((worker) => {
              this._httpClient
                .post(
                  environment.endpoint + 'addworker/' + d.estate.estateuuid,
                  { worker }
                )
                .pipe(
                  catchError((err, caugth) => {
                    forkJoin([
                      this._translateService.get(err.error.msg),
                      this._translateService.get('snackbar.ok'),
                    ]).subscribe((text) => {
                      this._snackbar.open(text[0], text[1], { duration: 3000 });
                    });
                    return of(err ?? caugth);
                  })
                )
                .subscribe((data) => {
                  if (data && !data.ok) return;
                  forkJoin([
                    this._translateService.get('snackbar.worker_invited'),
                    this._translateService.get('snackbar.ok'),
                  ]).subscribe((text) => {
                    this._snackbar.open(text[0], text[1], { duration: 3000 });
                  });
                });
            });
        });
      });
  }

  takeTask(taskuuid: string) {
    this._dialog
      .open(DialogTakeTaskComponent, {
        data: {
          time: '',
          cost: 0,
          comment: '',
        },
      })
      .afterClosed()
      .subscribe((data) => {
        if (!data) return;
        this._httpClient
          .post(environment.endpoint + 'taketask/' + taskuuid, {
            taskmaster: this.useruuid,
          })
          .subscribe((res) => {
            this._httpClient
              .post(environment.endpoint + 'comment/' + taskuuid, {
                text: `>!<${data.time.toISOString()}>!<${data.cost}>!<${data.comment}`,
              })
              .subscribe((r) => {
                forkJoin([
                  this._translateService.get('snackbar.added_self'),
                  this._translateService.get('snackbar.ok'),
                ]).subscribe((text) => {
                  this._snackbar.open(text[0], text[1], { duration: 3000 });
                  this.refresh();
                });
              });
          });
      });
  }

  removeSelf(taskuuid: string) {
    this._httpClient
      .put(environment.endpoint + 'task/' + taskuuid, {
        taskmaster: null,
      })
      .subscribe((res) => {
        forkJoin([
          this._translateService.get('snackbar.removed_self'),
          this._translateService.get('snackbar.ok'),
        ]).subscribe((text) => {
          this._snackbar.open(text[0], text[1], { duration: 3000 });
          this.refresh();
        });
      });
  }
}
