import { EncdecService } from './../../services/encdec.service';
import { success } from './../../users/models/success';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit,OnDestroy  {

  title = 'Rubber Board 22';

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router,
     private cookieService: CookieService,private encDecService: EncdecService
    ,private authService:AuthService,private titleService:Title,private metaTagService:Meta) { }
  
  hide = true;
  isAuth=true;
  
  //reactive login form with basic validators
  loginForm: FormGroup = this.fb.group({
    emailid: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get loginFormControl() { return this.loginForm.controls; }

  //subscription for handle unsubscribe
  subscription: Subscription = new Subscription;

  ngOnInit(){
      this.titleService.setTitle("Login User");
      this.metaTagService.updateTag({name:"Login User", content:"User Login Page"});
  }

  // on login button click
  onSubmit() {
    // get login form value
    const form = this.loginForm.value;

    var encrypted=this.encDecService.set(environment.key,form.emailid + ':' + form.password);
    // get value using subscribe method and add to subscription for unsubscribe method
    var subscription1=  this.loginService.login(encrypted).subscribe(resp => {

      // response status 401 then user unauthorized
      if (resp.status == 401) {
        this.isAuth=false;
      }

      // response status is 200 then request is authorized
      // add cookie based on response and navigate to search user page
      if (resp.status == 200) {
        this.isAuth=true;
        this.authService.isLogin=true;
        this.cookieService.set('authToken', resp.authToken,{path:'/',sameSite:"Strict"});
        this.cookieService.set('XSRF-TOKEN',resp.csrfToken,{path:'/',sameSite:"Strict"});
        this.cookieService.set('authRole',resp.authRole);
        this.router.navigate(['/users/search-user']);
      }

    });
    this.subscription.add(subscription1);
  }

  // logout() {
  //   this.loginService.logout();
  //   this.cookieService.delete('authToken');
  //   this.router.navigate(['']);
  // }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
