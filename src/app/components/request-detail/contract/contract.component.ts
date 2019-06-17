import { Component, OnInit ,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RequestDetail, RequestContract } from '../../../classes/request';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AddContractDialog } from '../../../components/modals/dialog-addcontract/dialog-addcontract';
import { ConfirmationDialog } from '../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  displayedColumns: string[] = ['contract_no'];
  contractDataSource:any;
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
   public dialog: MatDialog) {}

  ngOnInit() {
    this.canEdit = this.route.snapshot.queryParams["canEdit"] == "true";
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.role_id = +this.route.parent.snapshot.paramMap.get('roleId');
    this.getRequestContracts();
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
        });
    this.authService.unlocked.subscribe(unlocked => { this.setLayout(unlocked); });
    this.authService.sidetabData.subscribe(data => { this.sidetabs = data; });
  }

  setLayout(unlocked:boolean){
    if(this.role_id == 1 && this.canEdit){
      if(this.status_id == 1 || unlocked){
        this.hide = false;
        this.displayedColumns.push('delete');
      }
    }
    else if(this.role_id == 2){
      if(this.status_id == 2 || this.status_id == 3){
        this.hide = false;
        this.displayedColumns.push('delete');
      }
    }

  }

  getRequestContracts(){
    this.requestService.getRequestContracts(this.request_id).subscribe(result => {
      if(result.length >= 0){
        this.contractDataSource = new MatTableDataSource(result);
        this.contractDataSource.sort = this.sort;
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  deleteContract(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialog, { data: {title: "Delete Confirmation", message: "Are you sure you want to delete this contract number?"}, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let contract = new RequestContract();
        contract.contract_no = element.contract_no;
        contract.request_id = element.request_id;
        this.requestService.deleteRequestContract(contract).subscribe(result => {
          if(result.length >= 0){
            this.contractDataSource = new MatTableDataSource(result);
            this.contractDataSource.sort = this.sort;
            this.updateSideTabCount('decrease');
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

  openNewContractDialog() {
    const dialogRef = this.dialog.open(AddContractDialog,  {data: { contracts: this.contractDataSource.data }, width: '500px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let new_contract = new RequestContract();
        new_contract.contract_no = result;
        new_contract.request_id = this.request_id;
        this.requestService.addRequestContract(new_contract).subscribe(result => {
          if(result.length >= 0){
            this.contractDataSource = new MatTableDataSource(result);
            this.contractDataSource.sort = this.sort;
            this.updateSideTabCount('increase');
          }
          else if(result.ok == false){
            //const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            if(result.error.ExceptionMessage.includes("unique constraint")){
              const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: contract number already exists in this request", width: '600px'});
            }
            else {
              const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
            }
          }
        });
      }
    });
  }

  updateSideTabCount(action:string){
    if(action == "increase")
      this.sidetabs.find(item => item.sidetab_id == 5).sidetab_count++;
    if(action == "decrease")
      this.sidetabs.find(item => item.sidetab_id == 5).sidetab_count--;
  }
}
