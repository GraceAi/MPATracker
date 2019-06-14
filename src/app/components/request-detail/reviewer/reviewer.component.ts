import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';

import { RequestDetail } from '../../../classes/request';
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
  status_id:number;
  assignedReviewers:User[];
  origAssignedReviewers:User[];
  filteredReviewers:User[];
  selectedAssignedReviewer:any;
  selectedAvailableReviewer:any;
  hide:boolean = false;
  sidetabs:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private requestService: RequestService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.request_id = +this.route.parent.snapshot.paramMap.get('requestId');
    this.getRequestReviewers();
    this.route.parent.data.subscribe((data: { requestDetail: RequestDetail }) => {
          this.status_id = data.requestDetail.generalInfo.status_id;
          this.setLayout();
    });
    this.authService.sidetabData.subscribe(data => { this.sidetabs = data; });
  }

  setLayout(){
    if(this.status_id == 4){
      this.hide = true;
    }
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
      this.origAssignedReviewers = result.map(x => Object.assign({}, x));//Object.assign({}, result);
      this.reviewerDataSource = new MatTableDataSource(result);
      this.availableReviewerDataSource = new MatTableDataSource(this.filteredReviewers);
    });
  }

  assignReviewers(){
    this.requestService.assignReviewers(this.request_id, this.assignedReviewers).subscribe(result => {
      if(result.length > 0){
        this.origAssignedReviewers =  this.assignedReviewers.map(x => Object.assign({}, x));//Object.assign({}, this.info);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
        this.updateSideTabCount(this.origAssignedReviewers.length);
        //const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  cancelAssign(){
    this.getRequestReviewers();
  }

  updateSideTabCount(count:number){
      this.sidetabs.find(item => item.sidetab_id == 6).sidetab_count = count;
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if reviewers are unchanged
    if (JSON.stringify(this.origAssignedReviewers) === JSON.stringify(this.assignedReviewers)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
