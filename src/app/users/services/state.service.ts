import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class StateService implements Resolve<any>  {
  
  constructor(private http: HttpClient,private cookieService:CookieService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let id=route.paramMap.get('id');
    return this.http.post<State>(environment.apiurl+"/get-state",id);
  }
}
