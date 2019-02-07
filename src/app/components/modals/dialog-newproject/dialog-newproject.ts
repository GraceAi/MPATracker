import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { User, Firm } from '../../../classes/domain';
import { Project } from '../../../classes/project';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProjectService } from '../../../services/project.service';
import { DomainService } from '../../../services/domain.service';
import { NewFirmDialog } from '../../../components/modals/dialog-newfirm/dialog-newfirm';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

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
    private authService: AuthenticationService,
    private domainService: DomainService,
    private projectService: ProjectService,
    public dialog: MatDialog,
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

    openNewFirmDialog() {
      const dialogRef = this.dialog.open(NewFirmDialog, {width: '600px'});
      dialogRef.afterClosed().subscribe(newFirm => {
        if(newFirm.firm_name != null){
          this.projectService.addNewFirm(newFirm).subscribe(res => {
            if(res.ok == false){
              const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + res.message, width: '600px'});
            }
            else if(res > 0){
              this.domainService.getFirms(this.authService.appSettings.service_url)
                  .subscribe(result => {
                    this.authService.firms = result;
                    this.firms = result;
                    this.newProject.firm_id = res;
                    this.selectedFirm = result.find(x => x.firm_id === res).firm_name;
                  });
            }
          });
        }
      });
    }

}
