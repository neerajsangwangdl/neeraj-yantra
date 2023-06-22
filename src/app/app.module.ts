import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './modules/shared/shared.module';
//import { NewsLetterService } from './services/NewsLetterService/news-letter.service';
//import { PWAAppUpdateService } from './services/pwa-service';
//import { Authguard } from './services/authGuard';
//import { MasterService } from './services/master.service';
// import { GlobalHttpService } from './services/Shared/global-http.service';

import { GlobalService } from './services/shared/global.service';
// import { YantraInterceptor } from './services/http-interceptor';

import { HttpApiService } from './services/shared/http.service';
// import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { HTML2PDFService } from './services/html2pdf.service';
// import { OrderService } from './services/order.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { CreditDebitService } from './services/credit-debit.service';
import { RouterModule } from '@angular/router';
import { YantraInterceptor } from './services/shared/http-interceptor.service';


// import { MdCardModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot(),
    //InfiniteScrollModule,
    RouterModule,
  
    NgMultiSelectDropDownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:10000'
    }),
    
  ],
  providers: [//HTML2PDFService, 
    HttpApiService, 
    //OrderService, 
    //MasterService, 
    //NewsLetterService, 
    //PWAAppUpdateService, 
    //Authguard, 
    GlobalService,
    { provide: HTTP_INTERCEPTORS, useClass: YantraInterceptor, multi: true }, 
    DatePipe, 
    //GlobalHttpService,
    //CreditDebitService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
