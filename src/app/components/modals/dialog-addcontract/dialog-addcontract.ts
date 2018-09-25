import { Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RequestContract } from '../../../classes/request';

@Component({
  selector: 'dialog-addcontract',
  templateUrl: './dialog-addcontract.html',
})
export class AddContractDialog {
  contract_no:string;
  contracts:any = [];
  constructor(
    public dialogRef: MatDialogRef<AddContractDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      for(let contract of data.contracts){
        this.contracts.push(contract.contract_no);
      }
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
