import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ReturnedRequest } from '../../../classes/returnedrequest';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-all-request',
  templateUrl: './all-request.component.html',
  styleUrls: ['./all-request.component.css']
})
export class AllRequestComponent implements OnInit {
  searchCriteria: string;
  role_id:number;
  resultCount:string;
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
        });
      if(this.authService.currentUserRoles.some(role => role.role_id === 4)){
        this.role_id = 4; //Admin user has the privilege
      }
      else if (this.authService.currentUserRoles.some(role => role.role_id === 3)){
        this.role_id = 3; //Assigner role
      }
  }

  searchRequesterRequest(criteria:ReturnedRequest) {
      this.searchCriteria = JSON.stringify(criteria);
  }

  searchResultCount(count:number) {
    if(count > 1)
      this.resultCount = count + " results";
    else if(count <= 1)
      this.resultCount = count + " result";
  }

}
