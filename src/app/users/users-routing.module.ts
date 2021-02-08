import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import * as fromAdmin from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { CreateUserEffects } from './effects/create-user.effects';
import { UsersComponent } from './users.component';
import { CountryDetailsService } from './services/country-details.service';
import { UserTypeService } from './services/user-type.service';
import { CompanyTypeService } from './services/company-type.service';
import { SearchUsersComponent } from './search-users/search-users.component';
import { EditUserService } from './services/edit-user.service';
import { StateService } from './services/state.service';
import { AdminGuard } from '../admin/admin.guard';
import { ViewUsersComponent } from './view-users/view-users.component';

const routes: Routes = [
  {
    path: 'create-user',
    component: UsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService
    },
    canActivate: [AdminGuard]
  },
  {
    path: 'search-user',
    component: SearchUsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService
    },
    canActivate: [AdminGuard]
  },
  {
    path: 'search-user/:id',
    component: SearchUsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService
    },
    canActivate: [AdminGuard]
  },
  {
    path: 'edit-user/:id',
    component: UsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService,
      userDtl: EditUserService,
      states: StateService
    },
    canActivate: [AdminGuard]
  },
  {
    path: 'view-user/:id',
    component: ViewUsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService,
      userDtl: EditUserService,
      states: StateService
    },
    canActivate: [AdminGuard]
  },
  {
    path: 'search-user/:goBack/:pageIndex',
    component: SearchUsersComponent,
    resolve: {
      counties: CountryDetailsService,
      userTypes: UserTypeService,
      companyTypes: CompanyTypeService
    },
    canActivate: [AdminGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(fromAdmin.adminFeatureKey, fromAdmin.reducers, { metaReducers: fromAdmin.metaReducers }),
    EffectsModule.forFeature([CreateUserEffects])],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
