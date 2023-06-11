import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { UserUpdateComponent } from './user-update/user-update.component';

const routes: Routes = [

  { path: 'userupdate', canActivate: [Authguard], component: UserUpdateComponent },
  {path: '**', redirectTo: 'product'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
