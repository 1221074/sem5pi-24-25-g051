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

    if (token) {
      console.log('Role:', this.authService.userRole);
      console.log('Expected Role:', expectedRole);
      if ( this.authService.userRole === expectedRole.toString()) {
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
}
