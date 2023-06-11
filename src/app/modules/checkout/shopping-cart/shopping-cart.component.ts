import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/Shared/data.service';
import { CartProduct } from 'src/app/models/cart-product';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  cart: CartProduct[] = [];
  total: number = 0;
  user: Customer;
  constructor(private dataService: DataService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.dataService.cart.subscribe(a => this.cart = a);
    this.user = this.dataService.getUserFromLocalStorage();
    this.getTotal();
  }

  getCartProductItems() {
    this.cart = JSON.parse(localStorage.getItem('Cart'));
  }

  onRemoveProductsFromCart(productId: number) {
    this.cart = this.cart.filter(a => a.ProductId != productId);
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.dataService.updateCartItemCount(this.cart.length);
    this.dataService.updateShoppingCart(this.cart);
    this.getTotal();
  }
  test(t, pid, qty) {

  }


  clearCart(productId: number) {
    this.cart = [];
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.dataService.updateCartItemCount(this.cart.length);
    this.dataService.updateShoppingCart(this.cart);
    this.getTotal();
  }

  onUpdateQuantity(type, productId, e:Event) {
    let value = parseInt((e.target as HTMLButtonElement).value);
    let that = this;
    if (type == 1) {
      this.cart.forEach((element, index) => {
        if (element.ProductId == productId) {
          // if (element.Quantity < element.max_quantity) {
            element.Quantity = element.Quantity + 1;
          // }
          // else if (element.Quantity == element.max_quantity) {
          //   that.toastr.success(element.max_quantity + ' is the max quantity you can add for ' + element.Name)
          //   element.Quantity = element.max_quantity
          // }
        }
      });
    } else if (type == 2) {
      this.cart.forEach((element, index) => {
        
        if (element.ProductId == productId) {
          if (value >= 1 && value <= element.max_quantity) {
            element.Quantity = value;
          }
          // if (value >= element.min_quantity && value <= element.max_quantity) {
          //   element.Quantity = value;
          // }
          else {
            // that.toastr.success('Min ' + 1 + ' and Max ' + element.max_quantity + ' you can order for ' + element.Name)
            // that.toastr.success('Min ' + element.min_quantity + ' and Max ' + element.max_quantity + ' you can order for ' + element.Name)
          }
        }
      });
    }
    else {
      this.cart.forEach((element, index) => {
        if (element.ProductId == productId) {
          if (element.Quantity > 1) {
            element.Quantity = element.Quantity - 1;
          }
          // if (element.Quantity > element.min_quantity) {
          //   element.Quantity = element.Quantity - 1;
          // }
          // else if (element.Quantity == element.min_quantity) {
          //   that.toastr.success(element.min_quantity + ' is the min quantity you can add for ' + element.Name)
          //   element.Quantity = element.min_quantity;
          // }
        }
      });
    }
    this.getTotal();
  }

  getTotal() {
    this.total = 0;
    this.cart.forEach((element) => {
      this.total = this.total + (element.Price * element.Quantity);
    })
    localStorage.setItem('Cart', JSON.stringify(this.cart));
  }

}
