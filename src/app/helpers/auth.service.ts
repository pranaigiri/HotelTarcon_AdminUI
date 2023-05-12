import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

interface user {
  email: string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userObj: user = {
    email: ''
  };
  private baseUrl: string = "https://localhost:44370/api/Auth/";
  constructor(private http: HttpClient, private router: Router) { }


  login(postObj: any) {
    return this.http.post(`${this.baseUrl}login`, postObj);
  }

  logout() {
    sessionStorage.clear();
    this.redirectToHome();
  }

  isAuthenticated(): boolean {
    var token = sessionStorage.getItem("authenticationtoken");
    return token != null ? true : false;
  }

  storeAuthenticationToken(token: string) {
    sessionStorage.setItem("authenticationtoken", token);
    this.getUserProfile();
  }

  deleteAuthenticationToken() {
    sessionStorage.clear();
  }

  getAuthenticationToken() {
    var token = sessionStorage.getItem("authenticationtoken");
    return token;
  }

  decodedToken() {
    let token = sessionStorage.getItem("authenticationtoken");
    if (token != null) {
      return jwt_decode(token.toString());
    }
    else {
      return null;
    }
  }

  getUserProfile(): user {
    let token: any = this.decodedToken();
    this.userObj.email = token.email;
    return this.userObj;
  }

  redirectToHome() {
    this.router.navigate([""]);
  }

}
