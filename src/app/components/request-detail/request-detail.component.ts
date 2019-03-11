import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSidenavModule} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { RequestGeneral, RequestDetail } from '../../classes/request';
import { SideTab } from '../../classes/domain';
import { RequestService } from '../../services/request.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ConfirmationDialog } from '../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../components/modals/dialog-notification/dialog-notification';
@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  sideTabs:SideTab[];
  category_id:number;
  request_id:number;
  status_id:number;
  role_id:number;
  title:string;
  hideUnlockBtn:boolean = true;
  hideSubmitBtn:boolean = true;
  hideCompleteBtn:boolean = true;
  hideDeleteBtn:boolean = true;

  componentRef:any;

  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.role_id = +this.route.snapshot.paramMap.get('roleId');
    this.route.data
        .subscribe((data: { requestDetail: RequestDetail }) => {
          if(data.requestDetail != null && data.requestDetail != undefined){
            this.sideTabs = data.requestDetail.sideTabs;
            //this.selectedSideTab = this.sideTabs[0];
            this.category_id = data.requestDetail.generalInfo.category_id;
            this.request_id = data.requestDetail.generalInfo.request_id;
            this.status_id = data.requestDetail.generalInfo.status_id;
            if(this.status_id == 1){
              let pageTitle = "Create New Request - " + data.requestDetail.generalInfo.category_code;
              this.authService.setTitle(pageTitle);
            }
            else {
              let pageTitle = "Request Number: " + data.requestDetail.generalInfo.sequence_id;
              this.authService.setTitle(pageTitle);
            }
            this.setLayout();
            //this.setSelectedTab(this.router.url);
          }
        });
  }
  /*setSelectedTab(url:string){
    let lastslashindex = url.lastIndexOf('/');
    let tabname= url.substring(lastslashindex  + 1);
    let index = this.sideTabs.map(function(e) { return e.sidetab_name.toLowerCase(); }).indexOf(tabname);
    this.selectedSideTab = this.sideTabs[index];
  }*/
  onActivate(componentRef){
    this.componentRef = componentRef;//to access child component: request general component
  }

  setLayout(){
    this.authService.setUnlock(false);
    if(this.role_id == 1){
      if(this.status_id == 1){
        this.hideSubmitBtn = false;
        this.hideDeleteBtn = false;
      }
      else if(this.status_id == 2 || this.status_id == 3){
        this.hideUnlockBtn = false;
      }
    }
    else if(this.role_id == 2){
      if(this.status_id == 2 || this.status_id == 3){
        this.hideCompleteBtn = false;
      }
    }
    /*else if(this.role_id == 3){
      if(this.status_id == 2 || this.status_id == 3 ){
        this.hideCompleteBtn = false;
      }
    }*/
  }

  submitRequest() {
    if(this.componentRef.generalInfo != null){
      //if (this.componentRef.generalInfo.notes !== this.componentRef.origGeneralInfo.notes || this.componentRef.generalInfo.high_priority !== this.componentRef.origGeneralInfo.high_priority
      //  || this.componentRef.generalInfo.description !== this.componentRef.origGeneralInfo.description
      //  || this.componentRef.generalInfo.location_id !== this.componentRef.origGeneralInfo.location_id || this.componentRef.generalInfo.deptmt_id !== this.componentRef.origGeneralInfo.deptmt_id) {
      if (JSON.stringify(this.componentRef.generalInfo) !== JSON.stringify(this.componentRef.origGeneralInfo)) {
          this.requestService.updateRequestGeneral(this.componentRef.generalInfo).subscribe(result => {
            if(result == "Success"){
              //this.componentRef.origGeneralInfo = this.componentRef.generalInfo;
              this.componentRef.origGeneralInfo =  Object.assign({}, this.componentRef.generalInfo);
              this.toastr.success('', 'General Info Changes Auto Saved', {timeOut: 3000});

              this.openSubmitRequestDialog();
            }
            else if(result.ok == false){
              const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            }
          });
        }
        else {
          this.openSubmitRequestDialog();
        }
    }
    else {
      this.openSubmitRequestDialog();
    }
  }

  openSubmitRequestDialog(){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Submit Request Confirmation", message: "Are you sure you want to submit this request?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        let general = new RequestGeneral();
        general.request_id = this.request_id;
        general.category_id = this.category_id;
        this.requestService.submitRequest(general).subscribe(result => {
          document.querySelector("body").style.cssText = "cursor: auto";
          if(result.length > 0){
            this.toastr.success('', 'Request Submitted', {timeOut: 3000});
            //const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
            this.toHomePage();
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  completeRequest(){
    let message = "Are you sure you want to complete this request?";
    if(this.componentRef.assignedReviewers != null){
      if(JSON.stringify(this.componentRef.origAssignedReviewers) != JSON.stringify(this.componentRef.assignedReviewers)){
        message = "You have some unsaved changes in Reviewers section. Are you sure you want to complete this request?";
      }
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Complete Request Confirmation", message: message}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        if(this.componentRef.assignedReviewers != null){
          this.componentRef.origAssignedReviewers =  this.componentRef.assignedReviewers.map(x => Object.assign({}, x));
        }
        let general = new RequestGeneral();
        general.request_id = this.request_id;
        general.category_id = this.category_id;
        this.requestService.completeRequest(general).subscribe(result => {
          document.querySelector("body").style.cssText = "cursor: auto";
          if(result.length > 0){
            this.toastr.success('', 'Request Completed', {timeOut: 3000});
            //const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
            this.toHomePage();
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  closeRequest(){
    this.toHomePage();
  }
  deleteRequest() {
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete Request Confirmation", message: "Are you sure you want to delete this request?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        //this.componentRef.origGeneralInfo = this.componentRef.generalInfo;
        if(this.componentRef.generalInfo != null){
          this.componentRef.origGeneralInfo =  Object.assign({}, this.componentRef.generalInfo);
        }
        if(this.componentRef.assignedReviewers != null){
          this.componentRef.origAssignedReviewers =  this.componentRef.assignedReviewers.map(x => Object.assign({}, x));
        }
        this.requestService.deleteRequest(this.request_id).subscribe(result => {
          document.querySelector("body").style.cssText = "cursor: auto";
          if(result.length >= 0){
            this.toHomePage();
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  unlockRequest(){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Edit Request Confirmation", message: "Any fields resubmitted for editing will reset the request's due-date."}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.hideUnlockBtn = true;
        this.authService.setUnlock(true);
      }
    });
  }

  toHomePage(){
    if(this.role_id == 1)
      this.router.navigate(['/home/tab/1']);
    else if(this.role_id == 2)
      this.router.navigate(['/home/tab/2']);
    else if(this.role_id == 3)
      this.router.navigate(['/home/tab/5']);
  }

}
