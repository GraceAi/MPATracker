import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  hideRequestReportTab:boolean = true;
  hideAdminTab:boolean = true;
  hideAssignerTab:boolean = true;
  hideReviewerTab:boolean = true;
  hideRequesterTab:boolean = true;
  hideProjectAdminTab:boolean = true;
  hideProjectManagerTab:boolean = true;
  hideProjectReportTab:boolean = true;
  constructor(private authService: AuthenticationService,
    private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
        });
    this.setLayout();
  }

  setLayout(){
    if(this.authService.currentUserRoles.some(role => role.role_id === 1)){
      this.hideRequesterTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 2)){
      this.hideReviewerTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 3)){
      this.hideAssignerTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 4)){
      this.hideAdminTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 5)){
      this.hideRequestReportTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 6)){
      this.hideProjectManagerTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 7)){
      this.hideProjectAdminTab = false;
    }
    if(this.authService.currentUserRoles.some(role => role.role_id === 8)){
      this.hideProjectReportTab = false;
    }
  }

}
