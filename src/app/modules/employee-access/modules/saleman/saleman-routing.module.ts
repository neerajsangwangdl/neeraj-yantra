import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { bagupdateComponent } from './bag-update/bag-update.component';
import { createBagByAdminComponent } from './create-bag-by-admin/create-bag-by-admin.component';
// import { OrderByUserComponent } from './orders-history-by-user/order-by-user.component';
// import { OrderDetailComponent } from './orders-history-by-user/order-detail/order-detail.component';

const routes: Routes = [
  // { path: 'history', component: OrderByUserComponent},
  { path: 'admin-create-bag',  canActivate: [Authguard],component: createBagByAdminComponent},
  { path: 'edit-bag/:id', canActivate: [Authguard], component: bagupdateComponent},
  { path: '**',redirectTo: 'admin-create-bag' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class salemanRoutingModule { }
