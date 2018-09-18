import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../services/authentication.service';
import { ReportData } from '../../../classes/report';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  private tab0:boolean = false;
  private tab1:boolean = false;
  private tab2:boolean = false;
  private tab3:boolean = false;
  private tab4:boolean = false;
  subtitle:string;
  reportData:any = [];
  chartData:any = [];
  chartLabel:any =[];
  chartColor:any =[];
  columns:string[] = [];
  subscription1:any;
  subscription2:any;
  subscription3:any;
  subscription4:any;
  subscription5:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
        .subscribe((data: { title: string }) => {
          this.authService.setTitle(data.title);
          this.resetData();
          this.tab0 = true;
          this.displayCategoryRequestReport();
        });

  }

  displayCategoryRequestReport(){
    this.resetTabValue();
    this.tab0 = true;
    if(this.subscription2 != null)
      this.subscription2.unsubscribe();
    if(this.subscription3 != null)
      this.subscription3.unsubscribe();
    if(this.subscription4 != null)
      this.subscription4.unsubscribe();
    if(this.subscription5 != null)
      this.subscription5.unsubscribe();
    this.subscription1 = this.authService.reportFilter.subscribe(
      filter => {
        this.reportData = [];
        this.chartData = [];
        this.chartLabel = [];
        this.chartColor = [];
        let index = 0;
        this.requestService.getCategoryRequestReportData(filter).subscribe(result => {
            result.subscribe(
              result => {
                const row = new ReportData();
                row.Category = result[0].category_name;
                row.Code = result[0].category_code;
                row.No_Of_Requests = result.length;
                this.reportData.push(row);
                this.chartData.push(result.length);
                this.chartLabel.push(result[0].category_code);
                this.chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
                index++;
              }
          );
          this.subtitle = "Requests by Category";
          this.columns = ['Category', 'Code', 'No_Of_Requests'];
          this.authService.setReportColumn(this.columns);
          this.authService.setReportData(this.reportData);
          this.authService.setPieChartData(this.chartData, this.chartLabel, this.chartColor);
        });
    });

  }

  displayRequesterRequestReport(){
    this.resetTabValue();
    this.tab1 = true;
    if(this.subscription1 != null)
      this.subscription1.unsubscribe();
    if(this.subscription3 != null)
      this.subscription3.unsubscribe();
    if(this.subscription4 != null)
      this.subscription4.unsubscribe();
    if(this.subscription5 != null)
      this.subscription5.unsubscribe();
    this.subscription2 = this.authService.reportFilter.subscribe(
      filter => {
        this.reportData = [];
        this.chartData = [];
        this.chartLabel = [];
        this.chartColor = [];
        let index = 0;
          this.requestService.getRequesterRequestReportData(filter).subscribe(result => {
              result.subscribe(
                result => {
                  const row = new ReportData();
                  row.Requester = result[0].requestor_name;
                  row.No_Of_Requests = result.length;
                  this.reportData.push(row);
                  this.chartData.push(result.length);
                  this.chartLabel.push(result[0].requestor_name);
                  this.chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
                  index++;
                }
            );
            this.subtitle = "Requests by Requester";
            this.columns = ['Requester', 'No_Of_Requests'];
            this.authService.setReportColumn(this.columns);
            this.authService.setReportData(this.reportData);
            this.authService.setPieChartData(this.chartData, this.chartLabel, this.chartColor);
          });
      });
  }

  displayReviewerRequestReport(){
    this.resetTabValue();
    this.tab2 = true;
    if(this.subscription2 != null)
      this.subscription2.unsubscribe();
    if(this.subscription1 != null)
      this.subscription1.unsubscribe();
    if(this.subscription4 != null)
      this.subscription4.unsubscribe();
    if(this.subscription5 != null)
      this.subscription5.unsubscribe();
    this.subscription3 = this.authService.reportFilter.subscribe(
      filter => {
        this.reportData = [];
        this.chartData = [];
        this.chartLabel = [];
        this.requestService.getReviewerRequestReportData(filter).subscribe(result => {
          this.subtitle = "Assigned Request By Reviewer";
          this.columns = ['Reviewer', 'No_Of_Requests'];
          this.authService.setReportColumn(this.columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Reviewer = reportdata.user_name;
              row.No_Of_Requests = reportdata.open_assigned_count;
              this.reportData.push(row);
              this.chartLabel.push(reportdata.user_name);
              this.chartData.push(reportdata.category_count);
            }
            this.authService.setReportData(this.reportData);
            this.authService.setBarChartData(this.chartData, this.chartLabel, "bar");
          }
          else {
            this.resetData();
          }

        });
    });
  }

  displayCategoryResponseReport(){
    this.resetTabValue();
    this.tab3 = true;
    if(this.subscription2 != null)
      this.subscription2.unsubscribe();
    if(this.subscription3 != null)
      this.subscription3.unsubscribe();
    if(this.subscription1 != null)
      this.subscription1.unsubscribe();
    if(this.subscription5 != null)
      this.subscription5.unsubscribe();
    this.subscription4 = this.authService.reportFilter.subscribe(
      filter => {
        this.reportData = [];
        this.chartData = [];
        this.chartLabel = [];
        this.requestService.getCategoryReponseReportData(filter).subscribe(result => {
          this.subtitle = "Response Time By Category";
          this.columns = ['Code', 'Min_Days', 'Max_Days', 'Avg_Days'];
          this.authService.setReportColumn(this.columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Code = reportdata.name;
              row.Min_Days = reportdata.min_response_days;
              row.Max_Days = reportdata.max_response_days;
              row.Avg_Days = reportdata.avg_response_days;
              this.reportData.push(row);
              this.chartLabel.push(reportdata.name);
            }
            this.authService.setReportData(this.reportData);
            this.authService.setResponseTimeChartData(result, this.chartLabel, "bar");
          }
          else {
            this.resetData();
          }
        });
    });

  }

  displayReviewerResponseReport(){
    this.resetTabValue();
    this.tab4 = true;
    if(this.subscription2 != null)
      this.subscription2.unsubscribe();
    if(this.subscription3 != null)
      this.subscription3.unsubscribe();
    if(this.subscription4 != null)
      this.subscription4.unsubscribe();
    if(this.subscription1 != null)
      this.subscription1.unsubscribe();
    this.subscription5 = this.authService.reportFilter.subscribe(
      filter => {
        this.reportData = [];
        this.chartData = [];
        this.chartLabel = [];
        this.requestService.getReviewerReponseReportData(filter).subscribe(result => {
          this.subtitle = "Response Time By Reviewer";
          this.columns = ['Reviewer', 'Min_Days', 'Max_Days', 'Avg_Days'];
          this.authService.setReportColumn(this.columns);
          if(result.length > 0){
            for (let reportdata of result) {
              const row = new ReportData();
              row.Reviewer = reportdata.name;
              row.Min_Days = reportdata.min_response_days;
              row.Max_Days = reportdata.max_response_days;
              row.Avg_Days = reportdata.avg_response_days;
              this.reportData.push(row);

              this.chartLabel.push(reportdata.name);
            }
            this.authService.setReportData(this.reportData);
            this.authService.setResponseTimeChartData(result, this.chartLabel, "bar");
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

  ngOnDestroy() {
    if(this.subscription1 != null)
      this.subscription1.unsubscribe();
    if(this.subscription2 != null)
      this.subscription2.unsubscribe();
    if(this.subscription3 != null)
      this.subscription3.unsubscribe();
    if(this.subscription4 != null)
      this.subscription4.unsubscribe();
    if(this.subscription5 != null)
      this.subscription5.unsubscribe();
  }

  resetData() {
    this.authService.resetChartData();
    this.authService.setReportData([]);
    this.authService.setReportColumn([]);
  }
  resetTabValue(){
    this.tab0 = false;
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = false;
    this.tab4 = false;
  }

}
