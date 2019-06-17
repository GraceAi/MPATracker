import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Department } from '../../../classes/domain';

@Component({
  selector: 'dialog-addreqdept',
  templateUrl: './dialog-addreqdept.html',
})
export class AddReqDeptDialog {
  title:string = "Add Requester Department";
  dept:Department = new Department();
  editMode:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddReqDeptDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      if(data){
        this.dept = data;
        this.editMode = true;
        this.title = "Edit Requester Department";
      }
      else{
        this.dept.deptmt_visibility = false;
      }
    }
    save() {
      this.dialogRef.close(this.dept);
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
