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
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getProjectPermit();
  }

  getProjectPermit(){
    this.projectService.getProjectPermit(this.project_id).subscribe(result => {
      if(result != null){
        this.info = result;
        this.origInfo =  Object.assign({}, result);
      }
    });
  }

  resetStatus(event){
    if(!this.info.corps_permit_required)
      this.info.corps_permit_status = null;
    if(!this.info.mde_permit_required)
      this.info.mde_permit_status = null;
    if(!this.info.dam_saftey_approval)
      this.info.dam_saftey_status = null;
    if(!this.info.swm_approval)
      this.info.swm_status = null;
    if(!this.info.ms4_permit_required)
      this.info.ms4_permit_status = null;
    if(!this.info.local_permit_required)
      this.info.local_permit_status= null;
    if(!this.info.wetland_permit_required)
      this.info.wetland_permit_status = null;
    if(!this.info.critical_area_permit_required)
      this.info.critical_area_permit_status = null;
  }

  updateProjectPermit(){
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
       && new Date(this.info.corps_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.corps_permit_status).setHours(0, 0, 0, 0)
       && new Date(this.info.mde_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.mde_permit_status).setHours(0, 0, 0, 0)
       && new Date(this.info.dam_saftey_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.dam_saftey_status).setHours(0, 0, 0, 0)
       && new Date(this.info.swm_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.swm_status).setHours(0, 0, 0, 0)
       && new Date(this.info.ms4_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.ms4_permit_status).setHours(0, 0, 0, 0)
       && new Date(this.info.local_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.local_permit_status).setHours(0, 0, 0, 0)
       && new Date(this.info.wetland_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.wetland_permit_status).setHours(0, 0, 0, 0)
       && new Date(this.info.critical_area_permit_status).setHours(0, 0, 0, 0) === new Date(this.origInfo.critical_area_permit_status).setHours(0, 0, 0, 0)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
