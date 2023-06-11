import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserUpdateComponent } from './user-update/user-update.component';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    UserUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserManagementRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class UserManagementModule { }
