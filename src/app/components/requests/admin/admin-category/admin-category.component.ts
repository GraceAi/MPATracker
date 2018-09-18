import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatSort, MatTableDataSource , MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { AuthenticationService } from '../../../../services/authentication.service';
import { RequestService } from '../../../../services/request.service';
import { AddCategoryDialog } from '../../../../components/modals/dialog-addcategory/dialog-addcategory';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent implements OnInit {
  categoryDataSource:any;
  columns: string[] = ['name', 'code', 'due_date', 'edit'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(private authService: AuthenticationService,
    private requestService: RequestService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.categoryDataSource = new MatTableDataSource(this.authService.categories);
    this.categoryDataSource.sort = this.sort;
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(AddCategoryDialog, {width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result.category_name!= null && result.category_code!= null && result.max_request_days!= null){
        this.requestService.addCategory(result).subscribe(result => {
          if(result.length >= 0){
            this.categoryDataSource = new MatTableDataSource(result);
            this.categoryDataSource.sort = this.sort;
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }
  editCategory(element:any){
    let cat = Object.assign({}, element);
    const dialogRef = this.dialog.open(AddCategoryDialog, {data: cat, width: '600px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result.category_name!= null && result.category_code!= null && result.max_request_days!= null){
        this.requestService.editCategory(result).subscribe(result => {
          if(result.length >= 0){
            this.categoryDataSource = new MatTableDataSource(result);
            this.categoryDataSource.sort = this.sort;
          }
          else if(result.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
          }
        });
      }
    });
  }

}
