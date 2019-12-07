import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '@gw-services/authentication';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      // check if route is restricted by role
      if (route.data.roles) {
        // role not authorised so redirect to home page
        // check role of user-account
        let isValidRole = false;
        for (const eachRole of route.data.roles) {
          if (currentUser.roles.indexOf(eachRole) !== -1) {
            isValidRole = true;
            break;
          }
        }
        if (!isValidRole) {
          this.router.navigate(['/']);
          return false;
        }
      }
      // logged in and authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
