import { Component, OnInit , Input, ViewChild, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatSort, MatTableDataSource, MatProgressSpinner } from '@angular/material';

import { ReturnedRequest } from '../../../classes/returnedrequest';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit, OnChanges{
  @Output() resultCount = new EventEmitter<number>();
  @Input() searchCriteria: string;
  @Input() role_id: number;
  requestDataSource:any;
  requestFilter:any;
  columns: string[] = ['high_priority', 'sequence_id', 'create_date', 'requester', 'description', 'deptmt_name', 'location_name', 'category_code', 'str_reviewers', 'status_desc', 'complete_date'];
  isLoading = true;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private requestService: RequestService) { }

  ngOnInit() {
    /*if(this.searchCriteria == null){
      this.getRequests();
    }
    else {
      this.requestFilter = this.searchCriteria;
      this.requestDataSource.filter = JSON.stringify(this.searchCriteria);
      this.resultCount.emit(this.requestDataSource.filteredData.length);
    }*/
  }

  ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['searchCriteria']) {
          if(this.searchCriteria == null || this.searchCriteria.length == 0 || this.requestDataSource == null){
            this.getRequests();
          }
          else {
            this.isLoading = false;
            this.requestFilter = JSON.parse(this.searchCriteria);
            this.requestDataSource.filter = this.searchCriteria;
            this.resultCount.emit(this.requestDataSource.filteredData.length);
          }
        }
    }

  getRequests(){
    if(this.role_id == 1){
      this.requestService.getRequestsByRequester().subscribe(result => {
        if(result.length >= 0){
          this.displayRequest(result);
        }
      });
    }
    if(this.role_id == 2){
      this.requestService.getRequestsByReviewer().subscribe(result => {
        if(result.length >= 0){
          this.displayRequest(result);
        }
      });
    }
    if(this.role_id == 3){
      this.requestService.getAllRequests().subscribe(result => {
        if(result.length >= 0){
          this.displayRequest(result);
        }
      });
    }
  }

  displayRequest(requests:any){
    this.isLoading = false;
    this.requestDataSource = new MatTableDataSource(requests);
    this.requestDataSource.sort = this.sort;
    this.requestFilter = new ReturnedRequest();
    this.requestDataSource.filterPredicate =
      (data: ReturnedRequest, filters: string) => {
        //console.log(filters);
        return this.getFilterResult(data, filters);
      }

    if(this.searchCriteria != null && this.searchCriteria.length > 0){
      this.requestFilter = JSON.parse(this.searchCriteria);
      this.requestDataSource.filter = this.searchCriteria;
      this.resultCount.emit(this.requestDataSource.filteredData.length);
    }
    else {
      this.resultCount.emit(requests.length);
    }
  }

  getFilterResult(data: ReturnedRequest, filters: string):boolean{
    let show = true;

    for(let property in JSON.parse(filters)){
      if(property == "create_date_start" || property == "create_date_end")
      {
        let startDate = this.requestFilter["create_date_start"];
        let endDate = this.requestFilter["create_date_end"];
        if(startDate != null && endDate != null){
          if(new Date(data.create_date).setHours(0,0,0,0) >= new Date(startDate.year, startDate.month - 1, startDate.day).setHours(0, 0, 0, 0)
            && new Date(data.create_date).setHours(0,0,0,0) <= new Date(endDate.year, endDate.month - 1, endDate.day).setHours(0, 0, 0, 0))
            {
              show = true;
            }
            else {
              show = false;
              break;
            }
        }
        else if(startDate == null && endDate != null){
          if(new Date(data.create_date).setHours(0,0,0,0) <= new Date(endDate.year, endDate.month - 1, endDate.day).setHours(0, 0, 0, 0))
            {
              show = true;
            }
            else {
              show = false;
              break;
            }
        }
        else if(startDate != null && endDate == null){
          if(new Date(data.create_date).setHours(0,0,0,0) >= new Date(startDate.year, startDate.month - 1, startDate.day).setHours(0, 0, 0, 0))
            {
              show = true;
            }
            else {
              show = false;
              break;
            }
        }
      }
      if(property == "contract_no"){
        if(this.requestFilter[property] == null || this.requestFilter[property].trim().length == 0)
          show = true;
        else {
          if(!JSON.stringify(data.Contracts).includes(this.requestFilter[property].trim().toUpperCase()))
          {
            show = false;
            break;
          }
        }
      }
      if(property == "high_priority"){ //boolean value check
        if(this.requestFilter[property] == null || (this.requestFilter[property].length) == 0)
          show = true;
        else if(!this.requestFilter[property]){
          if(data[property])
          {
            show = false;
            break;
          }
        }
        else if(this.requestFilter[property]){
          if(data[property] == null || !data[property])
          {
            show = false;
            break;
          }
        }
      }
      if(property == "complete_date_display"){
        if(this.requestFilter[property] == null || this.requestFilter[property].length == 0)
          show = true;
        else {
          console.log(new Date(data.complete_date).setHours(0,0,0,0));
          console.log(new Date(this.requestFilter[property].year, this.requestFilter[property].month - 1, this.requestFilter[property].day).setHours(0, 0, 0, 0));
          if(new Date(data.complete_date).setHours(0,0,0,0) != new Date(this.requestFilter[property].year, this.requestFilter[property].month - 1, this.requestFilter[property].day).setHours(0, 0, 0, 0))
          {
            show = false;
            break;
          }
        }
      }
      if(property == "category_code" || property == "location_id" || property == "status_id" || property == "deptmt_id" || property == "requestor_id"){ //dropdown value check
        if(this.requestFilter[property] == null || (this.requestFilter[property].length) == 0)
          show = true;
        else {
          if(data[property] != this.requestFilter[property])
          {
            show = false;
            break;
          }
        }
      }
      if(property == "sequence_id" || property == "str_reviewers" || property == "description"){//string value check
        if(this.requestFilter[property] == null || (this.requestFilter[property].trim().length) == 0)
          show = true;
        else {
          if(data[property]== null){
            show = false;
            break;
          }
          else {
            if(!data[property].toLowerCase().includes(this.requestFilter[property].trim().toLowerCase()))
            {
              show = false;
              break;
            }
            else show = true;
          }
        }
      }
    }
    return show;
  }
}
