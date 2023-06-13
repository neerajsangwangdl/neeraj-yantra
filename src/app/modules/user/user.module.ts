import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
//import { RegisterComponent } from './register/register.component';


import { UserRoutingModule } from '../user-routing.module';
import { SharedModule } from '../shared/shared.module';

//import { AccountComponent } from './account/account.component';
//import { ContactusComponent } from './contactus/contactus.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { Authguard } from 'src/app/services/authGuard';

@NgModule({
  declarations: [
    LoginComponent,
    
    

   // RegisterComponent,
   // AccountComponent,
    //ContactusComponent,
  ],
  imports: [
    UserRoutingModule,
  
    
    //UserRoutingModule,
    SharedModule
   // NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: []
})
export class UserModule { }
