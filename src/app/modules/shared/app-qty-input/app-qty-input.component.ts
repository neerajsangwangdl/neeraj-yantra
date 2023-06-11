import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/Product/product.service';
import { CartProduct } from 'src/app/models/cart-product';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-app-qty-input',
  templateUrl: './app-qty-input.component.html',
  styleUrls: ['./app-qty-input.component.scss']
})
export class AppQtyInputComponent implements OnInit {

  // @Input() sizeId: number;
  // @Input() colorId: number;
  // @Input() productId: number;
  @Input() product: any;
  // @Input() quantity: number;
  // @Input() isHomePage: boolean;
  cart: CartProduct[] = [];
  total: number = 0;
  constructor(private dataService: DataService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    // this.quantity = 1;
    // this.dataService.currentMessage.subscribe(msg => this.messge = msg);
  }


  onUpdateQuantity(type, productId, event={}) {
    let value = event && event['target']? event['target'].value : ''
    let that = this;
    if (type == 1) {
      this.cart.forEach((element, index) => {
        if (element.ProductId == productId) {
          if (element.Quantity < element.max_quantity) {
            element.Quantity = element.Quantity + 1;
          }
          else if (element.Quantity == element.max_quantity) {
            // that.toastr.success(element.max_quantity + ' is the max quantity you can add for ' + element.Name)
            element.Quantity = element.max_quantity
          }
        }
      });
    } else if (type == 2) {
      this.cart.forEach((element, index) => {
        if (element.ProductId == productId) {
          if (value >= element.min_quantity && value <= element.max_quantity) {
            element.Quantity = value;
          }
          else {
            // that.toastr.success('Min ' + element.min_quantity + ' and Max ' + element.max_quantity + ' you can order for ' + element.Name)
          }
        }
      });
    }
    else {
      this.cart.forEach((element, index) => {
        if (element.ProductId == productId) {
          if (element.Quantity > element.min_quantity) {
            element.Quantity = element.Quantity - 1;
          }
          else if (element.Quantity == element.min_quantity) {
            // that.toastr.success(element.min_quantity + ' is the min quantity you can add for ' + element.Name)
            element.Quantity = element.min_quantity;
          }
        }
      });
    }
    // this.getTotal();
  }

  // onAddProductToCart(){
  //   let product: CartProduct;
  //   this.productService.getProductDetailsById(this.productId)
  //   .subscribe(p => {
  //     product = p as CartProduct;
  //     product.Quantity = this.quantity && this.quantity >= product.min_quantity ? this.quantity : product.min_quantity;
  //     product.SizeId = this.sizeId;
  //     product.ColorId = this.colorId;
  //     let cart: CartProduct[] = JSON.parse(localStorage.getItem('Cart'));
  //     if(!cart || !cart.length){
  //       cart = [];
  //       cart.push(product);
  //     } else{
  //       let currentProduct = cart.filter(a => a.ProductId == product.ProductId);
  //       if(currentProduct.length > 0){
  //         cart.filter(a => {
  //           if( a.ProductId == product.ProductId) {
  //             // if (a.Quantity || this.quantity > a.min_quantity) {
  //               a.Quantity = a.Quantity + this.quantity;
  //           //  } else {
  //           //   a.Quantity = a.min_quantity;
  //           //  }
  //           }
  //         });
  //       } else{
  //         cart.push(product);
  //       }
  //     }
  //     this.dataService.updateCartItemCount(cart.length);
  //     this.dataService.updateShoppingCart(cart);
  //     localStorage.setItem('Cart', JSON.stringify(cart));
  //     this.toastr.success(product.Name + ' Added to the Cart');
  //   });
    
  // }

  // showToast() {
  //   // this.toastrService.show(
  //   //   'This is super toast message',
  //   //   `This is toast number:`);
  // }

}
