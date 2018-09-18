import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-addcomment',
  templateUrl: './dialog-addcomment.html',
})
export class AddCommentDialog {
  constructor(
    public dialogRef: MatDialogRef<AddCommentDialog>
    ) {

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
