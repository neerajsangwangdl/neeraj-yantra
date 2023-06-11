import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GlobalService } from 'src/app/services/Shared/global.service';
// import 'bootstrap';
// declare const bootstrap: any;

@Component({
  selector: 'app-carousel',
  templateUrl: './app-carousel.component.html',
  styleUrls: ['./app-carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input('carouselProductsData') carouselProducts: any;
  isLoading: Subject<boolean> = this.globalService.isLoading;
  carouselList: any = [];
  user: any;


  constructor(public globalService: GlobalService) {
  }
  ngOnInit() {
    this.user = this.globalService.user;
    console.log(this.user)
    for (let element of this.carouselProducts.productList) {
      this.carouselList.push(element);
      if (this.carouselList.length >= 12) {
        break;
      }
    };
    // const myCarouselElement = document.querySelector('#carouselExampleInterval')
    // const carousel = new bootstrap.Carousel(myCarouselElement, {
    //   interval: 3000
    // })
  }

}