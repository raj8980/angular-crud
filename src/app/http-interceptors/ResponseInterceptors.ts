import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomresponseInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    
   
      return <any>  next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          console.log("sddfsdfsdf:"+event); 
         
          if (event instanceof HttpResponse) {
            const se=event.headers;
            console.log(se.keys().length+"::"+se.keys().toString());
            if (event.status == 200 && event.body) {
              event.body.performance = 'Excellent';
            }
           
            return <any> event;
          }
        })
      );
    
    return next.handle(request);
  }
}