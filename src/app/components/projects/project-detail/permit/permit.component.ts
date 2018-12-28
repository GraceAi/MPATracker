import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { Permit } from '../../../../classes/project';
import { User, Firm } from '../../../../classes/domain';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-permit',
  templateUrl: './permit.component.html',
  styleUrls: ['./permit.component.css']
})
export class PermitComponent implements OnInit {
  project_id:number;
  role_id:number;
  permitInfo:Permit = new Permit();
  origPermitInfo:Permit = new Permit();
  calendarIconPath:string;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.calendarIconPath = this.authService.calendarIconPath;
    this.getProjectPermit();
  }

  getProjectPermit(){
    this.projectService.getProjectPermit(this.project_id).subscribe(result => {
      if(result != null){
        this.permitInfo = result;
        this.parsePermitDate();
        this.origPermitInfo =  Object.assign({}, result);
      }
    });
  }

  resetStatus(event){
    if(!this.permitInfo.corps_permit_required)
      this.permitInfo.corps_permit_date = null;
    if(!this.permitInfo.mde_permit_required)
      this.permitInfo.mde_permit_date = null;
    if(!this.permitInfo.dam_saftey_approval)
      this.permitInfo.dam_saftey_date = null;
    if(!this.permitInfo.swm_approval)
      this.permitInfo.swm_date = null;
    if(!this.permitInfo.ms4_permit_required)
      this.permitInfo.ms4_permit_date = null;
    if(!this.permitInfo.local_permit_required)
      this.permitInfo.local_permit_date = null;
    if(!this.permitInfo.wetland_permit_required)
      this.permitInfo.wetland_permit_date = null;
    if(!this.permitInfo.critical_area_permit_required)
      this.permitInfo.critical_area_date = null;
  }

  parsePermitDate(){
    if(this.permitInfo.corps_permit_status != null){
      let d = new Date(this.permitInfo.corps_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.corps_permit_date = date;
    }
    if(this.permitInfo.mde_permit_status != null){
      let d = new Date(this.permitInfo.mde_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.mde_permit_date = date;
    }
    if(this.permitInfo.dam_saftey_status != null){
      let d = new Date(this.permitInfo.dam_saftey_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.dam_saftey_date = date;
    }
    if(this.permitInfo.swm_status != null){
      let d = new Date(this.permitInfo.swm_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.swm_date = date;
    }
    if(this.permitInfo.ms4_permit_status != null){
      let d = new Date(this.permitInfo.ms4_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.ms4_permit_date = date;
    }
    if(this.permitInfo.local_permit_status != null){
      let d = new Date(this.permitInfo.local_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.local_permit_date = date;
    }
    if(this.permitInfo.wetland_permit_status != null){
      let d = new Date(this.permitInfo.wetland_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.wetland_permit_date = date;
    }
    if(this.permitInfo.critical_area_permit_status != null){
      let d = new Date(this.permitInfo.critical_area_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.permitInfo.critical_area_date = date;
    }
  }

  updateProjectPermit(){
    if(this.permitInfo.corps_permit_date == null)
      this.permitInfo.corps_permit_status = null;
    else
      this.permitInfo.corps_permit_status = this.permitInfo.corps_permit_date.year + "-" +  this.permitInfo.corps_permit_date.month + "-" +  this.permitInfo.corps_permit_date.day;

    if(this.permitInfo.mde_permit_date == null)
        this.permitInfo.mde_permit_status = null;
    else
      this.permitInfo.mde_permit_status = this.permitInfo.mde_permit_date.year + "-" +  this.permitInfo.mde_permit_date.month  + "-" +   this.permitInfo.mde_permit_date.day;

    if(this.permitInfo.dam_saftey_date == null)
      this.permitInfo.dam_saftey_status = null;
    else
      this.permitInfo.dam_saftey_status = this.permitInfo.dam_saftey_date.year + "-" +  this.permitInfo.dam_saftey_date.month  + "-" +  this.permitInfo.dam_saftey_date.day;

    if(this.permitInfo.swm_date == null)
        this.permitInfo.swm_status = null;
    else
      this.permitInfo.swm_status = this.permitInfo.swm_date.year + "-" +  this.permitInfo.swm_date.month  + "-" + this.permitInfo.swm_date.day;

    if(this.permitInfo.ms4_permit_date == null)
      this.permitInfo.ms4_permit_status = null;
    else
      this.permitInfo.ms4_permit_status = this.permitInfo.ms4_permit_date.year + "-" +  this.permitInfo.ms4_permit_date.month + "-" +  this.permitInfo.ms4_permit_date.day;

    if(this.permitInfo.local_permit_date == null)
        this.permitInfo.local_permit_status = null;
    else
      this.permitInfo.local_permit_status = this.permitInfo.local_permit_date.year + "-" +  this.permitInfo.local_permit_date.month + "-" +  this.permitInfo.local_permit_date.day;

    if(this.permitInfo.wetland_permit_date == null)
      this.permitInfo.wetland_permit_status = null;
    else
      this.permitInfo.wetland_permit_status = this.permitInfo.wetland_permit_date.year + "-" +  this.permitInfo.wetland_permit_date.month + "-" + this.permitInfo.wetland_permit_date.day;

    if(this.permitInfo.critical_area_date == null)
        this.permitInfo.critical_area_permit_status = null;
    else
      this.permitInfo.critical_area_permit_status = this.permitInfo.critical_area_date.year + "-" +  this.permitInfo.critical_area_date.month + "-" +   this.permitInfo.critical_area_date.day;

    //console.log(this.permitInfo);
    this.projectService.updateProjectPermit(this.permitInfo).subscribe(result => {
      if(result == true){
        console.log(result);
        this.origPermitInfo =  Object.assign({}, this.permitInfo);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (this.permitInfo.corps_permit_required === this.origPermitInfo.corps_permit_required && this.permitInfo.mde_permit_required === this.origPermitInfo.mde_permit_required
       && this.permitInfo.dam_saftey_approval === this.origPermitInfo.dam_saftey_approval && this.permitInfo.swm_approval === this.origPermitInfo.swm_approval
       && this.permitInfo.ms4_permit_required === this.origPermitInfo.ms4_permit_required && this.permitInfo.local_permit_required === this.origPermitInfo.local_permit_required
       && this.permitInfo.wetland_permit_required === this.origPermitInfo.wetland_permit_required && this.permitInfo.critical_area_permit_required === this.origPermitInfo.critical_area_permit_required
       && this.permitInfo.corps_permit_date === this.origPermitInfo.corps_permit_date && this.permitInfo.mde_permit_date === this.origPermitInfo.mde_permit_date
       && this.permitInfo.dam_saftey_date === this.origPermitInfo.dam_saftey_date && this.permitInfo.swm_date === this.origPermitInfo.swm_date
       && this.permitInfo.ms4_permit_date === this.origPermitInfo.ms4_permit_date && this.permitInfo.local_permit_date === this.origPermitInfo.local_permit_date
       && this.permitInfo.wetland_permit_date === this.origPermitInfo.wetland_permit_date && this.permitInfo.critical_area_date === this.origPermitInfo.critical_area_date) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
