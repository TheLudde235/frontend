import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface DialogData {
    title: string | undefined,
    content: string | undefined,
    color: string | undefined
}
@Component({
  selector: 'app-dialog-ok',
  templateUrl: './dialog-ok.component.html',
  styleUrls: ['./dialog-ok.component.scss']
})

export class DialogOkComponent implements OnInit {


  constructor(public _dialogRef: MatDialogRef<DialogOkComponent>, @Inject(MAT_DIALOG_DATA) public data?: DialogData) {
  }
  
  ngOnInit(): void {
    if (!this.data) this.data = {title: undefined, content: undefined, color: undefined};
  }
}
