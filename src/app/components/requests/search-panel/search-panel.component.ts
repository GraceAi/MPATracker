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
  selectedCategory:string = "Select...";
  selectedStatus:string = "Select...";
  selectedDept:string = "Select...";
  selectedLocation:string = "Select...";
  selectedRequester:string = "Select...";
  panelOpenState = false;
  private calendaIconPath = "./assets/img/calendar-icon.svg";

  constructor(private authService: AuthenticationService) { }
  ngOnInit() {
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
      this.selectedCategory = "Select...";
      this.searchCriteria.category_code = null;
    }
    else {
      this.selectedCategory = category.category_code;
      this.searchCriteria.category_code = category.category_code;
    }
  }
  onChangeStatus(status:Status){
    if(status == null){
      this.selectedStatus = "Select...";
      this.searchCriteria.status_id = null;
    }
    else {
      this.selectedStatus = status.status_desc;
      this.searchCriteria.status_id = status.status_id;
    }

  }
  onChangeDept(dept:Department){
    if(dept == null){
      this.selectedDept = "Select...";
      this.searchCriteria.deptmt_id = null;
    }
    else{
      this.selectedDept = dept.deptmt_name;
      this.searchCriteria.deptmt_id = dept.deptmt_id;
    }
  }
  onChangeLocation(loc:Location){
    if(loc == null){
      this.selectedLocation = "Select...";
      this.searchCriteria.location_id = null;
    }
    else{
      this.selectedLocation = loc.location_name;
      this.searchCriteria.location_id = loc.location_id;
    }
  }
  onChangeRequester(requester:User){
    if(requester == null){
      this.selectedRequester = "Select...";
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
    this.selectedCategory = "Select...";
    this.selectedLocation = "Select...";
    this.selectedStatus = "Select...";
    this.selectedDept = "Select...";
    this.selectedRequester = "Select...";
    this.searchRequest.emit(this.searchCriteria);
  }

}
