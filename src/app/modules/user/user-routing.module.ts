import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
//import { Authguard } from 'src/app/services/authGuard';
//import { AccountComponent } from './account/account.component';
//import { ContactusComponent } from './contactus/contactus.component';
import { ResgisterComponent } from './resgister/resgister.component';
const routes: Routes = [
  // App Routes goes here
  { path: 'login', component: LoginComponent },

  // otherwise redirect to root of this module
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
