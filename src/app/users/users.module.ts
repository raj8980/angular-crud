import { ApplicationPipesModule } from './../pipelines/app-pipe.module';

import { HttpService } from './../services/http.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { DialogContentExampleDialog, UsersComponent } from './users.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { DeleteDialog, SearchUsersComponent } from './search-users/search-users.component';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CountryDetailsService } from './services/country-details.service';
import { UserTypeService } from './services/user-type.service';
import { CompanyTypeService } from './services/company-type.service';
import { ThemeComponent } from './theme/theme.component';
import { AuthInterceptor } from '../http-interceptors/AuthInterceptors';
import { MaterialModule } from '../material.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    UsersComponent,
    ViewUsersComponent,
    SearchUsersComponent,
    ThemeComponent,
    DeleteDialog,
    DialogContentExampleDialog],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    DataTablesModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    MaterialModule,
    CKEditorModule,
    ApplicationPipesModule
  ],
  providers:[
  {
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  },
    CountryDetailsService,
    UserTypeService,
    CompanyTypeService,
    HttpService
  ]
})

export class UsersModule { }
