import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
//import { CartProduct } from 'src/app/models/cart-product';
import { Customer } from 'src/app/models/customer';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  user: any = {};

  constructor() {}

  getUserFromLocalStorage() {
    this.user = {};
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
      }
      if (localStorage.getItem('token').indexOf('customer') > -1) {
        localStorage.setItem(
          'token',
          window.btoa(localStorage.getItem('token'))
        );
      }
      this.user = JSON.parse(window.atob(localStorage.getItem('token')));
    } else if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.setUserInLocalStorage(this.user);
    }
    return this.user;
  }
  setUserInLocalStorage(data) {
    if (data['customer_id']) {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
      }
      localStorage.setItem('token', window.btoa(JSON.stringify(data)));
      this.getUserFromLocalStorage();
    }
  }
}
