import { NgModule } from '@angular/core';
import { OrderRoutingModule } from './employee-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeComponent } from './employee.component';
// import { OrderByUserComponent } from './orders-history-by-user/order-by-user.component';
// import { OrderDetailComponent } from './orders-history-by-user/order-detail/order-detail.component';
import { OrderByAdminComponent } from './orders-history-by-admin/order-by-admin.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { PaymentSubmitAdminComponent } from './payment-submit-admin/payment-submit-admin.component';
import { ProductInsertComponent } from './product-insert/product-insert.component';
// import { PaymentSubmitAdminComponent } from './payment-submit-admin/payment-submit-admin.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProductInsertTraineeComponent } from './product-insert-trainee/product-insert-trainee.component';
import { ProductInsertNeerajComponent } from './product-insert-neeraj/product-insert-neeraj.component';
// import { UserManagementComponent } from './user-managements/user-management.component';
// import { TimeAgoPipe } from 'src/app/pipes/time-ago';
@NgModule({
  declarations: [
    EmployeeComponent,
    // OrderByUserComponent,
    OrderDetailComponent,
    OrderByAdminComponent,
    PaymentSubmitAdminComponent,
    ProductInsertComponent,
    ProductInsertTraineeComponent,
    ProductInsertNeerajComponent,
    // UserManagementComponent,
    
  ],
  imports: [
    OrderRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: []
})
export class EmployeeModule { }
