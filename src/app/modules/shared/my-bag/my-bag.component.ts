import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartProduct } from 'src/app/models/cart-product';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-my-bag',
  templateUrl: './my-bag.component.html',
  styleUrls: ['./my-bag.component.scss']
})
export class MyBagComponent implements OnInit {

  bag: CartProduct[] = [];
  
  constructor(private dataService: DataService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.dataService.bag.subscribe(a => this.bag = a);
  }

  getCartProductItems(){
    this.bag = JSON.parse(localStorage.getItem('bag'));
  }

  onRemoveProductsFromCart(productId: number){
    this.bag = this.bag.filter(a => a.ProductId != productId);
    this.toastr.success('Product Removed from the bag.')
    localStorage.setItem('bag', JSON.stringify(this.bag));
    this.dataService.updateBagCount(this.bag.length);
    this.dataService.updateMyBag(this.bag);
  }

}
