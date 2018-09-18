import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, EMPTY }  from 'rxjs';
import { map, take, mergeMap }   from 'rxjs/operators';

import { RequestDetail } from '../classes/request';
import { RequestService }  from './request.service';

@Injectable()
export class RequestDetailResolver implements Resolve<RequestDetail> {
  constructor(private requestService: RequestService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let request_id = +route.paramMap.get('requestId');
    let role_id = +route.paramMap.get('roleId');
    return this.requestService.getRequestDetail(request_id, role_id).pipe(
      take(1),
      map(result => {
        if (result) {
          return result;
        } else {
          return null;
        }
      })
    );
  }
}
