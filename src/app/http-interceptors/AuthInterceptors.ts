
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoaderService } from '../components/loader/loader.service';
import { AuthService } from '../services/auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, public loaderService: LoaderService,
    private tokenExtractor: HttpXsrfTokenExtractor, private router: Router,private authService:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loaderService.isLoading.next(true);
    // Get the auth token from the service.
    const authToken = this.cookieService.get('authToken');
    const xsrfToken = this.cookieService.get('XSRF-TOKEN');
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    let loginUrl: string = '/api/login';
    let loginCnt = req.url.indexOf(loginUrl);
    let logoutUrl: string = '/api/logout';
    let logoutCnt = req.url.indexOf(logoutUrl);

    if (loginCnt < 0 || logoutCnt < 0) {

      let headers;

      let requestMethod: string = req.method;
      requestMethod = requestMethod.toLowerCase();

      if (requestMethod && (requestMethod === 'get' || requestMethod === 'post' || requestMethod === 'delete' || requestMethod === 'put')) {
        const headerName = 'XSRF-TOKEN';
        const respHeaderName = 'X-XSRF-TOKEN';
        let token = this.tokenExtractor.getToken() as string;
        // console.log("token:" + token);
        // if (token != null && !req.headers.has(headerName)) {
        //   headers = new HttpHeaders({
        //     'Access-Control-Allow-Headers': 'Content-Type,X-XSRF-TOKEN,X-Auth-Token',
        //     'X-Auth-Token': authToken,
        //     respHeaderName: token
        //   });
        // } else {
        headers = new HttpHeaders({
          'X-Auth-Token': authToken,
          'XSRF-Token': xsrfToken
        });
        //}
      }


      const authReq = req.clone({ headers: headers });

      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.authService.isLogin=false;
            this.cookieService.delete('authToken','/');
            this.cookieService.delete('XSRF-TOKEN','/');
            
            this.router.navigate(['unauthorized-access']);
          } else {
            this.router.navigate(['server-error']);
          }
          return throwError(error);
        }),
        finalize(
          () => {
            setTimeout(() => { this.loaderService.isLoading.next(false); }, 1000);
          }
        )
      );
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.authService.isLogin=false;
          this.cookieService.delete('authToken','/');
          this.cookieService.delete('XSRF-TOKEN','/');

          this.router.navigate(['unauthorized-access']);
        } else {
          this.router.navigate(['server-error']);
        }
        return throwError(error);
      }),
      finalize(
        () => {
          setTimeout(() => { this.loaderService.isLoading.next(false); }, 1000);
        }
      )
    );;


  }
}