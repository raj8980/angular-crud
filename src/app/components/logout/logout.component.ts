import { AuthService } from './../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit{

  constructor(private loginService:LoginService,private cookieService:CookieService,private router: Router,
    private authService:AuthService,private titleService:Title,private metaTagService:Meta) { }

  
  // on logout page delete all session and local storage data and redirect to home page  
  ngOnInit(){
    this.titleService.setTitle("Logout User");
    this.metaTagService.updateTag({name:"Logout User", content:"User is Logged out"});
    this.loginService.logout();
    this.cookieService.delete('authToken','/');
    this.cookieService.delete('XSRF-TOKEN','/');
    this.router.navigate(['']);
    this.router.routerState.snapshot.url='';
    this.authService.isLogin=false;
    localStorage.removeItem('search-user-page-index');
    localStorage.removeItem('search-user-page-tab-index');
  }
  
  
}
