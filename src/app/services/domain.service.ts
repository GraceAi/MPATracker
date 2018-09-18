import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  constructor(private http: HttpClient) { }

  getStatus(service_url:string): Observable<any>{
    const url = service_url + "Domain/GetStatus";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getStatus', []))
    );
  }
  getCategories(service_url:string): Observable<any>{
    const url = service_url + "Domain/GetCategories";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getCategories', []))
    );
  }
  getDepartments(service_url:string): Observable<any>{
    const url = service_url + "Domain/GetDepartments";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getDepartments', []))
    );
  }
  getContacts(service_url:string): Observable<any>{
    const url = service_url + "Domain/GetContacts";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getContacts', []))
    );
  }
  getLocations(service_url:string): Observable<any>{
    const url = service_url + "Domain/GetLocations";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getLocations', []))
    );
  }
  getRequesters(service_url:string): Observable<any>{
    const url = service_url + "Admin/GetUserByRole/1";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRequesters', []))
    );
  }
  getAllReviewers(service_url:string): Observable<any>{
    const url = service_url + "Admin/GetUserByRole/2";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAllReviewers', []))
    );
  }

  getAllUsers(service_url:string):Observable<any>{
    const url = service_url + "Domain/GetUsers";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAllUsers', []))
    );
  }

  getAllSidetabs(service_url:string):Observable<any>{
    const url = service_url + "Domain/GetSideTabs";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getAllSidetabs', []))
    );
  }

  getRoles(service_url:string):Observable<any>{
    const url = service_url + "Domain/GetRoles";
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError('getRoles', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
