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
  searchCriteria: ReturnedRequest;
  role_id:number = 3;
  resultCount:string;
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          console.log(data.title);
          this.authService.setTitle(data.title);
        });
  }

  searchRequesterRequest(criteria:ReturnedRequest) {
      this.searchCriteria = criteria;
  }

  searchResultCount(count:number) {
    if(count > 1)
      this.resultCount = count + " results";
    else if(count <= 1)
      this.resultCount = count + " result";
  }

}
