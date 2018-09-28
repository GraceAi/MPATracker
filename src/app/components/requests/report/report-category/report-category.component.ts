import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../../services/authentication.service';
import { ReportData } from '../../../../classes/report';
import { RequestService } from '../../../../services/request.service';

@Component({
  selector: 'app-report-category',
  templateUrl: './report-category.component.html',
  styleUrls: ['./report-category.component.css']
})
export class ReportCategoryComponent implements OnInit, OnDestroy {
  subtitle:string;
  subscription:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.resetData();
    this.subtitle = "Requests by Category";
    this.displayReportData();
  }

  displayReportData(){
    this.subscription = this.authService.reportFilter.subscribe(
      filter => {
        let reportData = [];
        let chartData = [];
        let chartLabel = [];
        let chartColor = [];
        let index = 0;
        let columns = ['Category', 'Code', 'No_Of_Requests'];
        this.requestService.getCategoryRequestReportData(filter).subscribe(result => {
            result.subscribe(
              result => {
                const row = new ReportData();
                row.Category = result[0].category_name;
                row.Code = result[0].category_code;
                row.No_Of_Requests = result.length;
                reportData.push(row);
                chartData.push(result.length);
                chartLabel.push(result[0].category_code);
                chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
                index++;
              }
          );
          this.authService.setReportColumn(columns);
          this.authService.setReportData(reportData);
          this.authService.setPieChartData(chartData, chartLabel, chartColor);
        });
    });
  }

  printReport(){
    this.router.navigate(['/report/print/' + this.subtitle]);
  }

  ngOnDestroy() {
    if(this.subscription != null)
      this.subscription.unsubscribe();
  }

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }

}
