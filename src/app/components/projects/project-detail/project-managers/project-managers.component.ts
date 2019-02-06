import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../../../classes/domain';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { NotificationDialog } from '../../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-project-managers',
  templateUrl: './project-managers.component.html',
  styleUrls: ['./project-managers.component.css']
})
export class ProjectManagersComponent implements OnInit {
  displayedColumns: string[] = ['manager'];
  managerDataSource:any;
  availableManagerDataSource:any;
  project_id:number;
  info:User[];
  origInfo:User[];
  filteredManagers:User[];
  selectedAssignedManager:any;
  selectedAvailableManager:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.project_id = +this.route.parent.snapshot.paramMap.get('projectId');
    this.getProjectManagers();
  }
  applyAssignedFilter(filterValue: string) {
    if(this.managerDataSource != null)
      this.managerDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {
    if(this.availableManagerDataSource != null)
      this.availableManagerDataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelectAssignedManager(row:any){
    this.selectedAssignedManager = row;
  }

  onSelectAvailableManager(row:any){
    this.selectedAvailableManager = row;
  }

  addAssignedManager(){
    if(this.selectedAvailableManager){
      this.info.push(this.selectedAvailableManager);
      this.managerDataSource = new MatTableDataSource(this.info);
      this.filteredManagers = this.filteredManagers.filter(item => item.user_id != this.selectedAvailableManager.user_id);
      this.availableManagerDataSource = new MatTableDataSource(this.filteredManagers);

      this.selectedAvailableManager = null;
    }

  }

  removeAssignedManager(){
    if(this.selectedAssignedManager){
      this.info = this.info.filter(f => f.user_id != this.selectedAssignedManager.user_id);
      this.managerDataSource = new MatTableDataSource(this.info);
      this.filteredManagers.push(this.selectedAssignedManager);
      this.availableManagerDataSource = new MatTableDataSource(this.filteredManagers);

      this.selectedAssignedManager = null;
    }
  }

  getProjectManagers(){
    this.projectService.getProjectManagers(this.project_id).subscribe(result => {
      this.filteredManagers = this.authService.allManagers;
      if(result.length > 0){
        this.filteredManagers = this.authService.allManagers.filter(function(obj) {
            return !result.some(function(obj2) {
                return obj.user_id == obj2.user_id;
            });
        });
      }
      this.info = result;
      this.origInfo =  result.map(x => Object.assign({}, x));//Object.assign({}, result);
      this.managerDataSource = new MatTableDataSource(result);
      this.availableManagerDataSource = new MatTableDataSource(this.filteredManagers);
    });
  }

  assignManagers(){
    this.projectService.assignManagers(this.project_id, this.info).subscribe(result => {
      //console.log(result);
      if(result == true){
        this.origInfo =  this.info.map(x => Object.assign({}, x));//Object.assign({}, this.info);
        this.toastr.success('', 'Changes Saved', {timeOut: 3000});
        //const dialogRef = this.dialog.open(NotificationDialog, { data: result, width: '600px'});
      }
      else if(result.ok == false){
        const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + result.message, width: '600px'});
      }
    });
  }

  cancelAssign(){
    this.getProjectManagers();
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if pm is unchanged
    if (JSON.stringify(this.origInfo) === JSON.stringify(this.info)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    return of(confirmation);
  }

}
