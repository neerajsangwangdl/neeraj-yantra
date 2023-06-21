import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PdfMakerModule } from './modules/pdf-maker/pdf-maker.module';
//import { Authguard } from './services/authGuard';

const routes: Routes = [
  // App Routes goes here
  {
    path: 'customer',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule)
  },


  // otherwise redirect to home
  { path: '**', pathMatch: 'full', redirectTo: 'customer' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
