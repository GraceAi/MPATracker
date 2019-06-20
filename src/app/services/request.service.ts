import { Injectable } from '@angular/core';
//import {Contract} from '../classes/domain';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of , forkJoin, throwError, Subject} from 'rxjs';
import { catchError, map, mergeMap, groupBy, filter , toArray} from 'rxjs/operators';
import { RequestGeneral, RequestContract, RequestContact, RequestPwLink, RequestComment, RequestDetail } from '../classes/request';
import { ReturnedRequest } from '../classes/returnedrequest';
import { Role } from '../classes/domain';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private erdTrackerServicesUrl:string;  // URL to web api
  private unlocked:boolean = false;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(private http: HttpClient,
              private authService: AuthenticationService)
              {
                this.erdTrackerServicesUrl = authService.appSettings.service_url,
                authService.unlocked.subscribe(result => { this.unlocked = result})
               }

  getSubTabsByCategoryId(category_id: number, role_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetSideTabsByCategoryAndRole/?cat_id=" + category_id + "&role_id=" + role_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getSubTabsByCategoryId', []))
    );
  }

  getRequestsByRequester(): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTasksByRequestor";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestsByRequester', []))
    );
  }

  getAllRequests(): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetAllTasks";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAllRequests', []))
    );
  }

  getRequestsByReviewer(): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTasksByReviewer";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestsByReviewer', []))
    );
  }

  getRequestDetail(request_id: number, role_id:number): Observable<RequestDetail>{
      const generalurl = this.erdTrackerServicesUrl + "Request/GetTaskGenerals/" + request_id;
      const sidetaburl = this.erdTrackerServicesUrl + "Request/GetSideTabsByCategoryAndRole/?cat_id=";
      return this.http.get(generalurl).pipe(
        mergeMap((generalInfo: any) => {
          return forkJoin(
           of(generalInfo),
           this.http.get(sidetaburl + generalInfo.category_id + "&role_id=" + role_id + "&request_id=" + request_id)
          )
          .pipe(
            map((data: any[]) => {
              let requestDetail = new RequestDetail();
              requestDetail.generalInfo = data[0];
              requestDetail.sideTabs = data[1];
              return requestDetail;
            })
          )
        })
      )
  }

  getGeneralInfo(request_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Request/GetTaskGenerals/" + request_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getGeneralInfo', []))
     );
  }

  getRequestComments(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskComments/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestComments', []))
    );
  }

  getRequestContracts(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskContracts/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestContracts', []))
    );
  }

  getRequestLinks(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskLinks/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestLinks', []))
    );
  }

  getRequestDocuments(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskDocuments/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestDocuments', []))
    );
  }

  getRequestContacts(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskContacts/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestContacts', []))
    );
  }

  getRequestReviewers(request_id: number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/GetTaskReviewers/" + request_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequestReviewers', []))
    );
  }

  getAutoAssignedReviewersByCatId(cat_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "User/GetAutoAssignedUsersByCategory/" + cat_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAutoAssignedReviewersByCatId', []))
    );
  }

  autoAssignReviewersByCatId(cat_id:number, users:any): Observable<any>{
    let body = JSON.stringify(users);
    const url = this.erdTrackerServicesUrl + "User/AutoAssignUsersByCategoryId?id=" + cat_id;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('autoAssignReviewersByCatId', []))
    );
  }

  updateRequestGeneral(generalinfo:any): Observable<any>{
    let body = JSON.stringify(generalinfo);
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskGeneral?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateRequestGeneral', []))
    );
  }

  /*getNewRequestDetail(request_id:number): Observable<RequestDetail>{
    const sidetaburl = this.erdTrackerServicesUrl + "Request/GetSideTabsByCategory/" + this.category_id;
    const genneralInfourl = this.erdTrackerServicesUrl + "Request/GetTaskGenerals/" + request_id;
    return forkJoin(
     this.http.get(sidetaburl),
     this.http.get(genneralInfourl)
     //this.http.post(newrequesturl, this.httpOptions)
    )
    .pipe(
      map((data: any[]) => {
        let requestDetail = new RequestDetail();
        requestDetail.sideTabs = data[0];
        requestDetail.generalInfo = data[1];
        return requestDetail;
      })
    )
  }*/

  createNewRequest(category_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/CreateNewTask?cat_id=" + category_id;
    return this.http.post(url, this.httpOptions)
    .pipe(
      catchError(this.handleError('createNewRequest', []))
    );
  }

  deleteRequest(request_id): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/DeleteTask?task_id=" + request_id;
    return this.http.post(url, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequest', []))
    );
  }

  submitRequest(request:any): Observable<any>{
    let body = JSON.stringify(request);
    const url = this.erdTrackerServicesUrl + "Request/SubmitRequest";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('submitRequest', []))
    );
  }

  completeRequest(request:any): Observable<any>{
    let body = JSON.stringify(request);
    const url = this.erdTrackerServicesUrl + "Request/CompleteRequest";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('completeRequest', []))
    );
  }

  addRequestContract(contract:RequestContract): Observable<any>{
    let body = JSON.stringify(contract);
    const url = this.erdTrackerServicesUrl + "Request/AddTaskContract?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('AddRequestDocument', []))
    );
  }

  deleteRequestContract(contract:RequestContract): Observable<any>{
    let body = JSON.stringify(contract);
    const url = this.erdTrackerServicesUrl + "Request/DeleteTaskContract?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequestContract', []))
    );
  }

  addRequestLink(pwLink:RequestPwLink): Observable<any>{
    let body = JSON.stringify(pwLink);
    const url = this.erdTrackerServicesUrl + "Request/AddTaskLink?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('addRequestLink', []))
    );
  }

  deleteRequestLink(pwLink:RequestPwLink): Observable<any>{
    let body = JSON.stringify(pwLink);
    const url = this.erdTrackerServicesUrl + "Request/DeleteTaskLink?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequestLink', []))
    );
  }

  editRequestLink(pwLink:RequestPwLink): Observable<any>{
    let body = JSON.stringify(pwLink);
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskLink?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('editRequestLink', []))
    );
  }

  addRequestComment(comment:RequestComment): Observable<any>{
    let body = JSON.stringify(comment);
    const url = this.erdTrackerServicesUrl + "Request/AddTaskComment";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('addRequestComment', []))
    );
  }

  addRequestContact(contact_id:number, request_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/AddTaskContact/?contact_id=" + contact_id + "&request_id=" + request_id+ "&unlock=" + this.unlocked;
    return this.http.post(url, this.httpOptions)
    .pipe(
      catchError(this.handleError('addRequestContact', []))
    );
  }

  deleteRequestContact(contact:RequestContact): Observable<any>{
    let body = JSON.stringify(contact);
    const url = this.erdTrackerServicesUrl + "Request/DeleteTaskContact?unlock = " + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequestContact', []))
    );
  }

  editRequestContact(contact:RequestContact): Observable<any>{
    let body = JSON.stringify(contact);
    const url = this.erdTrackerServicesUrl + "Request/UpdateContact?unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('editRequestContact', []))
    );
  }

  newRequestContact(newContact:any): Observable<any>{
    let body = JSON.stringify(newContact);
    const url = this.erdTrackerServicesUrl + "Request/AddNewContact";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('newRequestContact', []))
    );
  }

  addRequestDocument(file:File, newDoc:any, sequence_id:string): Observable<any>{
    //console.log(file);
    const url = this.erdTrackerServicesUrl + "Request/PostTaskDocument?sequence_id=" + sequence_id + "&unlock=" + this.unlocked;
    //let body = JSON.stringify(newDoc);
    const formData = new FormData();
    formData.append('uploadFile',file,file.name);
    formData.append('newDoc', JSON.stringify(newDoc))
    const options = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    return this.http.post(url, formData, options)
    .pipe(
      catchError(this.handleError('AddRequestDocument', []))
    );
  }

  updateRequestDocument(editDoc:any): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskDocument?unlock=" + this.unlocked;
    let body = JSON.stringify(editDoc);
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateRequestDocument', []))
    );
  }

  deleteRequestDocument(doc:any, sequence_id:string): Observable<any>{
    let body = JSON.stringify(doc);
    const url = this.erdTrackerServicesUrl + "Request/DeleteTaskDocument?sequence_id=" + sequence_id + "&unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequestDocument', []))
    );
  }

  downloadRequestDocument(doc:any, sequence_id:string): Observable<any>{
    let body = JSON.stringify(doc);
    const url = this.erdTrackerServicesUrl + "Request/ExportFile?sequence_id=" + sequence_id ;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, {
        headers: headers,
        responseType: 'blob'
    })
    .pipe(
      catchError(this.handleError('downloadRequestDocument', []))
    );
  }

  assignReviewers(request_id:number, users:any): Observable<any>{
    let body = JSON.stringify(users);
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskReviewers?id=" + request_id ;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('assignReviewers', []))
    );
  }

  updateLocationPt(locationPt:any, request_id:number): Observable<any>{
    let body = JSON.stringify(locationPt);
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskLocationPoint?request_id=" + request_id + "&unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateLocationPt', []))
    );
  }

  updateLocationPoly(locationPoly:any, request_id:number): Observable<any>{
    let body = JSON.stringify(locationPoly);
    const url = this.erdTrackerServicesUrl + "Request/UpdateTaskLocationPoly?request_id=" + request_id + "&unlock=" + this.unlocked;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('updateLocationPoly', []))
    );
  }

  getAssignedUsersByRoleId(role_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Admin/GetUserByRole/" + role_id;
    return this.http.get(url, this.httpOptions)
    .pipe(
      catchError(this.handleError('getAssignedUsersByRoleId', []))
    );
  }

  assignUsersByRoleId(role_id:number, users:any): Observable<any>{
    let body = JSON.stringify(users);
    const url = this.erdTrackerServicesUrl + "Admin/AssignUsersToRole?role_id=" + role_id;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('assignUsersByRoleId', []))
    );
  }

  assignSidetabsByCategoryId(cat_id:number, sidetabs:any): Observable<any>{
    let body = JSON.stringify(sidetabs);
    const url = this.erdTrackerServicesUrl + "Admin/AssignSidetabsToCategory?category_id=" + cat_id;
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('assignSidetabsByCategoryId', []))
    );
  }

  getSidetabsByCategory(category_id):Observable<any>{
    const url = this.erdTrackerServicesUrl + "Admin/GetSideTabsByCategory/" + category_id;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAllSidetabs', []))
    );
  }

  addCategory(category:any): Observable<any>{
    let body = JSON.stringify(category);
    const url = this.erdTrackerServicesUrl + "Admin/AddNewCategory";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('addCategory', []))
    );
  }

  editCategory(category:any): Observable<any>{
    let body = JSON.stringify(category);
    const url = this.erdTrackerServicesUrl + "Admin/EditCategory";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('editCategory', []))
    );
  }

  addRequesterDept(dept:any): Observable<any>{
    let body = JSON.stringify(dept);
    const url = this.erdTrackerServicesUrl + "Admin/AddRequesterDept";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('addRequesterDept', []))
    );
  }

  editRequesterDept(dept:any): Observable<any>{
    let body = JSON.stringify(dept);
    const url = this.erdTrackerServicesUrl + "Admin/EditRequesterDept";
    return this.http.post(url, body, this.httpOptions)
    .pipe(
      catchError(this.handleError('editRequesterDept', []))
    );
  }

  deleteRequesterDept(dept_id:number): Observable<any>{
    const url = this.erdTrackerServicesUrl + "Admin/DeleteRequesterDept/?dept_id=" + dept_id;
    return this.http.post(url, this.httpOptions)
    .pipe(
      catchError(this.handleError('deleteRequesterDept', []))
    );
  }

  getCategoryRequestReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetReportByCategory";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getReportByCategory', []))
    );
    /*const url = this.erdTrackerServicesUrl + "Request/GetAllTasks"; //GetAllTasks
    return this.http.get<any>(url).pipe(
      map(
        result => {
          //console.log(`all result`, result);
          let source = result;
          return from(source).pipe(
            filter((a:ReturnedRequest) =>
            criteria == null || ((a.category_id == criteria.cat_id || criteria.cat_id == null)
            && (a.requestor_id == criteria.requestor_id || criteria.requestor_id == null)
            && (a.deptmt_id == criteria.deptmt_id || criteria.deptmt_id == null)
            && ((a.str_reviewers != null && a.str_reviewers.includes(criteria.reviewer_name)) || criteria.reviewer_name == null)
            && (new Date(a.create_date).setHours(0, 0, 0, 0) >= new Date(criteria.start_date).setHours(0, 0, 0, 0) || criteria.start_date == null)
            && (new Date(a.create_date).setHours(0, 0, 0, 0) <= new Date(criteria.end_date).setHours(0, 0, 0, 0) || criteria.end_date == null))),
            groupBy((a:ReturnedRequest) => a.category_code),
            mergeMap(group => group.pipe(toArray()))
          );
        }
      )
    )*/
  }

  getRequesterRequestReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetReportByRequester";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getReportByRequester', []))
    );
    /*const url = this.erdTrackerServicesUrl + "Request/GetAllTasks"; //GetAllTasks
    return this.http.get<any>(url).pipe(
      map(
        result => {
          //console.log(`all result`, result);
          let source = result;
          return from(source).pipe(
            filter((a:ReturnedRequest) =>
            criteria == null || ((a.category_id == criteria.cat_id || criteria.cat_id == null)
            && (a.requestor_id == criteria.requestor_id || criteria.requestor_id == null)
            && (a.deptmt_id == criteria.deptmt_id || criteria.deptmt_id == null)
            && ((a.str_reviewers != null && a.str_reviewers.includes(criteria.reviewer_name)) || criteria.reviewer_name == null)
            && (new Date(a.create_date).setHours(0, 0, 0, 0) >= new Date(criteria.start_date).setHours(0, 0, 0, 0) || criteria.start_date == null)
            && (new Date(a.create_date).setHours(0, 0, 0, 0) <= new Date(criteria.end_date).setHours(0, 0, 0, 0) || criteria.end_date == null))),
            groupBy((a:ReturnedRequest) => a.requestor_id),
            mergeMap(group => group.pipe(toArray()))
          );
        }
      )
    )*/
  }

  getReviewerRequestReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetReportByReviewer";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getReviewerRequestReportData', []))
    );
  }

  getReviewerReponseReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetResponseTimeByReviewer";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getReviewerReponseReportData', []))
    );
  }

  getCategoryReponseReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetResponseTimeByCategory";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getCategoryReponseReportData', []))
    );
  }

  getStatusReportData(criteria:any): Observable<any>{
    let body = JSON.stringify(criteria);
    const url = this.erdTrackerServicesUrl + "Report/GetReportByStatus";
    return this.http.post(url, body, this.httpOptions).pipe(
      catchError(this.handleError('getStatusReportData', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  }
}
