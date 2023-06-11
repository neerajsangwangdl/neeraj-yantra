import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { CreditDebitCommulativeComponent } from './credit-debit-cummulative/credit-debit-cummulative.component';
import { CreditDebitDetailComponent } from './credit-debit-detail/credit-debit-detail.component';
import { CreditDebitListComponent } from './credit-debit-list/credit-debit-list.component';

const routes: Routes = [
  { path: 'audit', canActivate: [Authguard], component: CreditDebitListComponent},
  { path: 'commu',  canActivate: [Authguard],component: CreditDebitCommulativeComponent},
  { path: 'audit/:id', canActivate: [Authguard], component: CreditDebitDetailComponent},
  { path: '**',redirectTo: 'audit' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditDebitRoutingModule { }
