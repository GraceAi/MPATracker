import { Component, OnInit } from '@angular/core';

import {RequestService} from '../../../../services/request.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {ReturnedRequest} from '../../../../classes/returnedrequest';
import { Category, User, Department } from '../../../../classes/domain';
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
  departments:Department[];
  selectedCategory:string = "All";
  selectedRequester:string = "All";
  selectedReviewer:string = "All";
  selectedDept:string = "All";
  calendarIconPath:string;
  constructor(private requestService: RequestService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.calendarIconPath = this.authService.calendarIconPath;
    this.categories = this.authService.categories;
    this.requesters = this.authService.requesters;
    this.reviewers = this.authService.allReviewers;
    this.departments = this.authService.departments;
    this.authService.reportFilter.subscribe(
      filter => {
        if(filter!= null){
          this.searchCriteria = filter;
          if(filter.category_name != null)
            this.selectedCategory = filter.category_name;
          if(filter.requestor_name != null)
            this.selectedRequester = filter.requestor_name;
          if(filter.reviewer_name != null)
            this.selectedReviewer = filter.reviewer_name;
          if(filter.deptmt_name != null)
            this.selectedDept = filter.deptmt_name;
        }
      }
    );
  }

  onChangeCategory(category:Category){
    if(category == null){
      this.selectedCategory = "All";
      this.searchCriteria.cat_id = null;
      //this.searchCriteria.category_code = null;
      this.searchCriteria.category_name = null;
    }
    else {
      this.selectedCategory = category.category_name;
      this.searchCriteria.cat_id = category.category_id;
      //this.searchCriteria.category_code = category.category_code;
      this.searchCriteria.category_name = category.category_name;
    }
  }

  onChangeRequester(requester:User){
    if(requester == null){
      this.selectedRequester = "All";
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
      this.selectedReviewer = "All";
      this.searchCriteria.reviewer_name = null;
      this.searchCriteria.reviewer_id = null;
    }
    else{
      this.selectedReviewer = reviewer.fname + " " + reviewer.lname;
      this.searchCriteria.reviewer_name = this.selectedReviewer;
      this.searchCriteria.reviewer_id = reviewer.user_id;
    }
  }

  onChangeDept(dept:Department){
    if(dept == null){
      this.selectedDept = "All";
      this.searchCriteria.deptmt_name = null;
      this.searchCriteria.deptmt_id = null;
    }
    else{
      this.selectedDept = dept.deptmt_name;
      this.searchCriteria.deptmt_id = dept.deptmt_id;
      this.searchCriteria.deptmt_name = dept.deptmt_name;
    }
  }

  generateReport(){
    if(this.searchCriteria.create_date_start == null)
      this.searchCriteria.start_date = null;
    else
      //this.searchCriteria.start_date = new Date(this.searchCriteria.create_date_start.year, this.searchCriteria.create_date_start.month - 1, this.searchCriteria.create_date_start.day).setHours(0, 0, 0, 0);
      this.searchCriteria.start_date = this.searchCriteria.create_date_start.year + "-" +  this.searchCriteria.create_date_start.month + "-" +  this.searchCriteria.create_date_start.day;
    if(this.searchCriteria.create_date_end == null)
        this.searchCriteria.end_date = null;
    else
      //this.searchCriteria.end_date = new Date(this.searchCriteria.create_date_end.year, this.searchCriteria.create_date_end.month - 1, this.searchCriteria.create_date_end.day).setHours(0, 0, 0, 0);
      this.searchCriteria.end_date = this.searchCriteria.create_date_end.year + "-" + this.searchCriteria.create_date_end.month + "-" + this.searchCriteria.create_date_end.day;
    this.authService.setReportFilter(this.searchCriteria);
  }

  resetFilter(){
    this.searchCriteria = new ReportFilter();
    this.selectedCategory = "All";
    this.selectedRequester = "All";
    this.selectedReviewer = "All";
    this.selectedDept = "All";
    this.authService.setReportFilter(this.searchCriteria);
  }

}
