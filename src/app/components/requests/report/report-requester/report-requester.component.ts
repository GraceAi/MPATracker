import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-report-requester',
  templateUrl: './report-requester.component.html',
  styleUrls: ['./report-requester.component.css']
})
export class ReportRequesterComponent implements OnInit {
  constructor(private authService: AuthenticationService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    //this.resetData();
    //this.subtitle = "Requests by Requester";

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
        let chartColor = [];
        let columns = ['Requester', 'No_Of_Requests'];
        let index = 0;
          this.requestService.getRequesterRequestReportData(filter).subscribe(result => {
              result.subscribe(
                result => {
                  const row = new ReportData();
                  row.Requester = result[0].requestor_name;
                  row.No_Of_Requests = result.length;
                  reportData.push(row);
                  chartData.push(result.length);
                  chartLabel.push(result[0].requestor_name);
                  chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
                  index++;
                }
            );
            //this.subtitle = "Requests by Requester";
            //this.columns = ['Requester', 'No_Of_Requests'];
            this.authService.setReportColumn(columns);
            this.authService.setReportData(reportData);
            this.authService.setPieChartData(chartData, chartLabel, chartColor);
          });
      });
  }

  ngOnDestroy() {
    if(this.subscription != null)
      this.subscription.unsubscribe();
  }

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }*/

}
