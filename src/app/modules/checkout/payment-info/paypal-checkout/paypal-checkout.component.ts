import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartProduct } from 'src/app/models/cart-product';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { OrderDetail } from 'src/app/models/order-detail';
import { Customer } from 'src/app/models/customer';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';

@Component({
  selector: 'app-paypal-checkout',
  templateUrl: './paypal-checkout.component.html',
  styleUrls: ['./paypal-checkout.component.scss']
})
export class PaypalCheckoutComponent implements OnInit {

  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  @Input() totalAmount: number = 0;
  @Input() comments: string = '';
  // @Input() SelectedUser: any;
  @Input('SelectedUserData') SelectedUser: Customer;
  currency: string = 'USD';
  cart: CartProduct[] = [];
  productList: any[] = [];
  user: Customer;
  loggedInUser: any;
  constructor(private router: Router,
    private toastr: ToastrService,
    public GlobalService: GlobalService,
    private checkoutService: CheckoutService,
    private dataService: DataService) { }

  ngOnInit() {
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
      // this.delivery_charges = this.GlobalService.calculateDeliveryAmount(this.totalAmount)
    }
  }

  initConfig(): void {
    const self = this;
    this.loggedInUser = this.dataService.getUserFromLocalStorage()
    this.user = this.SelectedUser ? this.SelectedUser : this.loggedInUser;
    let orderData: any = {
      Cart: this.cart,
      User: this.user,
      Remarks: this.comments,
      SalesmanId: this.loggedInUser['customer_id'] || null
    }
    self.checkoutService.CreatePaypalTransacton(orderData)
      .subscribe(res => {
        alert(res['message']);
        if (res['status'] && res.status == 200) {
          localStorage.removeItem('Cart');
          localStorage.removeItem('cart');
          this.toastr.success(res['message']);
          setTimeout(() => {
            if (this.loggedInUser && this.loggedInUser.Role <= 8) {
              self.router.navigate(['/emp-access/all']);
            } else {
              self.router.navigate(['/order/history']);
            }
          }, 1000);
        }
      });
  }
  resetStatus() {
    console.log("Method not implemented.");
  }


}
