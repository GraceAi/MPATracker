import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-addreqdept',
  templateUrl: './dialog-addreqdept.html',
})
export class AddReqDeptDialog {
  title:string = "Add Requester Department";
  dept_name:string;
  constructor(
    public dialogRef: MatDialogRef<AddReqDeptDialog>
    ) {

    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
