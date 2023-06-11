import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
// import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
const routes: Routes = [
  // { path: 'invoice', canActivate: [Authguard], component: InvoiceGeneratorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdfMakerRoutingModule { }
