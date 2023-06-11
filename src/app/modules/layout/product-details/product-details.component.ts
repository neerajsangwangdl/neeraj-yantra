import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { ProductService } from 'src/app/services/Product/product.service';
import { Product } from 'src/app/models/product';
// import { AppHeaderComponent } from '../layout/app-header/app-header.component';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: any ={};
  productId: number;
  sizeId: number;
  colorId: number;
  videoLinkId: any;
  constructor(private productService: ProductService,
              private GlobalHttpService: GlobalHttpService,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute) { 
              }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    })
    this.getProductDetailsById();
  }

  getProductDetailsById(){
    this.productService.getProductDetailsById(this.productId)
    .subscribe(p => {
      this.product = p as Product;
      if(this.product.videolink){
        const params =  new URL(this.product.videolink) //new URLSearchParams('https://www.youtube.com/watch?v=DwAyKR7T4PM')
        this.videoLinkId = params.searchParams.get('v')
        this.videoLinkId = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.videoLinkId);;
      }
      this.GlobalHttpService.saveanalytics(this.productId, 'clicked product');
    })
  }

}
