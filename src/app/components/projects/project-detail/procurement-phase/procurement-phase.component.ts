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
  procurementInfo:ProcurementPhase = new ProcurementPhase();
  origProcurementInfo:ProcurementPhase = new ProcurementPhase();
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
        this.procurementInfo = result;
        this.getSelectedOfficer();
        this.parseDate();
        this.origProcurementInfo =  Object.assign({}, result);
      }
    });
  }

  getSelectedOfficer(){
    if(this.procurementInfo.officer_name == null || this.procurementInfo.officer_name.length == 0)
      this.selectedOfficer = "Select...";
    else
      this.selectedOfficer = this.procurementInfo.officer_name;
  }

  onChangeOfficer(officer:User){
    if(officer == null){
      this.selectedOfficer = "Select...";
      this.procurementInfo.officer_id = null;
    }
    else{
      this.selectedOfficer = officer.fname + " " + officer.lname;
      this.procurementInfo.officer_id = officer.user_id;
    }
  }

  parseDate(){
    if(this.procurementInfo.next_or_final_specs_date != null){
      let d = new Date(this.procurementInfo.next_or_final_specs_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.next_or_final_specs_formatted = date;
    }
    if(this.procurementInfo.procurement_start_date != null){
      let d = new Date(this.procurementInfo.procurement_start_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.procurement_start_formatted = date;
    }
    if(this.procurementInfo.prg_date != null){
      let d = new Date(this.procurementInfo.prg_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.prg_formatted = date;
    }
    if(this.procurementInfo.early_adv_date != null){
      let d = new Date(this.procurementInfo.early_adv_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.early_adv_formatted = date;
    }
    if(this.procurementInfo.early_bids_date != null){
      let d = new Date(this.procurementInfo.early_bids_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.early_bids_formatted = date;
    }
    if(this.procurementInfo.mpc != null){
      let d = new Date(this.procurementInfo.mpc);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.mpc_formatted = date;
    }
    if(this.procurementInfo.bpw != null){
      let d = new Date(this.procurementInfo.bpw);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.bpw_formatted = date;
    }
    if(this.procurementInfo.ntp_date != null){
      let d = new Date(this.procurementInfo.ntp_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.ntp_formatted = date;
    }
    if(this.procurementInfo.compl_date != null){
      let d = new Date(this.procurementInfo.compl_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.procurementInfo.compl_formatted = date;
    }

  }

  updateProcurementPhase(){
    if(this.procurementInfo.next_or_final_specs_formatted == null)
      this.procurementInfo.next_or_final_specs_date = null;
    else
      this.procurementInfo.next_or_final_specs_date = this.procurementInfo.next_or_final_specs_formatted.year + "-" +  this.procurementInfo.next_or_final_specs_formatted.month + "-" +  this.procurementInfo.next_or_final_specs_formatted.day;

    if(this.procurementInfo.prg_formatted == null)
      this.procurementInfo.prg_date = null;
    else
      this.procurementInfo.prg_date = this.procurementInfo.prg_formatted.year + "-" +  this.procurementInfo.prg_formatted.month + "-" +  this.procurementInfo.prg_formatted.day;

    if(this.procurementInfo.procurement_start_formatted == null)
      this.procurementInfo.procurement_start_date = null;
    else
      this.procurementInfo.procurement_start_date = this.procurementInfo.procurement_start_formatted.year + "-" +  this.procurementInfo.procurement_start_formatted.month + "-" +  this.procurementInfo.procurement_start_formatted.day;

    if(this.procurementInfo.early_adv_formatted == null)
        this.procurementInfo.early_adv_date = null;
    else
      this.procurementInfo.early_adv_date = this.procurementInfo.early_adv_formatted.year + "-" +  this.procurementInfo.early_adv_formatted.month  + "-" +   this.procurementInfo.early_adv_formatted.day;

    if(this.procurementInfo.early_bids_formatted == null)
      this.procurementInfo.early_bids_date = null;
    else
      this.procurementInfo.early_bids_date = this.procurementInfo.early_bids_formatted.year + "-" +  this.procurementInfo.early_bids_formatted.month  + "-" +  this.procurementInfo.early_bids_formatted.day;

    if(this.procurementInfo.mpc_formatted == null)
        this.procurementInfo.mpc = null;
    else
      this.procurementInfo.mpc = this.procurementInfo.mpc_formatted.year + "-" +  this.procurementInfo.mpc_formatted.month  + "-" + this.procurementInfo.mpc_formatted.day;

    if(this.procurementInfo.bpw_formatted == null)
      this.procurementInfo.bpw = null;
    else
      this.procurementInfo.bpw = this.procurementInfo.bpw_formatted.year + "-" +  this.procurementInfo.bpw_formatted.month + "-" +  this.procurementInfo.bpw_formatted.day;

    if(this.procurementInfo.ntp_formatted == null)
        this.procurementInfo.ntp_date = null;
    else
      this.procurementInfo.ntp_date = this.procurementInfo.ntp_formatted.year + "-" +  this.procurementInfo.ntp_formatted.month + "-" +  this.procurementInfo.ntp_formatted.day;

    if(this.procurementInfo.compl_formatted == null)
      this.procurementInfo.compl_date = null;
    else
      this.procurementInfo.compl_date = this.procurementInfo.compl_formatted.year + "-" +  this.procurementInfo.compl_formatted.month + "-" + this.procurementInfo.compl_formatted.day;

    this.projectService.updateProcurementPhase(this.procurementInfo).subscribe(result => {
      if(result == true){
        console.log(result);
        this.origProcurementInfo =  Object.assign({}, this.procurementInfo);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no procurement phase or procurement phase is unchanged
    if (this.procurementInfo.officer_id === this.origProcurementInfo.officer_id &&
      this.procurementInfo.current_proc_day === this.origProcurementInfo.current_proc_day &&
      this.procurementInfo.next_or_final_specs_formatted === this.origProcurementInfo.next_or_final_specs_formatted &&
      this.procurementInfo.procurement_start_formatted === this.origProcurementInfo.procurement_start_formatted &&
      this.procurementInfo.early_adv_formatted === this.origProcurementInfo.early_adv_formatted &&
      this.procurementInfo.early_bids_formatted === this.origProcurementInfo.early_bids_formatted &&
      this.procurementInfo.mpc_formatted === this.origProcurementInfo.mpc_formatted &&
      this.procurementInfo.bpw_formatted === this.origProcurementInfo.bpw_formatted &&
      this.procurementInfo.ntp_formatted === this.origProcurementInfo.ntp_formatted &&
      this.procurementInfo.compl_formatted === this.origProcurementInfo.compl_formatted) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
