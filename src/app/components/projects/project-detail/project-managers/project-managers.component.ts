import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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
  assignedManagers:User[];
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
      this.assignedManagers.push(this.selectedAvailableManager);
      this.managerDataSource = new MatTableDataSource(this.assignedManagers);
      this.filteredManagers = this.filteredManagers.filter(item => item.user_id != this.selectedAvailableManager.user_id);
      this.availableManagerDataSource = new MatTableDataSource(this.filteredManagers);

      this.selectedAvailableManager = null;
    }

  }

  removeAssignedManager(){
    if(this.selectedAssignedManager){
      this.assignedManagers = this.assignedManagers.filter(f => f.user_id != this.selectedAssignedManager.user_id);
      this.managerDataSource = new MatTableDataSource(this.assignedManagers);
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
      this.assignedManagers = result;
      this.managerDataSource = new MatTableDataSource(result);
      this.availableManagerDataSource = new MatTableDataSource(this.filteredManagers);
    });
  }

  assignManagers(){
    this.projectService.assignManagers(this.project_id, this.assignedManagers).subscribe(result => {
      console.log(result);
      if(result == true){
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

}
