import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

import { ProjectReportFilter, ProjectReport, ProjectDate } from '../../../classes/project';
import { ProjectService } from '../../../services/project.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
    projects:ProjectReport[];
    dates:string[];
    today:string;
    filter:ProjectReportFilter = new ProjectReportFilter();
    hasPointInfo:boolean = false;
    moment = extendMoment(Moment);
    constructor(private authService: AuthenticationService,
                private projectService: ProjectService,
                private router: Router,
                private route: ActivatedRoute) {}
    ngOnInit() {
      this.route.data
          .subscribe((data: { title: string }) => {
            this.authService.setTitle(data.title);
          });

      this.resetFilter();
    }



    loadReportData(){
      this.today = this.moment().format('YYYY-MM-DD');
      let range = this.moment.range(this.moment(this.filter.start_date, 'YYYY-MM-DD'), this.moment(this.filter.end_date, 'YYYY-MM-DD'));
      let days = Array.from(range.by('days'));
      this.dates = days.map(d => d.format('YYYY-MM-DD'));

      this.projectService.getProjectReport(this.filter).subscribe(res => {
        console.log(res);
        this.projects = res;
      })
    }

    generateProjectReport(){
      this.loadReportData();
    }

    resetFilter(){
      var date = new Date();
      const start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();//this.moment().startOf('month').format('MM/DD/YYYY');
      const end   = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();//this.moment().endOf('month').format('MM/DD/YYYY');
      this.filter.start_date = start;
      this.filter.end_date = end;
      this.loadReportData();
    }

    getPointClass(project:any, date:any){
      let returnedClass = "";
      if(project.procurement_dates!= null){
        for(let d of project.procurement_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            returnedClass = "point";
            break;
          }
        }
      }

      if(project.construction_dates!= null){
        for(let d of project.construction_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            returnedClass = "solidpoint";
            break;
          }
        }
      }
      return returnedClass;
    }

    getDescription(project:any, date:any){
      let text = "";
      if(project.procurement_dates!= null){
        for(let d of project.procurement_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            text = d.display_name;
            break;
          }
        }
      }
      if(project.construction_dates!= null){
        for(let d of project.construction_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            text = d.display_name;
            break;
          }
        }
      }


      return text;
    }

    /*getDetailDescription(project:any, date:any){
      let text = "";
      if(project.procurement_dates!= null){
        for(let d of project.procurement_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            text = d.full_name;
            break;
          }
        }
      }
      if(project.construction_dates!= null){
        for(let d of project.construction_dates){
          if(date == this.moment(d.display_date, 'YYYY-MM-DD').format('YYYY-MM-DD')){
            text = d.full_name;
            break;
          }
        }
      }

      return text;
    }*/

    getAttribute(project:any, date:any){
      let res = false;
      if(this.moment(date, 'YYYY-MM-DD') >= this.moment(project.min_date, 'YYYY-MM-DD') && this.moment(date, 'YYYY-MM-DD') <= this.moment(project.max_date, 'YYYY-MM-DD')){
        res = true;
      }
      return res;
    }
}
