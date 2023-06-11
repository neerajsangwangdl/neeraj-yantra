import { NgModule } from '@angular/core';
import { OrderRoutingModule } from './order-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { OrderComponent } from './order.component';
import { OrderByUserComponent } from './orders-history-by-user/order-by-user.component';
import { OrderDetailComponent } from './orders-history-by-user/order-detail/order-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OrderComponent,
    OrderByUserComponent,
    OrderDetailComponent
  ],
  imports: [
    OrderRoutingModule,
    SharedModule,
    RouterModule
  ],
  providers: []
})
export class OrderModule { }
