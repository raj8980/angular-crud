import { AboutUsComponent } from './components/about-us/about-us.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AdminGuard } from './admin/admin.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';


const routes: Routes = [
  
  {
    path:'home',component:HomeComponent
  },
  {
    path:'about-us',component:AboutUsComponent
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'logout',component:LogoutComponent
  },
  {
    path:'unauthorized-access',component:UnauthorizedComponent
  },
  {
    path:'server-error',component:ServerErrorComponent
  },
  { 
    path: 'users', 
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate:[AdminGuard]
  },
  {
    path:'**',component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
