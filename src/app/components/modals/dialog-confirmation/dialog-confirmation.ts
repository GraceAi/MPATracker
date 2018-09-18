import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-confirmation',
  templateUrl: './dialog-confirmation.html',
})
export class ConfirmationDialog {
  title:string;
  message:string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
          this.title = data.title;
          this.message = data.message;
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
