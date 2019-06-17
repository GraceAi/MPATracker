import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestDetail, RequestPwLink } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AddLinkDialog } from '../../../components/modals/dialog-addlink/dialog-addlink';
import { ConfirmationDialog } from '../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-pwlink',
  templateUrl: './pwlink.component.html',
  styleUrls: ['./pwlink.component.css']
})
export class PwlinkComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description'];
  pwLinkDataSource:any;
  request_id:number;
  status_id:number;
  role_id:number;
  hide:boolean = true;
  sidetabs:any;
  canEdit:boolean;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   private sanitizer:DomSanitizer,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.canEdit = this.route.snapshot.queryParams["canEdit"] == "true";
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestLinks();

    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
          //this.setLayout();
        });
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });
    this.authService.sidetabData.subscribe(data => { this.sidetabs = data; });
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  setLayout(unlocked:boolean){
    if(this.role_id == 1 && this.canEdit){
      if(this.status_id == 1 || unlocked){
        this.hide = false;
        this.displayedColumns.push('edit');
        this.displayedColumns.push('delete');
      }
    }
    else if(this.role_id == 2){
      if(this.status_id == 2 || this.status_id == 3){
        this.hide = false;
        this.displayedColumns.push('edit');
        this.displayedColumns.push('delete');
      }
    }

  }

  getRequestLinks(){
    this.requestService.getRequestLinks(this.request_id).subscribe(result => {
      if(result.length >= 0){
        this.pwLinkDataSource = new MatTableDataSource(result);
        this.pwLinkDataSource.sort = this.sort;
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }
  deleteLink(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete PW Link Confirmation", message: "Are you sure you want to delete this PW Link?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let link = new RequestPwLink();
        link.link_id = element.link_id;
        link.request_id = this.request_id;
        this.requestService.deleteRequestLink(link).subscribe(result => {
          if(result.length >= 0){
            this.pwLinkDataSource = new MatTableDataSource(result);
            this.pwLinkDataSource.sort = this.sort;

            this.updateSideTabCount('decrease');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  openAddPwLinkDialog() {
    const dialogRef = this.dialog.open(AddLinkDialog, {width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result.link_name != null && result.link_name.length > 0){
        result.request_id = this.request_id;
        this.requestService.addRequestLink(result).subscribe(result => {
          if(result.length >= 0){
            this.pwLinkDataSource = new MatTableDataSource(result);
            this.pwLinkDataSource.sort = this.sort;

            this.updateSideTabCount('increase');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
    }
    });
  }
  editLink(element:any){
    let link = Object.assign({}, element);
    const dialogRef = this.dialog.open(AddLinkDialog, {data: link, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.requestService.editRequestLink(link).subscribe(result => {
          if(result.length >= 0){
            this.pwLinkDataSource = new MatTableDataSource(result);
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }
  updateSideTabCount(action:string){
    if(action == "increase")
      this.sidetabs.find(item => item.sidetab_id == 7).sidetab_count++;
    if(action == "decrease")
      this.sidetabs.find(item => item.sidetab_id == 7).sidetab_count--;
  }
}
