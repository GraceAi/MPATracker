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
  info:Permit = new Permit();
  origInfo:Permit = new Permit();
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
        this.info = result;
        this.parsePermitDate();
        this.origInfo =  Object.assign({}, result);
      }
    });
  }

  resetStatus(event){
    if(!this.info.corps_permit_required)
      this.info.corps_permit_date = null;
    if(!this.info.mde_permit_required)
      this.info.mde_permit_date = null;
    if(!this.info.dam_saftey_approval)
      this.info.dam_saftey_date = null;
    if(!this.info.swm_approval)
      this.info.swm_date = null;
    if(!this.info.ms4_permit_required)
      this.info.ms4_permit_date = null;
    if(!this.info.local_permit_required)
      this.info.local_permit_date = null;
    if(!this.info.wetland_permit_required)
      this.info.wetland_permit_date = null;
    if(!this.info.critical_area_permit_required)
      this.info.critical_area_date = null;
  }

  parsePermitDate(){
    if(this.info.corps_permit_status != null){
      let d = new Date(this.info.corps_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.corps_permit_date = date;
    }
    if(this.info.mde_permit_status != null){
      let d = new Date(this.info.mde_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.mde_permit_date = date;
    }
    if(this.info.dam_saftey_status != null){
      let d = new Date(this.info.dam_saftey_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.dam_saftey_date = date;
    }
    if(this.info.swm_status != null){
      let d = new Date(this.info.swm_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.swm_date = date;
    }
    if(this.info.ms4_permit_status != null){
      let d = new Date(this.info.ms4_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.ms4_permit_date = date;
    }
    if(this.info.local_permit_status != null){
      let d = new Date(this.info.local_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.local_permit_date = date;
    }
    if(this.info.wetland_permit_status != null){
      let d = new Date(this.info.wetland_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.wetland_permit_date = date;
    }
    if(this.info.critical_area_permit_status != null){
      let d = new Date(this.info.critical_area_permit_status);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.critical_area_date = date;
    }
  }

  updateProjectPermit(){
    if(this.info.corps_permit_date == null)
      this.info.corps_permit_status = null;
    else
      this.info.corps_permit_status = this.info.corps_permit_date.year + "-" +  this.info.corps_permit_date.month + "-" +  this.info.corps_permit_date.day;

    if(this.info.mde_permit_date == null)
        this.info.mde_permit_status = null;
    else
      this.info.mde_permit_status = this.info.mde_permit_date.year + "-" +  this.info.mde_permit_date.month  + "-" +   this.info.mde_permit_date.day;

    if(this.info.dam_saftey_date == null)
      this.info.dam_saftey_status = null;
    else
      this.info.dam_saftey_status = this.info.dam_saftey_date.year + "-" +  this.info.dam_saftey_date.month  + "-" +  this.info.dam_saftey_date.day;

    if(this.info.swm_date == null)
        this.info.swm_status = null;
    else
      this.info.swm_status = this.info.swm_date.year + "-" +  this.info.swm_date.month  + "-" + this.info.swm_date.day;

    if(this.info.ms4_permit_date == null)
      this.info.ms4_permit_status = null;
    else
      this.info.ms4_permit_status = this.info.ms4_permit_date.year + "-" +  this.info.ms4_permit_date.month + "-" +  this.info.ms4_permit_date.day;

    if(this.info.local_permit_date == null)
        this.info.local_permit_status = null;
    else
      this.info.local_permit_status = this.info.local_permit_date.year + "-" +  this.info.local_permit_date.month + "-" +  this.info.local_permit_date.day;

    if(this.info.wetland_permit_date == null)
      this.info.wetland_permit_status = null;
    else
      this.info.wetland_permit_status = this.info.wetland_permit_date.year + "-" +  this.info.wetland_permit_date.month + "-" + this.info.wetland_permit_date.day;

    if(this.info.critical_area_date == null)
        this.info.critical_area_permit_status = null;
    else
      this.info.critical_area_permit_status = this.info.critical_area_date.year + "-" +  this.info.critical_area_date.month + "-" +   this.info.critical_area_date.day;

    //console.log(this.info);
    this.projectService.updateProjectPermit(this.info).subscribe(result => {
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
    if (this.info.corps_permit_required === this.origInfo.corps_permit_required && this.info.mde_permit_required === this.origInfo.mde_permit_required
       && this.info.dam_saftey_approval === this.origInfo.dam_saftey_approval && this.info.swm_approval === this.origInfo.swm_approval
       && this.info.ms4_permit_required === this.origInfo.ms4_permit_required && this.info.local_permit_required === this.origInfo.local_permit_required
       && this.info.wetland_permit_required === this.origInfo.wetland_permit_required && this.info.critical_area_permit_required === this.origInfo.critical_area_permit_required
       && this.info.corps_permit_date === this.origInfo.corps_permit_date && this.info.mde_permit_date === this.origInfo.mde_permit_date
       && this.info.dam_saftey_date === this.origInfo.dam_saftey_date && this.info.swm_date === this.origInfo.swm_date
       && this.info.ms4_permit_date === this.origInfo.ms4_permit_date && this.info.local_permit_date === this.origInfo.local_permit_date
       && this.info.wetland_permit_date === this.origInfo.wetland_permit_date && this.info.critical_area_date === this.origInfo.critical_area_date) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
