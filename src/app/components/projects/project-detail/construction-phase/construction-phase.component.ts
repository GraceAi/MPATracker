import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ProjectSize, Firm } from '../../../../classes/domain';
import { ConstructionPhase } from '../../../../classes/project';
import { DomainService } from '../../../../services/domain.service';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { ConfirmationDialog } from '../../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';
import { NewFirmDialog } from '../../../../components/modals/dialog-newfirm/dialog-newfirm';

@Component({
  selector: 'app-construction-phase',
  templateUrl: './construction-phase.component.html',
  styleUrls: ['./construction-phase.component.css']
})
export class ConstructionPhaseComponent implements OnInit {
  role_id:number;
  project_id:number;
  info:ConstructionPhase = new ConstructionPhase();
  origInfo:ConstructionPhase = new ConstructionPhase();
  selectedSize:string = "Select...";
  projectInterval:number = 0;
  sizes:ProjectSize[];
  selectedFirm:string = "Select...";
  firms:Firm[];
  calendarIconPath:string;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private domainService: DomainService,
   private authService: AuthenticationService,
   private datePipe: DatePipe,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');

    this.getConstructionPhaseInfo();

    this.calendarIconPath = this.authService.calendarIconPath;
    this.firms = this.authService.firms;
    this.sizes = this.authService.projectSizes;
  }

  getConstructionPhaseInfo(){
    this.projectService.getConstructionPhaseInfo(this.project_id).subscribe(result => {
      if(result != null){
        this.info = result;
        this.parseDate();
        this.origInfo =  Object.assign({}, result);
        this.getSelectedSize();
        this.getSelectedFirm();
      }
    });
  }

  parseDate(){
    if(this.info.ntp_date != null){
      let d = new Date(this.info.ntp_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.info.ntp_formatted = date;
    }
    for(let ms of this.info.milestones){
      if(ms.target_date != null){
        let d = new Date(ms.target_date);
        let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        ms.target_formatted = date;
      }
      if(ms.complete_date != null){
        let d = new Date(ms.complete_date);
        let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
        ms.complete_formatted = date;
      }
    }
  }

  getSelectedSize(){
    if(this.info.size_name == null || this.info.size_name.length == 0)
      this.selectedSize = "Select...";
    else{
      this.projectInterval = this.info.days;
      this.selectedSize = this.info.size_name;
    }
  }
  getSelectedFirm(){
    if(this.info.firm_name == null || this.info.firm_name.length == 0)
      this.selectedFirm = "Select...";
    else
      this.selectedFirm = this.info.firm_name;
  }

  compareMilestoneDates(target_formatted:any, complete_formatted:any, comment_text:string){
    let isLate:boolean = false;
    if(target_formatted != null && complete_formatted != null){
      let target_date = new Date(target_formatted.year + "-" +  target_formatted.month + "-" +  target_formatted.day);
      let complete_date = new Date(complete_formatted.year + "-" +  complete_formatted.month + "-" +  complete_formatted.day);
      if(target_date < complete_date && comment_text.trim().length == 0)
        isLate = true;
    }
    return isLate;
  }

  onChangeSize(projectSize:ProjectSize){
    if(projectSize == null){
      this.selectedSize = "Select...";
      this.info.project_size_id = null;
      this.projectInterval = 0;
    }
    else{
      this.selectedSize = projectSize.size_name;
      this.info.project_size_id = projectSize.size_id;
      this.projectInterval = projectSize.days;
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
        this.projectService.addNewFirm(newFirm).subscribe(res => {
          if(res.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + res.message, width: '600px'});
          }
          else if(res > 0){
            this.domainService.getFirms(this.authService.appSettings.service_url)
                .subscribe(result => {
                  this.authService.firms = result;
                  this.firms = result;
                  this.selectedFirm = result.find(x => x.firm_id === res).firm_name;
                });
          }
        });
      }
    });
  }


  generateMilestones(){
    let displayConfirmation:boolean = false;
    for(let ms of this.info.milestones){
      if(ms.target_formatted != null){
        displayConfirmation = true;
        break;
      }
    }
    if(displayConfirmation){
      const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Generate Milestone Confirmation", message: "Are you sure you want to overwrite existing mielstones?"}, width: '600px'});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.overwriteMilestones();
        }
      })
    }
    else{
      this.overwriteMilestones();
    }
  }

  overwriteMilestones(){
    if(this.info.project_size_id == null){
      this.toastr.error('', 'Please select a project size first', {timeOut: 2000});
    }
    else if(this.info.ntp_formatted == null){
      this.toastr.error('', 'Please select a NTP date first', {timeOut: 2000});
    }
    else{
      this.info.ntp_date = this.info.ntp_formatted.year + "-" +  this.info.ntp_formatted.month + "-" +  this.info.ntp_formatted.day;
      for(let ms of this.info.milestones){
        let interval = 0;
        if(ms.milestone_percentage == 25){
          interval = this.projectInterval;
        }
        if(ms.milestone_percentage == 50){
          interval = this.projectInterval * 2;
        }
        if(ms.milestone_percentage == 75){
          interval = this.projectInterval * 3;
        }
        if(ms.milestone_percentage == 100){
          interval = this.projectInterval * 4;
        }
        var date = new Date(this.info.ntp_date);
        date.setDate(date.getDate() + interval);
        let newDate = this.datePipe.transform(date,"yyyy-MM-dd");
        ms.target_date = newDate;

        let date_formatted = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        ms.target_formatted = date_formatted;
      }
    }
  }

  updateConstructionPhase(){
    if(this.info.ntp_formatted == null)
      this.info.ntp_date = null;
    else
      this.info.ntp_date = this.info.ntp_formatted.year + "-" +  this.info.ntp_formatted.month + "-" +  this.info.ntp_formatted.day;
    for(let ms of this.info.milestones){
      if(ms.target_formatted == null)
        ms.target_date = null;
      else
        ms.target_date = ms.target_formatted.year + "-" +  ms.target_formatted.month + "-" +  ms.target_formatted.day;

      if(ms.complete_formatted == null)
        ms.complete_date = null;
      else
        ms.complete_date = ms.complete_formatted.year + "-" +  ms.complete_formatted.month + "-" +  ms.complete_formatted.day;
    }
    console.log(this.info);
    this.projectService.updateConstructionPhase(this.info).subscribe(result => {
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
    if (this.info.firm_id === this.origInfo.firm_id && this.info.project_size_id === this.origInfo.project_size_id && this.info.ntp_formatted === this.origInfo.ntp_formatted) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
