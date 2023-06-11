import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { NotificationInsertComponent } from './notification-insert/notification-insert.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationListforAdminComponent } from './notification-listfor-admin/notification-listfor-admin.component';


const routes: Routes = [
  // App Routes goes here
  { path: 'list', canActivate:[Authguard], component: NotificationListComponent },
  { path: 'create', canActivate:[Authguard], component: NotificationInsertComponent },
  { path: 'listforadmin', canActivate:[Authguard], component: NotificationListforAdminComponent },
  { path: '**', redirectTo: 'create' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
