import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ReturnedRequest } from '../../../classes/returnedrequest';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-reviewer-request',
  templateUrl: './reviewer-request.component.html',
  styleUrls: ['./reviewer-request.component.css']
})
export class ReviewerRequestComponent implements OnInit {
  searchCriteria: ReturnedRequest;
  role_id:number = 2;
  resultCount:string;
  constructor(private router: Router,
          private route: ActivatedRoute,
          private authService: AuthenticationService) { }
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
