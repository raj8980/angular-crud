import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class EditUserService  implements Resolve<any>{
  constructor(private http: HttpClient,private cookieService:CookieService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    let id=route.paramMap.get('id');
    return this.http.post<Users>(environment.apiurl+"/get-user",id);
  }
}
