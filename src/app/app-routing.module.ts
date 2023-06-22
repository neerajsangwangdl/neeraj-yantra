import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PdfMakerModule } from './modules/pdf-maker/pdf-maker.module';
//import { Authguard } from './services/authGuard';

const routes: Routes = [
  // App Routes goes here
  {
    path: 'customer',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule)
  },
  // {
  //   path: 'billsaas',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/billing-saas/bill-saas.module').then(m => m.BillSaaSModule)
  // },
  // {
  //   path: 'credit-debit',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/credit-debit/credit_debit.module').then(m => m.CreditDebitModule)
  // },
  // {
  //   path: 'yantra',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/yantra/yantra.module').then(m => m.yantraModule)
  // },
  // {
  //   path: 'order',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/order/order.module').then(m => m.OrderModule)
  // },
  // {
  //   path: 'sales',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/sale-analytics/sale-analytics.module').then(m => m.SaleAnalyticsModule)
  // },
  // {
  //   path: 'emp-access',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //     import('./modules/employee-access/employee.module').then(m => m.EmployeeModule)
  // },
  // {
  //   path: 'products',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //   import('./modules/layout/layout.module').then(m => m.LayoutModule)
  // },
  // {
  //   path: 'checkout',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //   import('./modules/checkout/checkout.module').then(m => m.CheckoutModule)
  // },
  // {
  //   path: 'notification',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //   import('./modules/notification/notification.module').then(m => m.NotificationModule)
  // },
  // {
  //   path: 'target',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //   import('./modules/target/target.module').then(m => m.TargetModule)
  // },
  // {
  //   path: 'pdf-maker',
  //   canActivate: [Authguard],
  //   loadChildren: () =>
  //   import('./modules/pdf-maker/pdf-maker.module').then(m => m.PdfMakerModule)
  // },
  
  // otherwise redirect to home
  { path: '**', redirectTo: 'products' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
