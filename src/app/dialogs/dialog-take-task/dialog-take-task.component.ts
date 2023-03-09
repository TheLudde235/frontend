import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-take-task',
  templateUrl: './dialog-take-task.component.html',
  styleUrls: ['./dialog-take-task.component.scss']
})
export class DialogTakeTaskComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogTakeTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {time: string, cost: number, comment: string},
    ){}

    onNoClick() {
      this.dialogRef.close();
    }
}
