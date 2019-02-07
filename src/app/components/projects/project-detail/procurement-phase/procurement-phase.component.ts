import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatDatepicker } from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import { ProcurementPhase } from '../../../../classes/project';
import { User } from '../../../../classes/domain';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-procurement-phase',
  templateUrl: './procurement-phase.component.html',
  styleUrls: ['./procurement-phase.component.css']
})
export class ProcurementPhaseComponent implements OnInit {
  project_id:number;
  role_id:number;
  info:ProcurementPhase = new ProcurementPhase();
  origInfo:ProcurementPhase = new ProcurementPhase();
  selectedOfficer:string = "Select...";
  officers:User[];
  constructor(private router: Router,
     private route: ActivatedRoute,
     private projectService: ProjectService,
     private authService: AuthenticationService,
     private toastr: ToastrService,
     public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.officers = this.authService.allUsers;
    this.getProcurementPhase();
  }

  getProcurementPhase(){
    this.projectService.getProcurementPhase(this.project_id).subscribe(result => {
      if(result != null){
        this.info = result;
        this.getSelectedOfficer();
        this.origInfo =  Object.assign({}, result);
      }
    });
  }

  getSelectedOfficer(){
    if(this.info.officer_id == null || this.info.officer_id == 0)
      this.selectedOfficer = "Select...";
    else
      this.selectedOfficer = this.info.officer_name;
  }

  onChangeOfficer(officer:User){
    if(officer == null){
      this.selectedOfficer = "Select...";
      this.info.officer_id = null;
    }
    else{
      this.selectedOfficer = officer.fname + " " + officer.lname;
      this.info.officer_id = officer.user_id;
    }
  }

  updateProcurementPhase(){
    this.projectService.updateProcurementPhase(this.info).subscribe(result => {
      if(result == true){
        this.origInfo =  Object.assign({}, this.info);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if procurement phase is unchanged
    if (this.info.officer_id === this.origInfo.officer_id &&
      this.info.current_proc_day === this.origInfo.current_proc_day &&
      new Date(this.info.next_or_final_specs_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.next_or_final_specs_date).setHours(0, 0, 0, 0) &&
      new Date(this.info.procurement_start_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.procurement_start_date).setHours(0, 0, 0, 0) &&
      new Date(this.info.early_adv_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.early_adv_date).setHours(0, 0, 0, 0) &&
      new Date(this.info.early_bids_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.early_bids_date).setHours(0, 0, 0, 0) &&
      new Date(this.info.mpc).setHours(0, 0, 0, 0) === new Date(this.origInfo.mpc).setHours(0, 0, 0, 0) &&
      new Date(this.info.bpw).setHours(0, 0, 0, 0) === new Date(this.origInfo.bpw).setHours(0, 0, 0, 0) &&
      new Date(this.info.ntp_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.ntp_date).setHours(0, 0, 0, 0) &&
      new Date(this.info.compl_date).setHours(0, 0, 0, 0) === new Date(this.origInfo.compl_date).setHours(0, 0, 0, 0)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
