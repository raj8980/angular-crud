import { ApplicationPipesModule } from './pipelines/app-pipe.module';

import { HttpService } from './services/http.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { reducers, metaReducers } from '../app/users/reducers';
import { CreateUserEffects } from '../app/users/effects/create-user.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { SearchUserEffects } from './users/effects/search-user.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthInterceptor } from './http-interceptors/AuthInterceptors';
import { AlertComponent } from './components/alert/alert.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LogoutComponent } from './components/logout/logout.component';
import { MaterialModule } from './material.module';
import { AuthService } from './services/auth.service';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EncdecService } from './services/encdec.service';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    AboutUsComponent,
    LogoutComponent,
    ServerErrorComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers,{metaReducers}),
    EffectsModule.forRoot([CreateUserEffects, SearchUserEffects, SearchUserEffects]),
    HttpClientModule,
    DataTablesModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ApplicationPipesModule,
    CKEditorModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  },
  HttpService,
  AuthService,
  EncdecService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
