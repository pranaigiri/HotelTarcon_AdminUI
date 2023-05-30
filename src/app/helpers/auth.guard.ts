import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService,) {
  }
  canActivate(next: ActivatedRouteSnapshot): boolean {
    console.clear();
    var handler = new JwtHelperService();
    var token = this.auth.getAuthenticationToken();
    if (token != null) {
      console.log("Authenticated :", this.auth.isAuthenticated());
      console.log("Token Expired :", !handler.getTokenExpirationDate(token));
      if (this.auth.isAuthenticated() && !handler.isTokenExpired(token)) {
        return true;
      }
    }
    this.auth.redirectToHome();
    return false;
  }

}
