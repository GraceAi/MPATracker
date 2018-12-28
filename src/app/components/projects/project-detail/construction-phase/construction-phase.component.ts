import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ProjectSize, Firm } from '../../../../classes/domain';
import { ConstructionPhase } from '../../../../classes/project';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-construction-phase',
  templateUrl: './construction-phase.component.html',
  styleUrls: ['./construction-phase.component.css']
})
export class ConstructionPhaseComponent implements OnInit {
  role_id:number;
  project_id:number;
  constructionInfo:ConstructionPhase = new ConstructionPhase();
  origConstructionInfo:ConstructionPhase = new ConstructionPhase();
  selectedSize:string;
  projectInterval:number = 0;
  sizes:ProjectSize[];
  selectedFirm:string;
  firms:Firm[];
  disabled:boolean = true;
  //hide:boolean = true;
  calendarIconPath:string;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
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
        this.constructionInfo = result;
        this.parseDate();
        this.origConstructionInfo =  Object.assign({}, result);
        this.getSelectedSize();
        this.getSelectedFirm();
        this.setLayout();
      }
    });
  }

  parseDate(){
    if(this.constructionInfo.ntp_date != null){
      let d = new Date(this.constructionInfo.ntp_date);
      let date = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
      this.constructionInfo.ntp_formatted = date;
    }
    for(let ms of this.constructionInfo.milestones){
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
    if(this.constructionInfo.size_name == null || this.constructionInfo.size_name.length == 0)
      this.selectedSize = "Select...";
    else{
      this.projectInterval = this.constructionInfo.days;
      this.selectedSize = this.constructionInfo.size_name;
    }
  }
  getSelectedFirm(){
    if(this.constructionInfo.firm_name == null || this.constructionInfo.firm_name.length == 0)
      this.selectedFirm = "Select...";
    else
      this.selectedFirm = this.constructionInfo.firm_name;
  }

  setLayout(){
    if(this.role_id == 7){ //admin can edit everything
        this.disabled = false;
        //this.hide = false;
    }
    else if(this.role_id == 6){ //manager can't edit
      this.disabled = true;
      //this.hide = true;
    }
  }

  onChangeSize(projectSize:ProjectSize){
    if(projectSize == null){
      this.selectedSize = "Select...";
      this.constructionInfo.project_size_id = null;
      this.projectInterval = 0;
    }
    else{
      this.selectedSize = projectSize.size_name;
      this.constructionInfo.project_size_id = projectSize.size_id;
      this.projectInterval = projectSize.days;
    }
  }
  onChangeFirm(firm:Firm){
    if(firm == null){
      this.selectedFirm = "Select...";
      this.constructionInfo.firm_id = null;
    }
    else{
      this.selectedFirm = firm.firm_name;
      this.constructionInfo.firm_id = firm.firm_id;
    }
  }

  generateMilestones(){
    if(this.constructionInfo.project_size_id == null){
      this.toastr.error('', 'Please select a project size first', {timeOut: 2000});
    }
    else if(this.constructionInfo.ntp_formatted == null){
      this.toastr.error('', 'Please select a NTP date first', {timeOut: 2000});
    }
    else{
      this.constructionInfo.ntp_date = this.constructionInfo.ntp_formatted.year + "-" +  this.constructionInfo.ntp_formatted.month + "-" +  this.constructionInfo.ntp_formatted.day;
      for(let ms of this.constructionInfo.milestones){
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
        var date = new Date(this.constructionInfo.ntp_date);
        date.setDate(date.getDate() + interval);
        let newDate = this.datePipe.transform(date,"yyyy-MM-dd");
        ms.target_date = newDate;

        let date_formatted = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        ms.target_formatted = date_formatted;
      }
    }

    console.log(this.constructionInfo.milestones);
  }

  updateConstructionPhase(){
    if(this.constructionInfo.ntp_formatted == null)
      this.constructionInfo.ntp_date = null;
    else
      this.constructionInfo.ntp_date = this.constructionInfo.ntp_formatted.year + "-" +  this.constructionInfo.ntp_formatted.month + "-" +  this.constructionInfo.ntp_formatted.day;
    for(let ms of this.constructionInfo.milestones){
      if(ms.target_formatted == null)
        ms.target_date = null;
      else
        ms.target_date = ms.target_formatted.year + "-" +  ms.target_formatted.month + "-" +  ms.target_formatted.day;

      if(ms.complete_formatted == null)
        ms.complete_date = null;
      else
        ms.complete_date = ms.complete_formatted.year + "-" +  ms.complete_formatted.month + "-" +  ms.complete_formatted.day;
    }
    console.log(this.constructionInfo);
    this.projectService.updateConstructionPhase(this.constructionInfo).subscribe(result => {
      if(result == true){
        console.log(result);
        this.origConstructionInfo =  Object.assign({}, this.constructionInfo);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

}
