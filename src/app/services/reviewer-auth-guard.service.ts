import { Injectable }   from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService }  from './authentication.service';

@Injectable()
export class ReviewerAuthGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.currentUserRoles.some(role => role.role_id === 2)){
      return true;
    }
    else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
