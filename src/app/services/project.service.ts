import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of , forkJoin, throwError, Subject} from 'rxjs';
import { catchError, map, mergeMap, groupBy, filter , toArray} from 'rxjs/operators';
import { Project, Permit } from '../classes/project';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private erdTrackerServicesUrl:string;  // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient,
              private authService: AuthenticationService)
              {
                this.erdTrackerServicesUrl = authService.appSettings.service_url
               }
   getProjectsByManager(): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetProjectsByManagerId";
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getProjectsByManager', []))
     );
   }

   getAllProjects(): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetAllProjects";
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getAllProjects', []))
     );
   }

   getProjectInfoByProjectId(project_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetProjectByProjectId?project_id=" + project_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getProjectInfoByProjectId', []))
     );
   }

   getProjectPermit(project_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetPermitByProjectId?project_id=" + project_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getProjectPermit', []))
     );
   }

   getProjectManagers(project_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetProjectManagersByProjectId?project_id=" + project_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getProjectManagers', []))
     );
   }

   getProcurementPhase(project_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetProcumentPhaseByProjectId?project_id=" + project_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getProcurementPhase', []))
     );
   }

   getConstructionPhaseInfo(project_id: number): Observable<any>{
     const url = this.erdTrackerServicesUrl + "Project/GetConstructionPhaseByProjectId?project_id=" + project_id;
     return this.http.get<any>(url)
     .pipe(
       catchError(this.handleError('getConstructionPhaseInfo', []))
     );
   }

   createNewProject(newProject:Project): Observable<any>{
     let body = JSON.stringify(newProject);
     const url = this.erdTrackerServicesUrl + "Project/CreateProject";
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('createNewProject', []))
     );
   }

   updateProjectGeneral(editProject:Project): Observable<any>{
     let body = JSON.stringify(editProject);
     const url = this.erdTrackerServicesUrl + "Project/UpdateProject";
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('updateProjectGeneral', []))
     );
   }

   updateProjectPermit(permit:Permit): Observable<any>{
     let body = JSON.stringify(permit);
     const url = this.erdTrackerServicesUrl + "Project/UpdatePermit";
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('updateProjectPermit', []))
     );
   }

   updateProcurementPhase(procurement_phase:any): Observable<any>{
     let body = JSON.stringify(procurement_phase);
     const url = this.erdTrackerServicesUrl + "Project/UpdateProcumentPhase";
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('updateProcurementPhase', []))
     );
   }

   assignManagers(project_id:number, users:any): Observable<any>{
     let body = JSON.stringify(users);
     const url = this.erdTrackerServicesUrl + "Project/AssignManager?project_id=" + project_id;
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('assignManagers', []))
     );
   }

   updateConstructionPhase(construction_phase:any): Observable<any>{
     let body = JSON.stringify(construction_phase);
     const url = this.erdTrackerServicesUrl + "Project/UpdateConstructionPhase";
     return this.http.post(url, body, this.httpOptions)
     .pipe(
       catchError(this.handleError('updateConstructionPhase', []))
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
