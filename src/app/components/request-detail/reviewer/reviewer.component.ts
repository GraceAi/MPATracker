import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { User } from '../../../classes/domain';
import { RequestService } from '../../../services/request.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.css']
})
export class ReviewerComponent implements OnInit {
  displayedColumns: string[] = ['reviewer'];
  reviewerDataSource:any;
  availableReviewerDataSource:any;
  request_id:number;
  assignedReviewers:User[];
  filteredReviewers:User[];
  selectedAssignedReviewer:any;
  selectedAvailableReviewer:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.getRequestReviewers();
  }

  applyAssignedFilter(filterValue: string) {
    if(this.reviewerDataSource != null)
      this.reviewerDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {
    if(this.availableReviewerDataSource != null)
      this.availableReviewerDataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectAssignedReviewer(row:any){
    this.selectedAssignedReviewer = row;
  }

  onSelectAvailableReviewer(row:any){
    this.selectedAvailableReviewer = row;
  }

  addAssignedReviewer(){
    if(this.selectedAvailableReviewer){
      this.assignedReviewers.push(this.selectedAvailableReviewer);
      this.reviewerDataSource = new MatTableDataSource(this.assignedReviewers);
      this.filteredReviewers = this.filteredReviewers.filter(item => item.user_id != this.selectedAvailableReviewer.user_id);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);

      this.selectedAvailableReviewer = null;
    }

  }

  removeAssignedReviewer(){
    if(this.selectedAssignedReviewer){
      this.assignedReviewers = this.assignedReviewers.filter(f => f.user_id != this.selectedAssignedReviewer.user_id);
      this.reviewerDataSource = new MatTableDataSource(this.assignedReviewers);
      this.filteredReviewers.push(this.selectedAssignedReviewer);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);

      this.selectedAssignedReviewer = null;
    }
  }

  getRequestReviewers(){
    this.requestService.getRequestReviewers(this.request_id).subscribe(result => {
      this.filteredReviewers = this.authService.allReviewers;
      if(result.length > 0){
        this.filteredReviewers = this.authService.allReviewers.filter(function(obj) {
            return !result.some(function(obj2) {
                return obj.user_id == obj2.user_id;
            });
        });
      }
      this.assignedReviewers = result;
      this.reviewerDataSource = new MatTableDataSource(result);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);
    });
  }

  assignReviewers(){
    this.requestService.assignReviewers(this.request_id, this.assignedReviewers).subscribe(result => {
      if(result.length > 0){
        const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  cancelAssign(){
    this.getRequestReviewers();
  }

}
