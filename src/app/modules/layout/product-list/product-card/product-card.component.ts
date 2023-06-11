import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartProduct } from 'src/app/models/cart-product';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  sizeId: any = ""
  colorId: any = ""
  cart: CartProduct[] = [];
  @Input('productData') productData: any;
  user: any;
  copied: boolean;
  constructor(private toastr: ToastrService,
    public dataService: DataService,
    public GlobalHttpService: GlobalHttpService,) {
  }

  ngOnInit() {
    this.productData.Quantity = this.productData.min_quantity
    this.user = this.dataService.getUserFromLocalStorage();
  }
  onUpdateQuantity(type, product) {
    if (type == 1) {
      // this.cart.forEach((element, index) => {
      if (product.Quantity <= this.productData.max_quantity) {
        this.productData.Quantity = product.Quantity + 1;
      } else if (product.Quantity == this.productData.max_quantity) {
        this.toastr.success(this.productData.max_quantity + ' is the max quantity you can add for' + this.productData.Name)
        product.Quantity = 99
      }
      // });
    } else {
      // this.cart.forEach((element, index) => {
      if (product.Quantity >= this.productData.min_quantity) {
        this.productData.Quantity = product.Quantity - 1;
      }
      else if (product.Quantity == this.productData.min_quantity) {
        this.toastr.success(this.productData.max_quantity + ' is the min quantity you can add for' + this.productData.Name)
        product.Quantity = 10
      }
      // });
    }
    // this.getTotal();
  }

  notifyYantra(product) {
    // this.GlobalHttpService.saveanalytics(product.ProductId, 'Notified us');
    let qty = prompt('Kitne peice chahiye aapko?') || 1;
    this.GlobalHttpService.saveanalytics(product.ProductId, 'Notified us Qty:' + qty);
    let finalStr = `https://wa.me/${this.user.partner_mobile}/?text=*${this.user.partner_name} ji*, %0a%0a Apke ${product.Name}(id:${product.ProductId}) product ke  ${qty} peice chahiye. Please jaldi bheje.`;
    window.open(finalStr)
  }

}
