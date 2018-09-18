import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Category, SideTab } from '../../../../classes/domain';
import { RequestService } from '../../../../services/request.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-admin-sidetabs',
  templateUrl: './admin-sidetabs.component.html',
  styleUrls: ['./admin-sidetabs.component.css']
})
export class AdminSidetabsComponent implements OnInit {
  displayedColumns: string[] = ['tabs'];
  assignedSidetabDataSource:any;
  availableSidetabDataSource:any;
  categories:Category[];
  selectedCategory:Category;
  assignedSidetabs:SideTab[];
  filteredSidetabs:SideTab[];
  selectedAssignedSidetab:any;
  selectedAvailableSidetab:any;

  constructor(private requestService: RequestService,
  private authService: AuthenticationService,
  public dialog: MatDialog) { }

  ngOnInit() {
    this.categories = this.authService.categories;
    this.selectedCategory = new Category();
    this.selectedCategory.category_name = "select...";
    this.availableSidetabDataSource = new MatTableDataSource(this.authService.allSidetabs);
  }

  onSelectAssignedSidetab(row:any){
    this.selectedAssignedSidetab = row;
  }

  onSelectAvailableSidetab(row:any){
    this.selectedAvailableSidetab = row;
  }

  addAssignedSidetab(){
    if(this.selectedAvailableSidetab){
      this.assignedSidetabs.push(this.selectedAvailableSidetab);
      this.assignedSidetabDataSource = new MatTableDataSource(this.assignedSidetabs);
      this.filteredSidetabs = this.filteredSidetabs.filter(item => item.sidetab_id != this.selectedAvailableSidetab.sidetab_id);
      this.availableSidetabDataSource = new MatTableDataSource(this.filteredSidetabs);

      this.selectedAvailableSidetab = null;
    }

  }

  removeAssignedSidetab(){
    if(this.selectedAssignedSidetab){
      this.assignedSidetabs = this.assignedSidetabs.filter(f => f.sidetab_id != this.selectedAssignedSidetab.sidetab_id);
      this.assignedSidetabDataSource = new MatTableDataSource(this.assignedSidetabs);
      this.filteredSidetabs.push(this.selectedAssignedSidetab);
      this.availableSidetabDataSource = new MatTableDataSource(this.filteredSidetabs);

      this.selectedAssignedSidetab = null;
    }
  }

  onChangeCategory(category:any){
    this.selectedCategory = category;
    this.getSidetabsByCategoryId(category.category_id);
  }

  getSidetabsByCategoryId(category_id:number){
    this.requestService.getSidetabsByCategory(category_id).subscribe(result => {
      this.filteredSidetabs = this.authService.allSidetabs;
      if(result.length > 0){
        this.filteredSidetabs = this.authService.allSidetabs.filter(function(obj) {
            return !result.some(function(obj2) {
                return obj.sidetab_id == obj2.sidetab_id;
            });
        });
      }
      this.assignedSidetabs = result;
      this.assignedSidetabDataSource = new MatTableDataSource(result);
      this.availableSidetabDataSource = new MatTableDataSource(this.filteredSidetabs);
    });
  }

  assignSidetabsByCategoryId(){
    this.requestService.assignSidetabsByCategoryId(this.selectedCategory.category_id, this.assignedSidetabs).subscribe(result => {
        if(result == "Success"){
          const dialogRef = this.dialog.open(NotificationDialog, { data: "Side-tabs are assigned successfully.", width: '600px'});
        }
        else if(result.ok == false){
          const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
        }
    });
  }

  cancelAssign(){
    //location.reload();
  }

}
