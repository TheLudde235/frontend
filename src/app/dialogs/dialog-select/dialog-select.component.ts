import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, map, retry } from 'rxjs/operators'
import { Estate, Task } from 'src/app/data-types';

type DialogData = Estate[] | Task[];

@Component({
  selector: 'app-dialog-select',
  templateUrl: './dialog-select.component.html',
  styleUrls: ['./dialog-select.component.scss']
})
export class DialogSelectComponent implements OnInit {
  autoCompleteControl = new FormControl<string | Task | Estate>('');
  filteredOptions$: Observable<string[] | DialogData> | undefined;
  estateuuid: string = ''
  constructor(
    public dialogRef: MatDialogRef<DialogSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {data: DialogData, title: string, color?: string},
  ) { }

  isTask = (task: Task | Estate | string | null): task is Task => {
    if (!task) return false;
    if (typeof task === 'string') return false;
    return 'title' in task;
  }
  
  isTaskArr = (task: Task[] | Estate[] | string[] | null): task is Task[] => {
    if (!task) return false;
    if (!task[0]) return false;
    if (typeof task[0] === 'string') return false;
    return 'title' in task[0];
  }

  isEstate = (estate: Estate | Task | string | null): estate is Estate => {
    if (!estate) return false;
    if (typeof estate === 'string') return false;
    return 'street' in estate;
  }

  isEstateArr = (estate: Estate[] | Task[] | string[] | null): estate is Estate[] => {
    if (!estate) return false;
    if (!estate[0]) return false;
    if (typeof estate[0] === 'string') return false;
    return 'street' in estate[0];
  }





  ngOnInit() {
    this.filteredOptions$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map<string | null | Task | Estate, string[] | DialogData>(value => {
        const search = this.isTask(value) ? value.title : this.isEstate(value) ? value.city + ', ' + value.street + ' ' + value.streetnumber : value;
        return (search ? this._filter(search as string) : this.data.data.slice());
      }),
    );
  }

  displayFn(value: Estate): string {
    this.estateuuid = value.estateuuid;
    console.warn(value)
    return value ? `${value.city}, ${value.street} ${value.streetnumber}` : ''
  }

  private _filter(search: string): DialogData {
    const filterValue = search.toLowerCase();

    if (!search) return this.data.data;

    if (this.isTaskArr(this.data.data)) {
      return this.data.data.filter(task => task.title.toLowerCase().includes(filterValue))
    }
    if (this.isEstateArr(this.data.data)) {
      return this.data.data.filter(estate => (`${estate.city}, ${estate.street} ${estate.streetnumber}`).toLowerCase().includes(filterValue));
    }
    return this.data.data;
  }

  cancel() {

  }

  delete() {

  }
}
