import { Component, OnInit } from '@angular/core';

import {RequestService} from '../../../../services/request.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ReturnedRequest} from '../../../../classes/returnedrequest';
import { Category, User } from '../../../../classes/domain';
import { ReportData, ReportFilter } from '../../../../classes/report';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  reportData:any = [];
  chartData:any = [];
  chartColor:any =[];
  chartLabel:any =[];
  searchCriteria = new ReportFilter();
  categories:Category[];
  requesters:User[];
  reviewers:User[];
  selectedCategory:string = "Select...";
  selectedRequester:string = "Select...";
  selectedReviewer:string = "Select...";
  private calendaIconPath = "./assets/img/calendar-icon.svg";
  constructor(private requestService: RequestService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.categories = this.authService.categories;
    this.requesters = this.authService.requesters;
    this.reviewers = this.authService.allReviewers;
    this.authService.reportFilter.subscribe(
      filter => {
        this.searchCriteria = filter;
        if(filter.category_code != null)
          this.selectedCategory = filter.category_code;
        if(filter.requestor_name != null)
          this.selectedRequester = filter.requestor_name;
        if(filter.reviewer_name != null)
          this.selectedReviewer = filter.reviewer_name;
      }
    );
  }

  onChangeCategory(category:Category){
    if(category == null){
      this.selectedCategory = "Select...";
      this.searchCriteria.cat_id = null;
      this.searchCriteria.category_code = null;
    }
    else {
      this.selectedCategory = category.category_code;
      this.searchCriteria.cat_id = category.category_id;
      this.searchCriteria.category_code = category.category_code;
    }
  }

  onChangeRequester(requester:User){
    if(requester == null){
      this.selectedRequester = "Select...";
      this.searchCriteria.requestor_id = null;
      this.searchCriteria.requestor_name = null;
    }
    else{
      this.selectedRequester = requester.fname + " " + requester.lname;
      this.searchCriteria.requestor_id = requester.user_id;
      this.searchCriteria.requestor_name = this.selectedRequester;
    }
  }

  onChangeReviewer(reviewer:User){
    if(reviewer == null){
      this.selectedReviewer = "Select...";
      this.searchCriteria.reviewer_name = null;
      this.searchCriteria.reviewer_id = null;
    }
    else{
      this.selectedReviewer = reviewer.fname + " " + reviewer.lname;
      this.searchCriteria.reviewer_name = this.selectedReviewer;
      this.searchCriteria.reviewer_id = reviewer.user_id;
    }
  }

  generateReport(){
    if(this.searchCriteria.create_date_start != null)
      this.searchCriteria.start_date = new Date(this.searchCriteria.create_date_start.year, this.searchCriteria.create_date_start.month - 1, this.searchCriteria.create_date_start.day);
    if(this.searchCriteria.create_date_end != null)
      this.searchCriteria.end_date = new Date(this.searchCriteria.create_date_end.year, this.searchCriteria.create_date_end.month - 1, this.searchCriteria.create_date_end.day);
    this.authService.setReportFilter(this.searchCriteria);
  }

  resetFilter(){
    this.searchCriteria = new ReportFilter();
    this.selectedCategory = "Select...";
    this.selectedRequester = "Select...";
    this.selectedReviewer = "Select...";
  }

}
