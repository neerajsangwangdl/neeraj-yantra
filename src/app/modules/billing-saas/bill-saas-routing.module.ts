import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { BillInsertComponent } from './bill-insert/bill-insert.component';

const routes: Routes = [
  { path: 'insert',  canActivate: [Authguard],component: BillInsertComponent},
  { path: '**',redirectTo: 'insert' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
