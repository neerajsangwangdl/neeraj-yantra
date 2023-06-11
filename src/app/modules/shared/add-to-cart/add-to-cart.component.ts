import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/Product/product.service';
import { CartProduct } from 'src/app/models/cart-product';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {

  @Input() sizeId: number;
  @Input() buttonsize: string = 'med';
  @Input() colorId: number;
  @Input() productId: number;
  @Input() quantity: number;
  @Input() isHomePage: boolean;
  messge: string;
  constructor(private productService:ProductService,
              private toastr: ToastrService,
              private GlobalHttpService: GlobalHttpService,
              private dataService: DataService) { }

  ngOnInit() {
    this.quantity = 1;
    this.dataService.currentMessage.subscribe(msg => this.messge = msg);
  }

  onAddProductToCart(){
    let product: CartProduct;
    this.productService.getProductDetailsById(this.productId)
    .subscribe(p => {
      product = p as CartProduct;
      // if (this.quantity) {
      //   let newQty = product.Quantity ? product.Quantity + this.quantity : this.quantity;
      //   if(newQty >= product.min_quantity && newQty <= product.max_quantity) {
      //     product.Quantity = newQty;
      //   } else {
      //     this.toastr.success('Min ' + product.min_quantity + ' and Max ' + product.max_quantity + ' you can order for ' + product.Name);
      //     return
      //   }
      // }
      // product.Quantity =(() => { this.quantity = product.min_quantity; this.toastr.success('Min ' + product.min_quantity + ' and Max ' + product.max_quantity + ' you can order for ' + product.Name); return product.min_quantity})() ;
      // product.Quantity = this.quantity && product.Quantity + this.quantity >= product.min_quantity && product.Quantity + this.quantity <= product.max_quantity ? this.quantity : (() => { this.quantity = product.min_quantity; this.toastr.success('Min ' + product.min_quantity + ' and Max ' + product.max_quantity + ' you can order for ' + product.Name); return product.min_quantity})() ;
      // product.SizeId = this.sizeId;
      // product.ColorId = this.colorId;
      let cart: CartProduct[] = JSON.parse(localStorage.getItem('Cart'));
      if(!cart || !cart.length){
        cart = [];
        product.Quantity = this.quantity;
        cart.push(product);
        this.toastr.success(product.Name + ' Added to the Cart');
      } else{
        let currentProduct = cart.filter(a => a.ProductId == product.ProductId);
        if(currentProduct.length > 0){
          cart.filter(a => {
            if( a.ProductId == product.ProductId) {
                // a.Quantity = a.Quantity + this.quantity;
                if (this.quantity) {
                  let newQty = a.Quantity ? a.Quantity + this.quantity : this.quantity;
                  if(newQty <= product.max_quantity) {
                    a.Quantity = newQty;
                    this.toastr.success(product.Name + ' Added to the Cart');
                  } else {
                    this.toastr.success('Min ' + product.min_quantity + ' and Max ' + product.max_quantity + ' you can order for ' + product.Name);
                    return
                  }
                }
            }
          });
        } else{
          this.toastr.success(product.Name + ' Added to the Cart');
          product.Quantity = this.quantity;
          cart.push(product);
        }
      }
      this.dataService.updateCartItemCount(cart.length);
      this.dataService.updateShoppingCart(cart);
      localStorage.setItem('Cart', JSON.stringify(cart));
      this.GlobalHttpService.saveanalytics(this.productId, 'added to cart');
    });
    
  }


}
