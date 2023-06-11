import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { TargetInsertComponent } from './target-insert/target-insert.component';
import { TargetListComponent } from './target-list/target-list.component';
import { TargetListforAdminComponent } from './target-listfor-admin/target-listfor-admin.component';



const routes: Routes = [
  // App Routes goes here
  { path: 'list', canActivate:[Authguard], component: TargetListComponent },
  { path: 'create', canActivate:[Authguard], component: TargetInsertComponent },
  { path: 'listforadmin', canActivate:[Authguard], component: TargetListforAdminComponent },
  { path: '**', redirectTo: 'create' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetRoutingModule { }
