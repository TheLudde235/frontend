import { Component, Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Language, Session } from 'src/app/store/models/runtime';
import { DialogTaskComponent } from '../dialog-task/dialog-task.component';

interface DialogData {
  city: string;
  street: string;
  streetnumber: string;
  description?: string;
}

@Component({
  selector: 'app-dialog-estate',
  templateUrl: './dialog-estate.component.html',
  styleUrls: ['./dialog-estate.component.scss']
})


export class DialogEstateComponent {
constructor(
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick() {
    this.dialogRef.close()
  }
}
