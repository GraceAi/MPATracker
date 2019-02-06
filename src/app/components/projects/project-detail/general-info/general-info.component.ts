import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../../../classes/project';
import { User, Firm } from '../../../../classes/domain';
import { DomainService } from '../../../../services/domain.service';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';
import { NewFirmDialog } from '../../../../components/modals/dialog-newfirm/dialog-newfirm';

@Component({
  selector: 'project-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class ProjectGeneralInfoComponent implements OnInit {
  role_id:number;
  project_id:number;
  info:Project = new Project();
  origInfo:Project = new Project();
  selectedContact:string = "Select...";
  contacts:User[];
  selectedFirm:string = "Select...";
  firms:Firm[];
  disabled:boolean = true;
  hide:boolean = true;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private domainService: DomainService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');

    this.getGeneralInfo();

    this.firms = this.authService.firms;
    this.contacts = this.authService.allUsers;
  }

  getGeneralInfo(){
    this.projectService.getProjectInfoByProjectId(this.project_id).subscribe(result => {
      if(result != null){
        this.authService.setTitle("Project Number: " + result.project_number);
        this.info = result;
        this.origInfo =  Object.assign({}, result);
        this.getSelectedContact();
        this.getSelectedFirm();
        this.setLayout();
      }
    });
  }

  getSelectedContact(){
    if(this.info.contact_id == null || this.info.contact_id == 0)
      this.selectedContact = "Select...";
    else
      this.selectedContact = this.info.contact_name;
  }
  getSelectedFirm(){
    if(this.info.firm_id == null || this.info.firm_id == 0)
      this.selectedFirm = "Select...";
    else
      this.selectedFirm = this.info.firm_name;
  }

  setLayout(){
    if(this.role_id == 7){ //admin can edit everything
        this.disabled = false;
        this.hide = false;
    }
    else if(this.role_id == 6){ //manager can't edit
      this.disabled = true;
      this.hide = true;
    }
  }

  onChangeContact(contact:User){
    if(contact == null){
      this.selectedContact = "Select...";
      this.info.contact_id = null;
    }
    else{
      this.selectedContact = contact.fname + " " + contact.lname;
      this.info.contact_id = contact.user_id;
    }
  }
  onChangeFirm(firm:Firm){
    if(firm == null){
      this.selectedFirm = "Select...";
      this.info.firm_id = null;
    }
    else{
      this.selectedFirm = firm.firm_name;
      this.info.firm_id = firm.firm_id;
    }
  }

  openNewFirmDialog() {
    const dialogRef = this.dialog.open(NewFirmDialog, {width: '600px'});
    dialogRef.afterClosed().subscribe(newFirm => {
      if(newFirm.firm_name != null){
        this.projectService.addNewFirm(newFirm).subscribe(firm_id => {
          if(firm_id.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + firm_id.message, width: '600px'});
          }
          else if(firm_id > 0){
            this.domainService.getFirms(this.authService.appSettings.service_url)
                .subscribe(result => {
                  this.authService.firms = result;
                  this.firms = result;
                  this.selectedFirm = result.find(x => x.firm_id === firm_id).firm_name;
                });
          }
        });
      }
    });
  }

  updateProjectGeneral(){
    this.projectService.updateProjectGeneral(this.info).subscribe(result => {
      if(result == true){
        console.log(result);
        this.origInfo =  Object.assign({}, this.info);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.info.firm_id === this.origInfo.firm_id && this.info.contact_id === this.origInfo.contact_id && this.info.description === this.origInfo.description
    && this.info.contract_number === this.origInfo.contract_number) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
