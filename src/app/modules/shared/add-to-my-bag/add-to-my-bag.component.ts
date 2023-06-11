import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/Product/product.service';
import { CartProduct } from 'src/app/models/cart-product';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-add-to-my-bag',
  templateUrl: './add-to-my-bag.component.html',
  styleUrls: ['./add-to-my-bag.component.scss']
})
export class AddToMyBagComponent implements OnInit {

  @Input() productId: number;
  @Input() sizeId: number;
  @Input() buttonsize: string = 'med';
  @Input() colorId: number;
  @Input() quantity: number;
  @Input() isHomePage: boolean;
  messge: string;
  constructor(private productService:ProductService,
              private toastr: ToastrService,
              private dataService: DataService) { }

  ngOnInit() {
    this.quantity = 1;
    this.dataService.currentMessage.subscribe(msg => this.messge = msg);
  }

  onAddProductToBag(){
    let product: CartProduct;
    this.productService.getProductDetailsById(this.productId)
    .subscribe(p => {
      product = p as CartProduct;
      let bag: CartProduct[] = JSON.parse(localStorage.getItem('bag'));
      if(!bag || !bag.length){
        bag = [];
        product.Quantity = this.quantity;
        bag.push(product);
        this.toastr.success(product.Name + ' Added to the Bag');
      } else{
        let currentProduct = bag.filter(a => a.ProductId == product.ProductId);
        if(currentProduct.length > 0){
          bag.filter(a => {
            if( a.ProductId == product.ProductId) {
                // a.Quantity = a.Quantity + this.quantity;
                // if (this.quantity) {
                //   let newQty = a.Quantity ? a.Quantity + this.quantity : this.quantity;
                //   if(newQty >= product.min_quantity && newQty <= product.max_quantity) {
                //     a.Quantity = newQty;
                    this.toastr.success(product.Name + ' Added to the Bag');
                  // } else {
                  //   this.toastr.success('Min ' + product.min_quantity + ' and Max ' + product.max_quantity + ' you can order for ' + product.Name);
                  //   return
                  // }
                // }
            }
          });
        } else{
          this.toastr.success(product.Name + ' Added to the Bag');
          product.Quantity = this.quantity;
          bag.push(product);
        }
      }
      this.dataService.updateBagCount(bag.length);
      this.dataService.updateMyBag(bag);
      localStorage.setItem('bag', JSON.stringify(bag));
      
    });
    
  }


}
