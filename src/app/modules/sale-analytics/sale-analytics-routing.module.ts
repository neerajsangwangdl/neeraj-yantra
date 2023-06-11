import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { NextOrderComponent } from './next-order/next-order.component';

const routes: Routes = [
  // App routes goes here.
  { path:'nextorder', canActivate: [Authguard], component: NextOrderComponent },
  { path: '**', redirectTo: 'nextorder' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleAnalyticsRoutingModule { }
