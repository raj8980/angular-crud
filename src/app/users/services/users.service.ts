import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, Subscription, throwError } from 'rxjs';
import { State } from '../models/state';
import { user } from '../models/user';
import { SearchUsers } from '../models/searchUsers';
import { PageData } from '../models/pagedata';
import { Users } from '../models/users';
import { CookieService } from 'ngx-cookie-service';
import { success } from '../models/success';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private cookieService:CookieService,private http:HttpClient){}
  
  subscription: Subscription = new Subscription;

  getUserDetails(id: string) {
     return this.http.post<Users>(environment.apiurl+"/get-user",id).pipe(map(user=>{
       user.pastExp.forEach(
         function(value){
         }
       )
     }));
  }
  
 
  getPageWiseData(pageData:PageData) {
    
    return this.http.post<SearchUsers[]>(environment.apiurl+"/ajax-search-users",pageData);
  }


  saveUserDetails(users: Object) {
    interface userSave{
      status:number,
      userID:number
    }
    return this.http.post<userSave>(environment.apiurl+"/save-user-detail", users);
    
  }
  
  loadState(countryId:number){
    return this.http.post<State[]>(environment.apiurl+"/state-by-country-id",countryId);
  }
  
  searchUserDetails(params:Object) {
    return this.http.post<SearchUsers[]>(environment.apiurl+"/search-users",params);
  }

  loadExcel(params:Object) {
    return this.http.post(environment.apiurl+"/download-excel",params);
  }
  
  downloadExcel(): Observable<Blob> {
    //window.location.href = environment.apiurl+"/download-excel";
    return this.http.get(environment.apiurl+"/download-excel",{ responseType: 'blob' });
  }

  duplicateCheckEmail(emailId:String){
    return this.http.post<String>(environment.apiurl+"/duplicate-check-email",emailId);
  }

  // saveDocumentDetails(value:FormData){
  //   this.http.post(environment.apiurl+"/upload-file",value,{
  //     headers: {'Content-Type': 'multipart/form-data'}
  //   }).subscribe();

    
  // }


  downloadPDF(): Observable<Blob> {
    //window.location.href = environment.apiurl+"/download-excel";
    return this.http.get(environment.apiurl+"/generate-pdf",{ responseType: 'blob' });
  }


  public upload(formData:any) {
    
    return this.http.post<FormData>(environment.apiurl+"/upload-file", formData, {  
        reportProgress: true,  
        observe: 'events'  
      });  
  }


  deactivateUser(userID:Number){
    return this.http.post<success>(environment.apiurl+"/deactive-status",userID);
  }

  activateUser(userID:Number){
    return this.http.post<success>(environment.apiurl+"/active-status",userID);
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (err.status != 200) {
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        
      }
    }

    return throwError(errorMessage);
  }


}
