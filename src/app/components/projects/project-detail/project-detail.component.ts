import { Component, OnInit, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MatSidenavModule} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { Project } from '../../../classes/project';
import { SideTab } from '../../../classes/domain';
import { ProjectService } from '../../../services/project.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ConfirmationDialog } from '../../../components/modals/dialog-confirmation/dialog-confirmation';
import { NotificationDialog } from '../../../components/modals/dialog-notification/dialog-notification';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  role_id:number;
  componentRef:any;
  constructor(private router: Router,
   private route: ActivatedRoute,
   private projectService: ProjectService,
   private authService: AuthenticationService,
   private toastr: ToastrService,
   public dialog: MatDialog) { }

  ngOnInit() {
    this.role_id = +this.route.snapshot.paramMap.get('roleId');
  }

  closeProject(){
    this.toHomePage();
  }
  toHomePage(){
    if(this.role_id == 6)
      this.router.navigate(['/home/tab/8']);
    else if(this.role_id == 7)
      this.router.navigate(['/home/tab/7']);
  }
  onActivate(componentRef){
    this.componentRef = componentRef; //to access child component: project general component
  }

}
