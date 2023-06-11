import { NgModule } from '@angular/core';
import { CheckoutRoutingModule } from './checkout-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { CheckoutNavbarComponent } from './checkout-navbar/checkout-navbar.component';
import { CheckoutComponent } from './checkout.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { ReviewComponent } from './review/review.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { PaypalCheckoutComponent } from './payment-info/paypal-checkout/paypal-checkout.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutNavbarComponent,
    ReviewComponent,
    CustomerInfoComponent,
    PaymentInfoComponent,
    ShoppingCartComponent,
    OrderConfirmationComponent,
    PaypalCheckoutComponent
  ],
  imports: [
    CheckoutRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: []
})
export class CheckoutModule { }
