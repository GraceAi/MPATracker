import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Project } from '../../../classes/project';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProjectService } from '../../../services/project.service';
import { NewProjectDialog } from '../../../components/modals/dialog-newproject/dialog-newproject';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.css']
})
export class AdminProjectComponent implements OnInit{
  resultCount:string;
  role_id:number = 7;
  constructor(private authService: AuthenticationService,
              private projectService: ProjectService,
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
        });
    this.authService.setProjectFilter(new Project());
  }

  openNewProjectDialog(){
    const dialogRef = this.dialog.open(NewProjectDialog, { data: {users: this.authService.allUsers, firms: this.authService.firms }, width: '635px'});

    dialogRef.afterClosed().subscribe(result => {
      if(result.project_number){
        document.querySelector("body").style.cssText = "cursor: wait";
        this.projectService.createNewProject(result).subscribe(res => {
          document.querySelector("body").style.cssText = "cursor: auto";
          if(res.ok == false){
            const dialogRef = this.dialog.open(NotificationDialog, { data: "Error: " + res.message, width: '600px'});
          }
          if(res > 0)
            this.router.navigate(['/project/' + res + '/role/' + this.role_id]);
        });
      }
    });
  }

  searchResultCount(count:number) {
    if(count > 1)
      this.resultCount = count + " results";
    else if(count <= 1)
      this.resultCount = count + " result";
  }

}
