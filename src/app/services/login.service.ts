import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { success } from '../users/models/success';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(form:any){
    return this.http.post<success>(environment.apiurl + "/login", form);
  }

  logout(){
    return this.http.post(environment.apiurl + "/logout", null);
  }
}
