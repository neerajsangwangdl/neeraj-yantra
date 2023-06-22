import { NgModule } from '@angular/core';
import { UserRoutingModule } from '../user-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
//import { AccountComponent } from './account/account.component';
//import { ContactusComponent } from './contactus/contactus.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { Authguard } from 'src/app/services/authGuard';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
  
    //RegisterComponent,
    //AccountComponent,
    //ContactusComponent,
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
   NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: []
})
export class UserModule { }
