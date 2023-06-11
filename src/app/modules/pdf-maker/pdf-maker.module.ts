import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { InvoiceGeneratorComponent } from './invoice-generator/invoice-generator.component';
import { PdfMakerRoutingModule } from './pdf-maker-routing.module';



@NgModule({
  declarations: [
    // InvoiceGeneratorComponent
  ],
  imports: [
    PdfMakerRoutingModule,
    CommonModule
  ]
})
export class PdfMakerModule { }
