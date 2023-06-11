import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartProduct } from 'src/app/models/cart-product';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, OnDestroy {

  checkoutProducts: CartProduct[];
  totalPrice: number = 0;
  date: number;
  tax = 6.4;
  remark: string = '';
  public searchText: string;
  // public searchModelChanged: Subject<string> = new Subject<string>();
  // public searchModelChangeSubscription: Subscription
  customerList: any;
  LoggedinUser: any;
  SelectedUser: any;
  user: any;
  cart: any;
  comments: any;
  productList: any = [];
  currency: any;
  totalAmount: number;
  delivery_charges: any;
  customerListDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    limitSelection: 1,
    allowSearchFilter: true
  };
  constructor(private checkoutService: CheckoutService,
    public GlobalService: GlobalService,
    private MasterService: MasterService,
    private dataService: DataService) {
    const products = JSON.parse(localStorage.getItem('Cart'));
    this.LoggedinUser = this.dataService.getUserFromLocalStorage();
    this.checkoutProducts = products;
    products.forEach((product) => {
      this.totalPrice += product.Price * product.Quantity;
    });
    this.totalPrice = Math.round(this.totalPrice);
  }

  ngOnInit() {
    this.searchCustomer();
    // this.searchModelChangeSubscription = this.searchModelChanged
    //   .pipe(
    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(newText => {
    //     this.searchText = newText.trim();
    //     console.log(newText);
    //     this.searchCustomer();

    //   });
    this.cart = JSON.parse(localStorage.getItem('Cart'));
    if (this.cart.length) {
      this.cart.forEach(element => {
        this.productList.push({
          name: element.Name,
          quantity: element.Quantity,
          category: `${element.DepartmentName} - ${element.CategoryName}`,
          unit_amount: {
            currency_code: `${this.currency}`,
            value: `${element.Price}`,
          },
        });
        this.totalAmount += element.Price * element.Quantity
      });
      this.calculateDeliveryChargesBeforePlaced();
    }
  }

  calculateDeliveryChargesBeforePlaced(): void {
    const self = this;
    this.LoggedinUser = this.dataService.getUserFromLocalStorage()
    this.user = this.SelectedUser ? this.SelectedUser : this.LoggedinUser;
    let orderData: any = {
      Cart: this.cart,
      User: this.user,
    }
    self.checkoutService.calculateDeliveryChargesBeforePlaced(orderData)
      .subscribe(res => {
        if (res['status'] && res.status == 200) {
          this.delivery_charges = res['data']['delivery_charges'] || 0;
        }
      });
  }

  onChangeSelectedUser(val) {
    this.SelectedUser = val;
  }


  // searchCustomer() {
  //   const data = {
  //     SearchString: this.searchText || ''
  //   }
  //   this.customerList = [];
  //   this.checkoutService.SearchCustomer(data)
  //     .subscribe(res => {
  //       if (res['status'] == 200) {
  //         // this.orde
  //         this.customerList = res['data'];
  //       } else {
  //         // this.toastr.warning('Error!', res['message']);
  //       }
  //     })
  // }
  searchCustomer() {
    const data = {
      SearchString: this.searchText || ''
    }
    this.customerList = [];
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          this.customerList = res['data'];
        }  
      })
  }

  ngOnDestroy() {
    // this.searchModelChangeSubscription.unsubscribe();
  }

}
