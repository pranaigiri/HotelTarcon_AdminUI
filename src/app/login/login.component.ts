import { Component, OnInit } from '@angular/core';
import { AuthService } from '../helpers/auth.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //Pattern Applies for both username and password
  pattern: RegExp = /^[a-zA-Z0-9@.-]{6,}$/
  credentials: any = {};
  url: string = "Booking/AdminLogin";
  errorMsgWithInstruction = "Sorry, we couldn't find an account with that username and password combination. Please check your login credentials and try again, or reset your password if you've forgotten it.";
  errorMsg = "Invalid username or password. Please check your login credentials and try again."
  logoUrl: string = "https://tarconsikkim.in/assets/tarcon_logo.png";
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router, private toaster: HotToastService) {
    this.authService.logout();
  }

  ngOnInit() {
  }

  submit() {
    let error = false;
    // alert(this.credentials.username);
    // alert(this.credentials.password);
    if (this.pattern.test(this.credentials.password) && this.pattern.test(this.credentials.username)) {

      this.apiService.login(this.url, this.credentials, this.errorMsg).subscribe((res: any) => {
        console.log("Authenticated !");
        this.authService.storeAuthenticationToken(res.result.toString());
        this.router.navigate(["/form"]);
      });

    }
    else {
      error = true;
    }

    if (error == true) {
      this.apiService.handleLoginError(this.errorMsg);
    }
  }

}
