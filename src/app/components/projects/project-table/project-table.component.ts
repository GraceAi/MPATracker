import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

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
  projectDataSource:any = null;
  projectColumns: string[] = ['project_no', 'contract_no', 'firm_name', 'description', 'mpa_contact', 'str_managers'];
  private subscription:any;
  private subscription2:any;
  projectFilter:any;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private authService: AuthenticationService,
              private projectService: ProjectService) { }

  ngOnInit() {
    this.getDatasource()
    this.displayProjects();
  }
  getDatasource(){
    this.subscription2 = this.authService.projectData
    .subscribe(
      projectData => {
        console.log(projectData);
        if(projectData !== null){
          this.projectDataSource = new MatTableDataSource(projectData);
          this.resultCount.emit(projectData.length);
          this.projectDataSource.sort = this.sort;
          this.projectFilter = new Project();
          this.projectDataSource.filterPredicate =
            (data: Project, filters: string) => {
              return this.getFilterResult(data, filters);
            }
        }

      });
  }
  displayProjects(){
    this.subscription = this.authService.projectFilter.subscribe(
      filter => {
        console.log(filter);
        this.projectFilter = filter;
        if(this.projectDataSource !== null){
          this.projectDataSource.filter = JSON.stringify(filter);
          this.resultCount.emit(this.projectDataSource.filteredData.length);
        }
      });
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
    this.subscription2.unsubscribe();
  }

}
