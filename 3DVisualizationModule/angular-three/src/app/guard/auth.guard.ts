// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {

    const expectedRole = route.data['expectedRoles'] as number;

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      console.log('Expected Role:', expectedRole);
      if (role === expectedRole.toString()) {
        return true;
      } else {
        // Redirect to unauthorized page or login
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      // If no token, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }

  /*
  check If the user is logged in
  if(localStorage.getItem('user')) { return true; }
  not logged in so redirect to login page
  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false*/

}
