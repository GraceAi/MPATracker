import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';

import { AuthenticationService } from '../../../../services/authentication.service';
import { ReportFilter, ReportData } from '../../../../classes/report';
import { RequestService } from '../../../../services/request.service';

@Component({
  selector: 'app-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.css']
})
export class ReportTemplateComponent implements OnInit, OnDestroy {
  subscription:any;
  reportType:string = "";
  reportData:any;
  constructor(private authService: AuthenticationService,
              private requestService: RequestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.authService.reportTitle
    .pipe(
      mergeMap(result =>{
        this.reportType = result;
        return this.authService.reportFilter.pipe(
          mergeMap(filter => {
            return this.loadReportData(filter)
          })
        )}
      )
    )
    .subscribe(result => {
      this.reportData = result;
      this.displayReportData();
    });

  }

  displayReportData(){
    if (this.reportType == "Requests by Requester") {
      this.displayRequesterReport();
    }
    else if (this.reportType == "Requests by Category") {
      this.displayCategoryReport();
    }
    else if (this.reportType == "Assigned Request By Task Manager") {
      this.displayReviewerReport();
    }
    else if (this.reportType == "Response Time By Category") {
      this.displayCatResponseReport();
    }
    else if (this.reportType == "Response Time By Task Manager") {
      this.displayReviewerResponseReport();
    }
    else if (this.reportType == "Requests by Status") {
      this.displayStatusReport();
    }
  }

  loadReportData(filter:any){
    if (this.reportType == "Requests by Requester") {
        return this.requestService.getRequesterRequestReportData(filter);
    }
    else if (this.reportType == "Requests by Category") {
        return this.requestService.getCategoryRequestReportData(filter);
    }
    else if (this.reportType == "Assigned Request By Task Manager") {
        return this.requestService.getReviewerRequestReportData(filter);
    }
    else if (this.reportType == "Response Time By Category") {
        return this.requestService.getCategoryReponseReportData(filter);
    }
    else if (this.reportType == "Response Time By Task Manager") {
        return this.requestService.getReviewerReponseReportData(filter);
    }
    else if (this.reportType == "Requests by Status") {
      return this.requestService.getStatusReportData(filter);
    }
  }

  displayRequesterReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let chartColor = [];
    let columns = ['Requester', 'No_Of_Requests'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      let index = 0;
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Requester = reportdata.requestor_name;
        row.No_Of_Requests = reportdata.request_count;
        reportData.push(row);
        chartData.push(reportdata.request_count);
        chartLabel.push(reportdata.requestor_name);
        chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
        index++;
      }
      this.authService.setReportData(reportData);
      this.authService.setPieChartData(chartData, chartLabel, chartColor);
    }
    else {
      this.resetData();
    }
  }

  displayCategoryReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let chartColor = [];
    let columns = ['Category', 'Code', 'No_Of_Requests'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      let index = 0;
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Category = reportdata.category_name;
        row.Code = reportdata.category_code;
        row.No_Of_Requests = reportdata.request_count;
        reportData.push(row);
        chartData.push(reportdata.request_count);
        //chartLabel.push(reportdata.category_code);
        chartLabel.push(reportdata.category_name);
        chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
        index++;
      }
      this.authService.setReportData(reportData);
      this.authService.setPieChartData(chartData, chartLabel, chartColor);
    }
    else {
      this.resetData();
    }
  }

  displayReviewerReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let columns = ['Task_Manager', 'No_Of_Requests'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Task_Manager = reportdata.user_name;
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
  }

  displayCatResponseReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let columns = ['Code', 'Min_Days', 'Max_Days', 'Avg_Days'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Code = reportdata.name;
        row.Min_Days = reportdata.min_response_days;
        row.Max_Days = reportdata.max_response_days;
        row.Avg_Days = reportdata.avg_response_days;
        reportData.push(row);
        chartLabel.push(reportdata.name);
      }
      this.authService.setReportData(reportData);
      this.authService.setResponseTimeChartData(this.reportData, chartLabel, "bar");
    }
    else {
      this.resetData();
    }
  }

  displayReviewerResponseReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let columns = ['Task_Manager', 'Min_Days', 'Max_Days', 'Avg_Days'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Task_Manager = reportdata.name;
        row.Min_Days = reportdata.min_response_days;
        row.Max_Days = reportdata.max_response_days;
        row.Avg_Days = reportdata.avg_response_days;
        reportData.push(row);
        chartLabel.push(reportdata.name);
      }
      this.authService.setReportData(reportData);
      this.authService.setResponseTimeChartData(this.reportData, chartLabel, "bar");
    }
    else {
      this.resetData();
    }
  }

  displayStatusReport(){
    let reportData = [];
    let chartData = [];
    let chartLabel = [];
    let chartColor = [];
    let columns = ['Status', 'No_Of_Requests'];
    this.authService.setReportColumn(columns);
    if(this.reportData.length > 0){
      let index = 0;
      for (let reportdata of this.reportData) {
        const row = new ReportData();
        row.Status = reportdata.status;
        row.No_Of_Requests = reportdata.request_count;
        reportData.push(row);
        chartData.push(reportdata.request_count);
        chartLabel.push(reportdata.status);
        chartColor.push(this.authService.COLORS[index % this.authService.COLORS.length]);
        index++;
      }
      this.authService.setReportData(reportData);
      this.authService.setPieChartData(chartData, chartLabel, chartColor);
    }
    else {
      this.resetData();
    }
  }

  resetData(){
    this.authService.resetChartData();
    this.authService.setReportData([]);
  }

  ngOnDestroy() {
    if(this.subscription != null){
      this.subscription.unsubscribe();
    }
  }
}
