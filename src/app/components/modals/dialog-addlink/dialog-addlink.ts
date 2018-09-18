import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RequestPwLink } from '../../../classes/request';

@Component({
  selector: 'dialog-addlink',
  templateUrl: './dialog-addlink.html',
})
export class AddLinkDialog {
  title:string = "Add URL Link";
  pwLink:RequestPwLink = new RequestPwLink();
  editMode:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddLinkDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.pwLink = data;
        this.editMode = true;
        this.title = "Edit URL Link";
      }
    }

    save() {
      this.dialogRef.close(this.pwLink);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
