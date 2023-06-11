import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ReviewComponent } from './review/review.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  // App Routes goes here
    { path: 'review',   canActivate: [Authguard],component: ReviewComponent,  data: {title: 'Order Review'} },
    { path: 'customer-information', canActivate: [Authguard], component: CustomerInfoComponent,  data: {title: 'Customer Information'} },
    { path: 'payment-information', canActivate: [Authguard], component: PaymentInfoComponent,  data: {title: 'Payment Information'} },
    { path: 'shopping-cart', canActivate: [Authguard], component: ShoppingCartComponent},
    { path: 'order/order-confirmation', canActivate: [Authguard], component: OrderConfirmationComponent},
   // otherwise redirect to root of this module
   { path: '**', redirectTo: 'review' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
