import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource , MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { DomainService } from '../../../../services/domain.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { RequestService } from '../../../../services/request.service';
import { AddReqDeptDialog } from '../../../../components/modals/dialog-addreqdept/dialog-addreqdept';
import { ConfirmationDialog } from '../../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-admin-req-dept',
  templateUrl: './admin-req-dept.component.html',
  styleUrls: ['./admin-req-dept.component.css']
})
export class AdminReqDeptComponent implements OnInit {
  reqDeptDataSource:any;
  columns: string[] = ['name', 'visibility', 'delete'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(private domainService: DomainService,
    private authService: AuthenticationService,
    private requestService: RequestService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.reqDeptDataSource = new MatTableDataSource(this.authService.departments);
    this.reqDeptDataSource.sort = this.sort;
  }

  openAddReqDeptDialog() {
    const dialogRef = this.dialog.open(AddReqDeptDialog, {width: '600px'});

    dialogRef.afterClosed().subscribe(dept => {
      if(dept.deptmt_name != null && dept.deptmt_name.trim().length > 0){
        this.requestService.addRequesterDept(dept.deptmt_name, dept.deptmt_visibility).subscribe(result => {
          if(result.length >= 0){
            this.authService.departments = result;
            this.reqDeptDataSource = new MatTableDataSource(result);
            this.reqDeptDataSource.sort = this.sort;
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }
  deleteReqDept(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete Requester Dept Confirmation", message: "Are you sure you want to delete this requester department?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.requestService.deleteRequesterDept(element.deptmt_id).subscribe(result => {
          if(result.length >= 0){
            this.authService.departments = result;
            this.reqDeptDataSource = new MatTableDataSource(result);
            this.reqDeptDataSource.sort = this.sort;
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }
}
