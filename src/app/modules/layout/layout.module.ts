import { NgModule } from '@angular/core';
import { LayoutRoutingModule } from './layout-routing.module';
// import { AppHeaderComponent } from './modules/layout/app-header/app-header.component';
import { SharedModule } from '../shared/shared.module';
import { FiltersComponent } from './filters/filters.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductCardComponent } from './product-list/product-card/product-card.component';
import { ProductListComponent } from './product-list/product-list.component';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { Authguard } from 'src/app/services/authGuard';

@NgModule({
  declarations: [
    HomeComponent,
    ProductDetailsComponent,
    FiltersComponent,
    ProductListComponent,
    ProductCardComponent,
    LayoutComponent
  ],
  imports: [
    LayoutRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    RouterModule
  ],
  exports: [
    ProductListComponent
  ],
  providers: [Authguard]
})
export class LayoutModule { }
