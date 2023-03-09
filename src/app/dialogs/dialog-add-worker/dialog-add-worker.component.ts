import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-add-worker',
  templateUrl: './dialog-add-worker.component.html',
  styleUrls: ['./dialog-add-worker.component.scss']
})
export class DialogAddWorkerComponent {
constructor(
    public dialogRef: MatDialogRef<DialogAddWorkerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {workers: Worker[], action: string},
    ) { }
    
  selected: string = '';

  cancel() {
    this.dialogRef.close(this.selected);
  }
}
