import { NgModule } from '@angular/core';
import { yantraRoutingModule } from './yantra-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { ContactusComponent } from './contactus/contactus.component';

@NgModule({
  declarations: [
    ContactusComponent
  ],
  imports: [
    yantraRoutingModule
  ],
  providers: []
})
export class yantraModule { }
