import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RequestDocument } from '../../../classes/request';

@Component({
  selector: 'dialog-adddoc',
  templateUrl: './dialog-adddoc.html',
})
export class AddDocumentDialog {
  title:string = "Add Document";
  file:File;
  name:string;
  description:string;
  editMode:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddDocumentDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.name = data.name;
        this.description = data.description;
        this.editMode = true;
        this.title = "Edit Document";
      }
    }
    btnAddDoc(event): void {
        if (event.target.files.length == 0) {
          console.log("No file selected!");
          return;
        }
        this.file = event.target.files[0];
        this.name = this.file.name;
    }

    saveDoc(){
      let doc:any;
      if(this.editMode){
        doc = {'description':this.description};
      }
      else doc = {'filecontent': this.file, 'description':this.description};
      this.dialogRef.close(doc);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
}
