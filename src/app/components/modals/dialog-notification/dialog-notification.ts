import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-notification',
  templateUrl: './dialog-notification.html',
})
export class NotificationDialog {
  message:string;
  constructor(
    public dialogRef: MatDialogRef<NotificationDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
          this.message = data;
    }

}
