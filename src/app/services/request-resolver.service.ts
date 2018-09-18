import { Injectable }  from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable }  from 'rxjs';
import { map, take }   from 'rxjs/operators';

import { AuthenticationService }  from './authentication.service';
import { Tab } from '../classes/domain';

@Injectable()
export class RequestResolver implements Resolve<Tab[]> {
  constructor(private authService: AuthenticationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.authService.getTabsByUser().pipe(
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
