import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { User, Firm } from '../../../classes/domain';
import { Project } from '../../../classes/project';

@Component({
  selector: 'dialog-newproject',
  templateUrl: './dialog-newproject.html',
})
export class NewProjectDialog {
  title:string = "New Project";
  users:User[];
  firms:Firm[];
  selectedContact:string;
  selectedFirm:string;
  newProject:Project = new Project();
  constructor(
    public dialogRef: MatDialogRef<NewProjectDialog>,
     @Inject(MAT_DIALOG_DATA) data
    ) {
      this.selectedContact = "Select...";
      this.selectedFirm = "Select...";
      this.users = data.users;
      this.firms = data.firms;
    }
    onChangeFirm(firm:Firm){
      if(firm == null){
        this.selectedFirm = "Select...";
        this.newProject.firm_id = null;
      }
      else {
        this.selectedFirm = firm.firm_name;
        this.newProject.firm_id = firm.firm_id;
      }
    }
    onChangeContact(user:User){
      if(user == null){
        this.selectedContact = "Select...";
        this.newProject.contact_id = null;
      }
      else {
        this.selectedContact = user.fname + " " + user.lname;
        this.newProject.contact_id = user.user_id;
      }
    }
    save() {
      this.dialogRef.close(this.newProject);
    }
    onNoClick(): void {
      this.dialogRef.close();
    }

}
