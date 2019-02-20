import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProjectReportFilter } from '../../../../classes/project';
import { ProjectService } from '../../../../services/project.service';
import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-project-report-print',
  templateUrl: './project-report-print.component.html',
  styleUrls: ['./project-report-print.component.css']
})
export class ProjectReportPrintComponent implements OnInit {
  filter:ProjectReportFilter = new ProjectReportFilter();
  subtitle:string;
  username:string;
  currentdate:number;
  logoPath:string;
  projects:any;
  constructor(private authService: AuthenticationService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.logoPath = this.authService.logoPath;
    this.username = this.authService.username;
    this.currentdate = Date.now();

    this.filter.start_date = this.route.snapshot.queryParams["start_date"];
    this.filter.end_date = this.route.snapshot.queryParams["end_date"];
    this.projectService.getProjectReport(this.filter).subscribe(res => {
      console.log(res);
      this.projects = res;
    })
  }

  printReport(){
    window.print();
  }

}
