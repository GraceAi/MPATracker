import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
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
  calendarIconPath:string;
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
    this.calendarIconPath = this.authService.calendarIconPath;
    this.officers = this.authService.allUsers;
    this.getProcurementPhase();
  }

  getProcurementPhase(){
    this.projectService.getProcurementPhase(this.project_id).subscribe(result => {
      if(result != null){
        this.info = result;
        this.getSelectedOfficer();
        this.parseDate();
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

  parseDate(){
    if(this.info.next_or_final_specs_date != null){
      let d = new Date(this.info.next_or_final_specs_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.next_or_final_specs_formatted = date;
    }
    if(this.info.procurement_start_date != null){
      let d = new Date(this.info.procurement_start_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.procurement_start_formatted = date;
    }
    if(this.info.prg_date != null){
      let d = new Date(this.info.prg_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.prg_formatted = date;
    }
    if(this.info.early_adv_date != null){
      let d = new Date(this.info.early_adv_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.early_adv_formatted = date;
    }
    if(this.info.early_bids_date != null){
      let d = new Date(this.info.early_bids_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.early_bids_formatted = date;
    }
    if(this.info.mpc != null){
      let d = new Date(this.info.mpc);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.mpc_formatted = date;
    }
    if(this.info.bpw != null){
      let d = new Date(this.info.bpw);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.bpw_formatted = date;
    }
    if(this.info.ntp_date != null){
      let d = new Date(this.info.ntp_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.ntp_formatted = date;
    }
    if(this.info.compl_date != null){
      let d = new Date(this.info.compl_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.compl_formatted = date;
    }

  }

  updateProcurementPhase(){
    if(this.info.next_or_final_specs_formatted == null)
      this.info.next_or_final_specs_date = null;
    else
      this.info.next_or_final_specs_date = this.info.next_or_final_specs_formatted.year + "-" +  this.info.next_or_final_specs_formatted.month + "-" +  this.info.next_or_final_specs_formatted.day;

    if(this.info.prg_formatted == null)
      this.info.prg_date = null;
    else
      this.info.prg_date = this.info.prg_formatted.year + "-" +  this.info.prg_formatted.month + "-" +  this.info.prg_formatted.day;

    if(this.info.procurement_start_formatted == null)
      this.info.procurement_start_date = null;
    else
      this.info.procurement_start_date = this.info.procurement_start_formatted.year + "-" +  this.info.procurement_start_formatted.month + "-" +  this.info.procurement_start_formatted.day;

    if(this.info.early_adv_formatted == null)
        this.info.early_adv_date = null;
    else
      this.info.early_adv_date = this.info.early_adv_formatted.year + "-" +  this.info.early_adv_formatted.month  + "-" +   this.info.early_adv_formatted.day;

    if(this.info.early_bids_formatted == null)
      this.info.early_bids_date = null;
    else
      this.info.early_bids_date = this.info.early_bids_formatted.year + "-" +  this.info.early_bids_formatted.month  + "-" +  this.info.early_bids_formatted.day;

    if(this.info.mpc_formatted == null)
        this.info.mpc = null;
    else
      this.info.mpc = this.info.mpc_formatted.year + "-" +  this.info.mpc_formatted.month  + "-" + this.info.mpc_formatted.day;

    if(this.info.bpw_formatted == null)
      this.info.bpw = null;
    else
      this.info.bpw = this.info.bpw_formatted.year + "-" +  this.info.bpw_formatted.month + "-" +  this.info.bpw_formatted.day;

    if(this.info.ntp_formatted == null)
        this.info.ntp_date = null;
    else
      this.info.ntp_date = this.info.ntp_formatted.year + "-" +  this.info.ntp_formatted.month + "-" +  this.info.ntp_formatted.day;

    if(this.info.compl_formatted == null)
      this.info.compl_date = null;
    else
      this.info.compl_date = this.info.compl_formatted.year + "-" +  this.info.compl_formatted.month + "-" + this.info.compl_formatted.day;

    this.projectService.updateProcurementPhase(this.info).subscribe(result => {
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
    // Allow synchronous navigation (`true`) if no procurement phase or procurement phase is unchanged
    if (this.info.officer_id === this.origInfo.officer_id &&
      this.info.current_proc_day === this.origInfo.current_proc_day &&
      this.info.next_or_final_specs_formatted === this.origInfo.next_or_final_specs_formatted &&
      this.info.procurement_start_formatted === this.origInfo.procurement_start_formatted &&
      this.info.early_adv_formatted === this.origInfo.early_adv_formatted &&
      this.info.early_bids_formatted === this.origInfo.early_bids_formatted &&
      this.info.mpc_formatted === this.origInfo.mpc_formatted &&
      this.info.bpw_formatted === this.origInfo.bpw_formatted &&
      this.info.ntp_formatted === this.origInfo.ntp_formatted &&
      this.info.compl_formatted === this.origInfo.compl_formatted) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
