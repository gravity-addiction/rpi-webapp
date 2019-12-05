import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class AuthGuardLoggedOut implements CanActivate {

  constructor(
      private router: Router,
      private authService: AuthenticationService
  ) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token: any = this.authService.authToken;
    if (!token) { return true; }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/']);
    return false;
  }
}
