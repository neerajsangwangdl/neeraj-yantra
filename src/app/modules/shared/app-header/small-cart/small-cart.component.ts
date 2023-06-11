import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartProduct } from 'src/app/models/cart-product';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-small-cart',
  templateUrl: './small-cart.component.html',
  styleUrls: ['./small-cart.component.scss']
})
export class SmallCartComponent implements OnInit {

  cart: CartProduct[] = [];
  constructor(private dataService: DataService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.dataService.cart.subscribe(a => this.cart = a);
  }

  getCartProductItems(){
    this.cart = JSON.parse(localStorage.getItem('Cart'));
  }

  onRemoveProductsFromCart(productId: number){
    this.cart = this.cart.filter(a => a.ProductId != productId);
    this.toastr.success('Product Removed from the cart.')
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.dataService.updateCartItemCount(this.cart.length);
    this.dataService.updateShoppingCart(this.cart);
  }

}
