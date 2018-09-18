import { Injectable }   from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService }  from './authentication.service';

@Injectable()
export class RequesterAuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.currentUserRoles.some(role => role.role_id === 1)){
      return true;
    }
    else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
