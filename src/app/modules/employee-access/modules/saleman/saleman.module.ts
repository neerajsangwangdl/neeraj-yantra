import { NgModule } from '@angular/core';
import { salemanRoutingModule } from './saleman-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { salemanComponent } from './saleman.component';
import { createBagByAdminComponent } from './create-bag-by-admin/create-bag-by-admin.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { bagupdateComponent } from './bag-update/bag-update.component';
@NgModule({
  declarations: [
    createBagByAdminComponent,
    salemanComponent,
    bagupdateComponent
  ],
  imports: [
    salemanRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: []
})
export class salemanModule { }
