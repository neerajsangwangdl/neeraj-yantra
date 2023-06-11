import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleAnalyticsRoutingModule } from './sale-analytics-routing.module';
import { NextOrderComponent } from './next-order/next-order.component';
import { Authguard } from 'src/app/services/authGuard';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NextOrderComponent
  ],
  imports: [
    CommonModule,
    SaleAnalyticsRoutingModule,
    SharedModule,
  ],
  providers: [Authguard]
})
export class SaleAnalyticsModule { }
