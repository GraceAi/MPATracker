import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'dialog-addcomment',
  templateUrl: './dialog-addcomment.html',
})
export class AddCommentDialog {
  comment_text:string;
  constructor(
    public dialogRef: MatDialogRef<AddCommentDialog>
    ) {

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
