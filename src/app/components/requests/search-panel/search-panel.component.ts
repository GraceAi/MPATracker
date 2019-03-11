import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatExpansionModule} from '@angular/material';

import {AuthenticationService} from '../../../services/authentication.service';
import {ReturnedRequest} from '../../../classes/returnedrequest';
import { Status, Department, Category, Location, User } from '../../../classes/domain';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit {
  @Output() searchRequest = new EventEmitter<ReturnedRequest>();
  searchCriteria:any;
  categories:Category[];
  statuses:Status[];
  departments:Department[];
  locations:Location[];
  requesters:User[];
  selectedCategory:string;
  selectedStatus:string;
  selectedDept:string;
  selectedLocation:string;
  selectedRequester:string ;
  panelOpenState = false;
  calendarIconPath:string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthenticationService) { }
  ngOnInit() {
    this.calendarIconPath = this.authService.calendarIconPath;
    this.getDomains();
    this.setDefaultFilter();
  }

  getDomains()
  {
    this.statuses = this.authService.statuses;
    this.categories = this.authService.categories;
    this.departments = this.authService.departments;
    this.locations = this.authService.locations;
    this.requesters = this.authService.requesters;
  }

  setDefaultFilter(){
    if(this.router.url.includes("tab")){
      let tab_id = +this.router.url.slice(-1);

      this.searchCriteria = new ReturnedRequest();
      this.selectedCategory = "All";
      this.selectedLocation = "All";
      this.selectedDept = "All";
      this.selectedRequester = "All";

      if(tab_id == 1){//requester tab display all requests
        this.selectedStatus = "All";
      }
      if(tab_id == 2){//reviewer tab display assigned requests
        let status = this.authService.statuses.find(status => status.status_id == 3);
        this.selectedStatus = status.status_desc;
        this.searchCriteria.status_id = status.status_id;
      }
      else if(tab_id == 5){//assigner tab display submitted requests and assigned requests
        this.selectedStatus = "All";
        /*let status = this.authService.statuses.find(status => status.status_id == 2);
        this.selectedStatus = status.status_desc;
        this.searchCriteria.status_id = status.status_id;*/
      }
      this.searchRequest.emit(this.searchCriteria);
    }
  }

  onChangeCategory(category:Category){
    if(category == null){
      this.selectedCategory = "All";
      this.searchCriteria.category_code = null;
    }
    else {
      this.selectedCategory = category.category_name;
      this.searchCriteria.category_code = category.category_code;
    }
  }
  onChangeStatus(status:Status){
    if(status == null){
      this.selectedStatus = "All";
      this.searchCriteria.status_id = null;
    }
    else {
      this.selectedStatus = status.status_desc;
      this.searchCriteria.status_id = status.status_id;
    }

  }
  onChangeDept(dept:Department){
    if(dept == null){
      this.selectedDept = "All";
      this.searchCriteria.deptmt_id = null;
    }
    else{
      this.selectedDept = dept.deptmt_name;
      this.searchCriteria.deptmt_id = dept.deptmt_id;
    }
  }
  onChangeLocation(loc:Location){
    if(loc == null){
      this.selectedLocation = "All";
      this.searchCriteria.location_id = null;
    }
    else{
      this.selectedLocation = loc.location_name;
      this.searchCriteria.location_id = loc.location_id;
    }
  }
  onChangeRequester(requester:User){
    if(requester == null){
      this.selectedRequester = "All";
      this.searchCriteria.requestor_id = null;
    }
    else{
      this.selectedRequester = requester.fname + " " + requester.lname;
      this.searchCriteria.requestor_id = requester.user_id;
    }
  }
  searchRequests(){
    this.searchRequest.emit(this.searchCriteria);
  }
  resetSearch(){
    this.setDefaultFilter();
  }

}
