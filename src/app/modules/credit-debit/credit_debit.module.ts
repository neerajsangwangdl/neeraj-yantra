import { NgModule } from '@angular/core';
import { CreditDebitRoutingModule } from './credit_debit-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CreditDebitComponent } from './credit_debit.component';
import { CreditDebitListComponent } from './credit-debit-list/credit-debit-list.component';
import { CreditDebitDetailComponent } from './credit-debit-detail/credit-debit-detail.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TimeAgoPipe } from 'src/app/pipes/time-ago';
// import { GroupByPipe } from 'src/app/pipes/group-by-date';
import { CreditDebitCommulativeComponent } from './credit-debit-cummulative/credit-debit-cummulative.component';
@NgModule({
  declarations: [
    CreditDebitComponent,
    CreditDebitDetailComponent,
    CreditDebitListComponent,
    CreditDebitCommulativeComponent,
    
  ],
  imports: [
    CreditDebitRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: []
})
export class CreditDebitModule { }
