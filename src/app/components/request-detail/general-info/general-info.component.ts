import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import {RequestGeneral, RequestDetail} from '../../../classes/request';
import { Department, Location } from '../../../classes/domain';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {
  role_id:number;
  create_date:string;
  generalInfo:RequestGeneral = new RequestGeneral();
  origGeneralInfo:RequestGeneral = new RequestGeneral();
  selectedDept:string;
  departments:Department[];
  selectedLoc:string;
  locs:Location[];
  disabled:boolean = true;
  assignerDisabled:boolean = true;
  hide:boolean = true;
  status_id:number;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) {}

  ngOnInit() {
    let request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
          this.create_date = data.requestDetail.generalInfo.create_date.substring(0, 10);
        });
    this.getGeneralInfo(request_id);

    this.departments = this.authService.departments;
    this.locs = this.authService.locations;
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });
  }

  getGeneralInfo(request_id:number){
    this.requestService.getGeneralInfo(request_id).subscribe(result => {
      if(result){
        this.generalInfo = result;
        this.origGeneralInfo =  Object.assign({}, result);;
        this.getSelectedLoc();
        this.getSelectedDept();
      }
    });
  }

  getSelectedLoc(){
    if(this.generalInfo.location_name == null || this.generalInfo.location_name.length == 0)
      this.selectedLoc = "Select...";
    else
      this.selectedLoc = this.generalInfo.location_name;
  }
  getSelectedDept(){
    if(this.generalInfo.deptmt_name == null || this.generalInfo.deptmt_name.length == 0)
      this.selectedDept = "Select...";
    else
      this.selectedDept = this.generalInfo.deptmt_name;
  }
  setLayout(unlocked:boolean){
    if(this.role_id == 1){
      if(this.status_id == 1 || unlocked){
        this.disabled = false;
        this.hide = false;
      }
    }
    else if(this.role_id == 3){
      if(this.status_id == 2 || this.status_id == 3 ){
        this.assignerDisabled = false;
        this.hide = false;
      }
    }
  }

  onChangeLoc(loc:Location){
    if(loc == null){
      this.selectedLoc = "Select...";
      this.generalInfo.location_id = null;
    }
    else{
      this.selectedLoc = loc.location_name;
      this.generalInfo.location_id = loc.location_id;
    }
  }
  onChangeDept(dept:Department){
    if(dept == null){
      this.selectedDept = "Select...";
      this.generalInfo.deptmt_id = null;
    }
    else{
      this.selectedDept = dept.deptmt_name;
      this.generalInfo.deptmt_id = dept.deptmt_id;
    }
  }

  updateRequestGeneral(){
    this.origGeneralInfo = this.generalInfo;
    this.requestService.updateRequestGeneral(this.generalInfo).subscribe(result => {
      if(result == "Success"){
        //const dialogRef = this.dialog.open(NotificationDialog, { data: "General Information is updated successfully.", width: '600px'});
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.generalInfo.notes === this.origGeneralInfo.notes && this.generalInfo.high_priority === this.origGeneralInfo.high_priority && this.generalInfo.description === this.origGeneralInfo.description
    && this.generalInfo.location_id === this.origGeneralInfo.location_id && this.generalInfo.deptmt_id === this.origGeneralInfo.deptmt_id) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
