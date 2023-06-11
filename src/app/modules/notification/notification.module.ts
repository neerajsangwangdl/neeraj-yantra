import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { Authguard } from 'src/app/services/authGuard';
import { SharedModule } from '../shared/shared.module';
import { NotificationInsertComponent } from './notification-insert/notification-insert.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NotificationListforAdminComponent } from './notification-listfor-admin/notification-listfor-admin.component';

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationInsertComponent,
    NotificationListforAdminComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [Authguard]
})
export class NotificationModule { }
