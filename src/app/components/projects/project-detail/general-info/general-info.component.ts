import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../../../classes/project';
import { User, Firm } from '../../../../classes/domain';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'project-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class ProjectGeneralInfoComponent implements OnInit {
  role_id:number;
  project_id:number;
  generalInfo:Project = new Project();
  origGeneralInfo:Project = new Project();
  selectedContact:string = "Select...";
  contacts:User[];
  selectedFirm:string = "Select...";
  firms:Firm[];
  disabled:boolean = true;
  hide:boolean = true;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
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
        this.generalInfo = result;
        this.origGeneralInfo =  Object.assign({}, result);
        this.getSelectedContact();
        this.getSelectedFirm();
        this.setLayout();
      }
    });
  }

  getSelectedContact(){
    if(this.generalInfo.contact_name == null || this.generalInfo.contact_name.length == 0)
      this.selectedContact = "Select...";
    else
      this.selectedContact = this.generalInfo.contact_name;
  }
  getSelectedFirm(){
    if(this.generalInfo.firm_name == null || this.generalInfo.firm_name.length == 0)
      this.selectedFirm = "Select...";
    else
      this.selectedFirm = this.generalInfo.firm_name;
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
      this.generalInfo.contact_id = null;
    }
    else{
      this.selectedContact = contact.fname + " " + contact.lname;
      this.generalInfo.contact_id = contact.user_id;
    }
  }
  onChangeFirm(firm:Firm){
    if(firm == null){
      this.selectedFirm = "Select...";
      this.generalInfo.firm_id = null;
    }
    else{
      this.selectedFirm = firm.firm_name;
      this.generalInfo.firm_id = firm.firm_id;
    }
  }

  updateProjectGeneral(){
    this.projectService.updateProjectGeneral(this.generalInfo).subscribe(result => {
      if(result == true){
        console.log(result);
        this.origGeneralInfo =  Object.assign({}, this.generalInfo);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.generalInfo.firm_id === this.origGeneralInfo.firm_id && this.generalInfo.contact_id === this.origGeneralInfo.contact_id && this.generalInfo.description === this.origGeneralInfo.description
    && this.generalInfo.contract_number === this.origGeneralInfo.contract_number) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
