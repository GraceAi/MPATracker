import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Firm } from '../../../classes/domain';

@Component({
  selector: 'dialog-newfirm',
  templateUrl: './dialog-newfirm.html',
})
export class NewFirmDialog {
  title:string = "New Firm";
  firm:Firm = new Firm();
  editMode:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<NewFirmDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.firm = data;
        this.editMode = true;
        this.title = "Edit Firm";
      }
    }
    save() {
      this.dialogRef.close(this.firm);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
