import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestDocument, RequestDetail } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AddDocumentDialog } from '../../../components/modals/dialog-adddoc/dialog-adddoc';
import { ConfirmationDialog } from '../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  displayedColumns: string[] = ['export', 'name', 'description', 'user', 'date'];
  documents:RequestDocument[];
  documentDataSource:any;
  request_id:number;
  role_id:number;
  sequence_id:string;
  status_id:number;
  hide:boolean = true;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) {}

  ngOnInit() {
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestDocuments();

    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.sequence_id = data.requestDetail.generalInfo.sequence_id;
          this.status_id = data.requestDetail.generalInfo.status_id;
        });
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });
  }

  setLayout(unlocked:boolean){
    if(this.role_id == 1){
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

  getRequestDocuments(){
    this.requestService.getRequestDocuments(this.request_id).subscribe(result => {
      if(result.length >= 0){
        this.documents = result;
        this.documentDataSource = new MatTableDataSource(result);
        this.documentDataSource.sort = this.sort;
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }

    });
  }

  downloadDocument(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Download Document Confirmation", message: "Are you sure you want to download this document?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        document.querySelector("body").style.cssText = "cursor: wait";
        let doc = new RequestDocument();
        doc.document_id = element.document_id;
        doc.name = element.name;
        doc.request_id = this.request_id;
        this.requestService.downloadRequestDocument(doc, this.sequence_id).subscribe(result => {
          var blob = new Blob([<any>result], {type: <any>result.type});
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = element.name;
          link.click();
          document.querySelector("body").style.cssText = "cursor: auto";
        });
      }
    });
  }

  deleteDocument(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete Document Confirmation", message: "Are you sure you want to delete this document?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        let doc = new RequestDocument();
        doc.document_id = element.document_id;
        doc.name = element.name;
        doc.request_id = this.request_id;
        this.requestService.deleteRequestDocument(doc, this.sequence_id).subscribe(result => {
          if(result.length >= 0){
            this.documents =result;
            this.documentDataSource = new MatTableDataSource(result);
            this.documentDataSource.sort = this.sort;
            document.querySelector("body").style.cssText = "cursor: auto";
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            document.querySelector("body").style.cssText = "cursor: auto";
          }
        });
      }
    });
  }
  editDocument(element:any){
    const dialogRef = this.dialog.open(AddDocumentDialog, {data: {'name': element.name, 'description':element.description}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        let doc = new RequestDocument();
        doc.description = result.description;
        doc.request_id = this.request_id;
        doc.document_id = element.document_id;
        this.requestService.updateRequestDocument(doc).subscribe(result => {
          if(result.length >= 0){
            this.documents =result;
            this.documentDataSource = new MatTableDataSource(result);
            this.documentDataSource.sort = this.sort;
            document.querySelector("body").style.cssText = "cursor: auto";
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            document.querySelector("body").style.cssText = "cursor: auto";
          }
        });
      }
    });
  }
  openAddDocDialog(){
    const dialogRef = this.dialog.open(AddDocumentDialog, {width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result){
        document.querySelector("body").style.cssText = "cursor: wait";
        let newDoc = new RequestDocument();
        newDoc.request_id = this.request_id;
        newDoc.description = result.description;
        newDoc.name = result.filecontent.name;
        this.requestService.addRequestDocument(result.filecontent, newDoc, this.sequence_id).subscribe(result => {
          document.querySelector("body").style.cssText = "cursor: auto";
          if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
          else if(result != null) {
            this.documents.push(result);
            this.documentDataSource = new MatTableDataSource(this.documents);
            this.documentDataSource.sort = this.sort;
          }
        });
      }
    });
  }

}
