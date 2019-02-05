import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { MatSort, MatTableDataSource, MatProgressSpinner } from '@angular/material';
import { mergeMap } from 'rxjs/operators';

import { Project } from '../../../classes/project';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit, OnDestroy {
  @Output() resultCount = new EventEmitter<number>();
  @Input() role_id: number;
  projectType:any;
  datasource:any;
  projectDataSource:any = null;
  projectColumns: string[] = ['project_no', 'contract_no', 'firm_name', 'description', 'mpa_contact', 'str_managers'];
  subscription:any;
  projectFilter:any;
  isLoading = true;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private authService: AuthenticationService,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.subscription = this.loadProjectData().pipe(
      mergeMap(data => {
        this.datasource = data;
        return this.authService.projectFilter
      })
    )
    /*this.authService.pageTitle
    .pipe(
      mergeMap(result =>{
        //this.projectType = result;
        return this.loadProjectData().pipe(
          mergeMap(data => {
            this.datasource = data;
            return this.authService.projectFilter
          })
        )}
      )
    )*/
    .subscribe(filter => {
      this.displayProjectData(filter);
    });
  }

  loadProjectData(){
    if (this.role_id == 6) {
        return this.projectService.getProjectsByManager();
    }
    else if (this.role_id == 7) {
        return this.projectService.getAllProjects();
    }
  }

  displayProjectData(filter:any){
    this.projectFilter = filter;
    this.isLoading = false;
    console.log(filter);
    console.log(this.datasource);
    if(this.datasource !== null){
      this.projectDataSource = new MatTableDataSource(this.datasource);
      this.projectDataSource.sort = this.sort;
      this.projectDataSource.filterPredicate =
        (data: Project, filters: string) => {
          return this.getFilterResult(data, filters);
        }
      if(this.projectFilter != null){
        this.projectDataSource.filter = JSON.stringify(this.projectFilter);
        this.resultCount.emit(this.projectDataSource.filteredData.length);
      }
      else{
        this.resultCount.emit(this.projectDataSource.length);
      }
    }
  }

  getFilterResult(data: Project, filters: string):boolean{
    let show = true;

    for(let property in JSON.parse(filters)){
      if(property == "firm_id"){ //dropdown value check
        if(this.projectFilter[property] == null || (this.projectFilter[property].length) == 0)
          show = true;
        else {
          if(data[property] != this.projectFilter[property])
          {
            show = false;
            break;
          }
        }
      }
      if(property == "contract_number" || property == "project_number" || property == "str_managers"  || property == "contact_name"|| property == "description"){//string value check
        if(this.projectFilter[property] == null || (this.projectFilter[property].trim().length) == 0)
          show = true;
        else {
          if(data[property]== null){
            show = false;
            break;
          }
          else {
            if(!data[property].toLowerCase().includes(this.projectFilter[property].trim().toLowerCase()))
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
