import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin=false;
  constructor(private cookieService:CookieService) { }

  isAuth(){
    this.isLogin=!!this.cookieService.get('authToken');
    return this.isLogin;
  }
  
}
