import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RequestContact } from '../../../classes/request';

@Component({
  selector: 'dialog-newcontact',
  templateUrl: './dialog-newcontact.html',
})
export class NewContactDialog {
  title:string = "New Contact";
  contact:RequestContact = new RequestContact();
  editMode:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<NewContactDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.contact = data;
        this.editMode = true;
        this.title = "Edit Contact";
      }
    }
    save() {
      this.dialogRef.close(this.contact);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
