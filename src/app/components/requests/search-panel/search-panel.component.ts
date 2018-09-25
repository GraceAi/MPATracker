import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
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
  searchCriteria = new ReturnedRequest();
  categories:Category[];
  statuses:Status[];
  departments:Department[];
  locations:Location[];
  requesters:User[];
  selectedCategory:string = "All";
  selectedStatus:string = "All";
  selectedDept:string = "All";
  selectedLocation:string = "All";
  selectedRequester:string = "All";
  panelOpenState = false;
  calendarIconPath:string;

  constructor(private authService: AuthenticationService) { }
  ngOnInit() {
    this.calendarIconPath = this.authService.calendarIconPath;
    this.getDomains();
  }

  getDomains()
  {
    this.statuses = this.authService.statuses;
    this.categories = this.authService.categories;
    this.departments = this.authService.departments;
    this.locations = this.authService.locations;
    this.requesters = this.authService.requesters;
  }

  onChangeCategory(category:Category){
    if(category == null){
      this.selectedCategory = "All";
      this.searchCriteria.category_code = null;
    }
    else {
      this.selectedCategory = category.category_code;
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
    this.searchCriteria = new ReturnedRequest();
    this.selectedCategory = "All";
    this.selectedLocation = "All";
    this.selectedStatus = "All";
    this.selectedDept = "All";
    this.selectedRequester = "All";
    this.searchRequest.emit(this.searchCriteria);
  }

}
