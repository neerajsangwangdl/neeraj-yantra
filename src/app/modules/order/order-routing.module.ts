import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { NextOrderComponent } from '../sale-analytics/next-order/next-order.component';
import { OrderByUserComponent } from './orders-history-by-user/order-by-user.component';
import { OrderDetailComponent } from './orders-history-by-user/order-detail/order-detail.component';

const routes: Routes = [
  { path: 'history',  canActivate: [Authguard],component: OrderByUserComponent},
  { path: 'order-detail/:id', canActivate: [Authguard], component: OrderDetailComponent},
  { path: 'nextorder', canActivate: [Authguard], component: NextOrderComponent},
  { path: '**',redirectTo: 'history' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
