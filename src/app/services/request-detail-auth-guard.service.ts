import { Injectable }   from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService }  from './authentication.service';

@Injectable()
export class RequestDetailAuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //let request_id = +route.paramMap.get('requestId');
    let role_id = +route.paramMap.get('roleId');
    if(this.authService.currentUserRoles.some(role => role.role_id === role_id)){
      return true;
    }
    else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
