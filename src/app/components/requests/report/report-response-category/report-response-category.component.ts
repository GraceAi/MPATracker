import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';
import { ReportData } from '../../../../classes/report';
import { RequestService } from '../../../../services/request.service';

@Component({
  selector: 'app-report-response-category',
  templateUrl: './report-response-category.component.html',
  styleUrls: ['./report-response-category.component.css']
})
export class ReportResponseCategoryComponent implements OnInit {
  //subtitle:string;
  //subscription:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    //this.resetData();
    //this.subtitle = "Response Time By Category";

    //this.displayReportData();
    this.route.data
        .subscribe((data: { subtitle: string }) => {
          this.authService.setReportTitle(data.subtitle);
        });
  }

  /*displayReportData(){
    this.subscription = this.authService.reportFilter.subscribe(
      filter => {
        let reportData = [];
        let chartData = [];
        let chartLabel = [];
        this.requestService.getCategoryReponseReportData(filter).subscribe(result => {
          //this.subtitle = "Response Time By Category";
          let columns = ['Code', 'Min_Days', 'Max_Days', 'Avg_Days'];
          this.authService.setReportColumn(columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Code = reportdata.name;
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

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }

  ngOnDestroy() {
    if(this.subscription != null)
      this.subscription.unsubscribe();
  }*/

}
