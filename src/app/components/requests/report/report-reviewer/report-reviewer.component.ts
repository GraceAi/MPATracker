import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';
import { ReportData } from '../../../../classes/report';
import { RequestService } from '../../../../services/request.service';

@Component({
  selector: 'app-report-reviewer',
  templateUrl: './report-reviewer.component.html',
  styleUrls: ['./report-reviewer.component.css']
})
export class ReportReviewerComponent implements OnInit , OnDestroy {
  subtitle:string;
  subscription:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetData();
    this.subtitle = "Assigned Request By Reviewer";
    this.displayReportData();
  }

  displayReportData(){
    this.subscription = this.authService.reportFilter.subscribe(
      filter => {
        let reportData = [];
        let chartData = [];
        let chartLabel = [];
        let columns = ['Reviewer', 'No_Of_Requests'];
        this.requestService.getReviewerRequestReportData(filter).subscribe(result => {
          this.authService.setReportColumn(columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Reviewer = reportdata.user_name;
              row.No_Of_Requests = reportdata.open_assigned_count;
              reportData.push(row);
              chartLabel.push(reportdata.user_name);
              chartData.push(reportdata.category_count);
            }
            this.authService.setReportData(reportData);
            this.authService.setBarChartData(chartData, chartLabel, "bar");
          }
          else {
            this.resetData();
          }

        });
    });
  }

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }

  printReport(){
    this.router.navigate(['/report/print/' + this.subtitle]);
  }

  ngOnDestroy() {
    if(this.subscription != null)
      this.subscription.unsubscribe();
  }

}
