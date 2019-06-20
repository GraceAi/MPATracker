import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestDetail, RequestContact } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AddContactDialog } from '../../../components/modals/dialog-addcontact/dialog-addcontact';
import { NewContactDialog } from '../../../components/modals/dialog-newcontact/dialog-newcontact';
import { ConfirmationDialog } from '../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  displayedColumns: string[] = ['name', 'company', 'email', 'phone'];
  contactDataSource:any;
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
   public dialog: MatDialog) {
      //authService.unlocked.subscribe(result => { if(result) this.setLayout(); });
    }

  ngOnInit() {
    this.canEdit = this.route.snapshot.queryParams["canEdit"] == "true";
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestContacts();
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
        });
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });
    this.authService.sidetabData.subscribe(data => { this.sidetabs = data; });
  }

  setLayout(unlocked:boolean){
    if(this.role_id == 1  && this.canEdit){ //requester
      if(this.status_id == 1 || unlocked){ //new
        this.hide = false;
        this.displayedColumns.push("edit");
        this.displayedColumns.push("delete");
      }
    }
    else if(this.role_id == 2){
      if(this.status_id == 2 || this.status_id == 3 || this.status_id == 5){
        this.hide = false;
        this.displayedColumns.push("edit");
        this.displayedColumns.push("delete");
      }
    }

  }

  getRequestContacts(){
    this.requestService.getRequestContacts(this.request_id).subscribe(result => {
       if(result.length >= 0){
         this.contactDataSource = new MatTableDataSource(result);
         this.contactDataSource.sort = this.sort;
       }
       else if(result.ok == false){
         const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
       }
    });
  }

  deleteContact(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete Contact Confirmation", message: "Are you sure you want to delete this contact?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let contact = new RequestContact();
        contact.contact_id = element.contact_id;
        contact.request_id = this.request_id;
        this.requestService.deleteRequestContact(contact).subscribe(result => {
          if(result.length >= 0){
            this.contactDataSource = new MatTableDataSource(result);
            this.contactDataSource.sort = this.sort;
            this.updateSideTabCount('decrease');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  openAddContactDialog() {
    const dialogRef = this.dialog.open(AddContactDialog, {width: '600px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.requestService.addRequestContact(result, this.request_id).subscribe(result => {
          if(result.length >= 0){
            this.contactDataSource = new MatTableDataSource(result);
            this.contactDataSource.sort = this.sort;
            this.updateSideTabCount('increase');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  editContact(element:any){
    let contact = Object.assign({}, element);
    const dialogRef = this.dialog.open(NewContactDialog, {data: contact, width: '600px'});
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.requestService.editRequestContact(contact).subscribe(result => {
          if(result.length >= 0){
            this.contactDataSource = new MatTableDataSource(result);
            this.contactDataSource.sort = this.sort;
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
      this.sidetabs.find(item => item.sidetab_id == 4).sidetab_count++;
    if(action == "decrease")
      this.sidetabs.find(item => item.sidetab_id == 4).sidetab_count--;
  }

}
