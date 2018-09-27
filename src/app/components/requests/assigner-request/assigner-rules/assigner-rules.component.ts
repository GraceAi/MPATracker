import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { User, Category } from '../../../../classes/domain';
import { RequestService } from '../../../../services/request.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-assigner-rules',
  templateUrl: './assigner-rules.component.html',
  styleUrls: ['./assigner-rules.component.css']
})
export class AssignerRulesComponent implements OnInit {
  selectedCategory: Category;
  categories:Category[];
  displayedColumns: string[] = ['reviewer'];
  autoAssignedReviewerDataSource:any;
  availableReviewerDataSource:any;
  autoAssignedReviewers:User[];//RequestReviewer[];
  filteredReviewers:User[];
  selectedAutoAssignedReviewer:any;
  selectedAvailableReviewer:any;
  constructor(private requestService: RequestService,
              private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.categories = this.authService.categories;
    this.selectedCategory = new Category();
    this.selectedCategory.category_name = "Select...";
    this.availableReviewerDataSource = new MatTableDataSource(this.authService.allReviewers);
  }

  onSelectAutoAssignedReviewer(row:any){
    this.selectedAutoAssignedReviewer = row;
  }

  onSelectAvailableReviewer(row:any){
    this.selectedAvailableReviewer = row;
  }

  addAutoAssignedReviewer(){
    if(this.selectedAvailableReviewer){
      this.autoAssignedReviewers.push(this.selectedAvailableReviewer);
      this.autoAssignedReviewerDataSource = new MatTableDataSource(this.autoAssignedReviewers);
      this.filteredReviewers = this.filteredReviewers.filter(item => item.user_id != this.selectedAvailableReviewer.user_id);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);

      this.selectedAvailableReviewer = null;
      //this.autoAssignedReviewerDataSource.sort = this.sort;
    }

  }

  removeAutoAssignedReviewer(){
    if(this.selectedAutoAssignedReviewer){
      this.autoAssignedReviewers = this.autoAssignedReviewers.filter(f => f.user_id != this.selectedAutoAssignedReviewer.user_id);
      this.autoAssignedReviewerDataSource = new MatTableDataSource(this.autoAssignedReviewers);
      this.filteredReviewers.push(this.selectedAutoAssignedReviewer);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);

      this.selectedAutoAssignedReviewer = null;
      //this.autoAssignedReviewerDataSource.sort = this.sort;
    }
  }

  onChangeCategory(category:Category){
    this.selectedCategory = category;
    this.getAutoAssignedReviewersByCatId(category.category_id);
  }

  getAutoAssignedReviewersByCatId(cat_id:number){
    this.requestService.getAutoAssignedReviewersByCatId(cat_id).subscribe(result => {
      this.filteredReviewers = this.authService.allReviewers;
      if(result.length > 0){
        //this.filteredReviewers = this.authService.allReviewers.filter(item => result.some(f => item.user_id !== f.user_id));
        this.filteredReviewers = this.authService.allReviewers.filter(function(obj) {
            return !result.some(function(obj2) {
                return obj.user_id == obj2.user_id;
            });
        });
      }
      this.autoAssignedReviewers = result;
      this.autoAssignedReviewerDataSource = new MatTableDataSource(result);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);
      //this.autoAssignedReviewerDataSource.sort = this.sort;
    });
  }

  autoAssignReviewersByCatId(){
    this.requestService.autoAssignReviewersByCatId(this.selectedCategory.category_id, this.autoAssignedReviewers).subscribe(result => {
      if(result.length > 0){
        const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
      }
      else if(!result.ok){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  cancelAssign(){
    if(this.selectedCategory.category_id != null)
      this.getAutoAssignedReviewersByCatId(this.selectedCategory.category_id);
  }

}
