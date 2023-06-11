import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetRoutingModule } from './target-routing.module';
import { TargetListComponent } from './target-list/target-list.component';
import { Authguard } from 'src/app/services/authGuard';
import { SharedModule } from '../shared/shared.module';
import { TargetInsertComponent } from './target-insert/target-insert.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TargetListforAdminComponent } from './target-listfor-admin/target-listfor-admin.component';

@NgModule({
  declarations: [
    TargetListComponent,
    TargetInsertComponent,
    TargetListforAdminComponent
  ],
  imports: [
    CommonModule,
    TargetRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [Authguard]
})
export class TargetModule { }
