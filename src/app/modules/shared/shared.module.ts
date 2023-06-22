import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { PaginationComponent } from './pagination/pagination.component';
//import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './header/header.component';
//import { AppHeaderComponent } from './header/header.component';





//import { AppHeaderComponent } from './app-header/app-header.component';
//import { SmallCartComponent } from './app-header/small-cart/small-cart.component';
//import { LoaderComponent } from './app-loader/app-loader.component';
//import { AppMarqueeComponent } from './app-marquee/app-marquee.component';
//import { AppQtyInputComponent } from './app-qty-input/app-qty-input.component';
//import { CarouselComponent } from './app-carousel/app-carousel.component';
//import { AppNavComponent } from './app-nav/app-nav.component';
//import { MyBagComponent } from './my-bag/my-bag.component';
//import { AddToMyBagComponent } from './add-to-my-bag/add-to-my-bag.component';
//import { FooterComponent } from './app-footer/footer.component';
//import { SearchbarComponent } from './searchbar/searchbar.component';
//import { GroupByPipe } from 'src/app/pipes/group-by-date';
//import { TimeAgoPipe } from 'src/app/pipes/time-ago';
//import { DigitOnlyDirective } from 'src/app/directives/digit-only.directive';

@NgModule({
  declarations: [
    AppHeaderComponent

    //PaginationComponent,
    //AddToCartComponent,
    //AppHeaderComponent,
    //SmallCartComponent,
    //LoaderComponent,
    //AppMarqueeComponent,
    //AppQtyInputComponent,
    //CarouselComponent,
    //AppNavComponent,
    //MyBagComponent,
    //AddToMyBagComponent,
    //FooterComponent,
    //SearchbarComponent,
    //TimeAgoPipe,
    //GroupByPipe,
    //DigitOnlyDirective
    
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    
    
    
    //PaginationComponent,
    //AddToCartComponent,
    //AppHeaderComponent,
    // SmallCartComponent,
    // LoaderComponent,
    // AppMarqueeComponent,
    // AppQtyInputComponent,
    // CarouselComponent,
    // AppNavComponent,
    // MyBagComponent,
    // AddToMyBagComponent,
    // FooterComponent,
    // SearchbarComponent,
    //TimeAgoPipe,
    //GroupByPipe,
    //DigitOnlyDirective
  ],
  providers: []
})
export class SharedModule { }
