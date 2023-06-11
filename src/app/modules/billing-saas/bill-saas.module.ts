import { NgModule } from '@angular/core';
import { OrderRoutingModule } from './bill-saas-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { BillSaaSComponent } from './bill-saas.component';
// import { OrderByUserComponent } from './orders-history-by-user/order-by-user.component';
// import { OrderDetailComponent } from './orders-history-by-user/order-detail/order-detail.component';
import { BillInsertComponent } from './bill-insert/bill-insert.component';
// import { PaymentSubmitAdminComponent } from './payment-submit-admin/payment-submit-admin.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TimeAgoPipe } from 'src/app/pipes/time-ago';
@NgModule({
  declarations: [
    BillSaaSComponent,
    BillInsertComponent,  
  ],
  imports: [
    SharedModule,
    OrderRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: []
})
export class BillSaaSModule { }
