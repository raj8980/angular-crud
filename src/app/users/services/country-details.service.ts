import { Country } from './../models/country';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CountryDetailsService implements Resolve<any> {

  constructor(private http:HttpClient,private cookieService:CookieService){}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.http.get(environment.apiurl+"/get-country").pipe(catchError(err=> err));
  }

}
