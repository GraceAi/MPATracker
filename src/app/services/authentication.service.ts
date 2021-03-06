import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of, forkJoin, BehaviorSubject} from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { EnvironmentSetting, User, Role, Tab, SideTab, Status, Department, Location, Category, Contact, Firm, ProjectSize} from '../classes/domain';
import { ReportData, ReportFilter } from '../classes/report';
import { Project } from '../classes/project';
import { DomainService }  from './domain.service';

@Injectable()
export class AuthenticationService {
  private titleSource = new BehaviorSubject('');
  pageTitle = this.titleSource.asObservable();

  private reportTitleSource = new BehaviorSubject('');
  reportTitle = this.reportTitleSource.asObservable();

  private unlockChangeSource = new BehaviorSubject(false);
  unlocked = this.unlockChangeSource.asObservable();

  private reportDataSource = new Subject<any>();
  reportData = this.reportDataSource.asObservable();

  private reportColumnSource = new Subject<any>();
  reportColumn = this.reportColumnSource.asObservable();

  private chartDataSource = new Subject<any>();
  chartData = this.chartDataSource.asObservable();

  private filterDataSource = new BehaviorSubject(new ReportFilter());
  reportFilter = this.filterDataSource.asObservable();

  private projectDataSource = new Subject<any>();
  projectData = this.projectDataSource.asObservable();

  private projectFilterDataSource = new BehaviorSubject(new Project());
  projectFilter = this.projectFilterDataSource.asObservable();

  private sidetabDataSource = new BehaviorSubject([]);
  sidetabData = this.sidetabDataSource.asObservable();

  public COLORS = [
    'rgb(255, 99, 132)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
    '#a1caf1',
    '#9966cc',
		'#f67019',
		'#f53794',
		'#537bc4',
		'#acc236',
		'#166a8f',
		'#00a950',
		'#58595b',
    '#915c83',
    '#4dc9f6'

  ];

  public logoPath:string = "./assets/img/mpa.png";
  public calendarIconPath:string ="./assets/img/calendar-icon.svg";
  public appSettings: any;
  public username: string;
  public currentUserRoles: Role[];
  public tabs: Tab[];
  public categories:Category[];
  public statuses:Status[];
  public departments:Department[];
  public locations:Location[];
  public requesters:User[];
  public contacts:Contact[];
  public allReviewers:User[];
  public allUsers:User[];
  public allSidetabs:SideTab[];
  public allRoles:Role[];
  public firms:Firm[];
  public allManagers:User[];
  public projectSizes:ProjectSize[];
  constructor(private http: HttpClient,
  private domainService:DomainService) { }

  getSettings(): Promise<any> {
    if (this.appSettings === null || this.appSettings === undefined) {
      const promise = this.http.get('./assets/settings_dev.json')
      .pipe(
        mergeMap((settings:any) => {
          return forkJoin(
           of(settings),
           this.http.get(settings.service_url + "User/GetUser"),
           this.http.get(settings.service_url + "User/GetRoleByUser"),
           this.domainService.getStatus(settings.service_url),
           this.domainService.getCategories(settings.service_url),
           this.domainService.getDepartments(settings.service_url),
           this.domainService.getContacts(settings.service_url),
           this.domainService.getLocations(settings.service_url),
           this.domainService.getRequesters(settings.service_url),
           this.domainService.getAllReviewers(settings.service_url),
           this.domainService.getAllUsers(settings.service_url),
           this.domainService.getAllSidetabs(settings.service_url),
           this.domainService.getRoles(settings.service_url),
           this.domainService.getFirms(settings.service_url),
           this.domainService.getAllManagers(settings.service_url),
           this.domainService.getProjectSizes(settings.service_url)
          )})
        )
        .toPromise()
        .then((data: any[]) => {
          this.appSettings = data[0];
          this.username = data[1].fname + " " + data[1].lname;
          this.currentUserRoles = data[2];
          this.statuses = data[3];
          this.categories = data[4];
          this.departments = data[5];
          this.contacts = data[6];
          this.locations = data[7];
          this.requesters = data[8];
          this.allReviewers = data[9];
          this.allUsers = data[10];
          this.allSidetabs = data[11];
          this.allRoles = data[12];
          this.firms = data[13];
          this.allManagers = data[14];
          this.projectSizes = data[15];
        });
      return promise;
    }
  }

  setTitle(title: string) {
      this.titleSource.next(title);
  }

  setReportTitle(title: string) {
      this.reportTitleSource.next(title);
  }

  setUnlock(unlock:boolean){
    this.unlockChangeSource.next(unlock);
  }

  getTabsByUser(): Observable<any>{
    let url:string = this.appSettings.service_url + "User/GetTabsByUser";
    return this.http.get<any>(url);
  }

  setSidetabs(data:any){
    this.sidetabDataSource.next(data);
  }

  setReportData(data:any){
    this.reportDataSource.next(data);
  }
  setReportColumn(column:any){
    this.reportColumnSource.next(column);
  }
  setPieChartData(data:any, labels:any, colors: any){
    let chartData = {
      type: 'pie',
      data: {
        labels : labels,
        datasets : [
          {
              data : data,
              backgroundColor: colors
          }]
      }
    }
    this.chartDataSource.next(chartData);
  }
  setBarChartData(data:any, labels:any, type: string){
    let dataLabels = [];
    for(let cat_count of data){
      if(cat_count != null){
        for(let category of cat_count){
          if(!dataLabels.includes(category.category_code))
            dataLabels.push(category.category_code);
        }
      }
    }
    let datasetsArray = [];
    let index = 0;
    for(let dataLabel of dataLabels){
      let subArray = [];
      for(let cat_count of data){
        let catexist = false;
        if(cat_count != null){
          for(let category of cat_count){
            if(category.category_code == dataLabel){
              subArray.push(category.request_count);
              catexist = true;
              break;
            }
          }
        }
        if(!catexist)
          subArray.push(0);
      }
      datasetsArray.push({
        label: dataLabel,
        backgroundColor: this.getColor(index),
        data: subArray
      });
      index++;
    }

    let chartData = {
      type: type,
      data: {
        labels : labels,
        datasets : datasetsArray
      },
      options: {
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                autoSkip: false
              }
            }],
            yAxes: [{
              stacked: true
            }]
          }
      }
    }
    this.chartDataSource.next(chartData);
  }

  setResponseTimeChartData(data:any, labels:any, type: string){
    let minTimeArray = [];
    let maxTimeArray = [];
    let avgTimeArray = [];
    for(let reportdata of data){
      minTimeArray.push(reportdata.min_response_days);
      avgTimeArray.push(reportdata.avg_response_days);
      maxTimeArray.push(reportdata.max_response_days);
    }
    let datasetsArray = [];
    datasetsArray.push(
      {
        label: 'Min Time',
        backgroundColor: this.COLORS[0],
        data: minTimeArray,
        stack: 'Stack 0',
      },
      {
        label: 'Avg Time',
        backgroundColor: this.COLORS[1],
        data: avgTimeArray,
        stack: 'Stack 1',
      },
      {
        label: 'Max Time',
        backgroundColor: this.COLORS[2],
        data: maxTimeArray,
        stack: 'Stack 2',
      }
    )

    let chartData = {
      type: type,
      data: {
        labels : labels,
        datasets : datasetsArray
      },
      options: {
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                autoSkip: false
              }
            }]
          }
      }
    }
    this.chartDataSource.next(chartData);
  }
  resetChartData(){
    this.chartDataSource.next(null);
  }

  setReportFilter(filter:any){
    this.filterDataSource.next(filter);
  }

  getColor(index:number):string{
    return this.COLORS[index % this.COLORS.length];
  }

  setProjectFilter(filter:any){
    this.projectFilterDataSource.next(filter);
  }

  setProjectData(data:any){
    this.projectDataSource.next(data);
  }

}
