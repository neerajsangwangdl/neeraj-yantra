import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { ContactusComponent } from './contactus/contactus.component';

const routes: Routes = [
  // App Routes goes here
  { path: 'contact', canActivate: [Authguard], component: ContactusComponent},
  
   // otherwise redirect to root of this module
   { path: '**',redirectTo: 'contact' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class yantraRoutingModule { }
