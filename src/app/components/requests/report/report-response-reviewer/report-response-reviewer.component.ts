import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';
import { ReportData } from '../../../../classes/report';
import { RequestService } from '../../../../services/request.service';

@Component({
  selector: 'app-report-response-reviewer',
  templateUrl: './report-response-reviewer.component.html',
  styleUrls: ['./report-response-reviewer.component.css']
})
export class ReportResponseReviewerComponent implements OnInit, OnDestroy {
  subtitle:string;
  subscription:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetData();
    this.subtitle = "Response Time By Reviewer";
    this.displayReportData();
  }

  displayReportData(){
    this.subscription = this.authService.reportFilter.subscribe(
      filter => {
        let reportData = [];
        let chartData = [];
        let chartLabel = [];
        this.requestService.getReviewerReponseReportData(filter).subscribe(result => {
          //this.subtitle = "Response Time By Reviewer";
          let columns = ['Reviewer', 'Min_Days', 'Max_Days', 'Avg_Days'];
          this.authService.setReportColumn(columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Reviewer = reportdata.name;
              row.Min_Days = reportdata.min_response_days;
              row.Max_Days = reportdata.max_response_days;
              row.Avg_Days = reportdata.avg_response_days;
              reportData.push(row);

              chartLabel.push(reportdata.name);
            }
            this.authService.setReportData(reportData);
            this.authService.setResponseTimeChartData(result, chartLabel, "bar");
          }
          else {
            this.resetData();
          }
        });
    });
  }

  printReport(){
    this.router.navigate(['/report/print/' + this.subtitle]);
  }

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }

  ngOnDestroy() {

    if(this.subscription != null)
      this.subscription.unsubscribe();
  }

}
