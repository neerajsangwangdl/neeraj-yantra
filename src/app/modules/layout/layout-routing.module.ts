import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  // App Routes goes here
  {
    path: '',
    component: LayoutComponent,
    canActivate: [Authguard],
    children: [
      { path: '', canActivate: [Authguard],component: HomeComponent },
      { path: 'product-details/:id', canActivate: [Authguard],component: ProductDetailsComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
