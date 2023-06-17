import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
//import { CartProduct } from 'src/app/models/cart-product';
import { Customer } from 'src/app/models/customer';

@Injectable({
  providedIn: 'root'
})
export class DataService { 
  private message = new BehaviorSubject('default');
  currentMessage = this.message.asObservable();

  private ItemCount = new BehaviorSubject(0);
  count: Observable<number> = this.ItemCount.asObservable();
  
  private BagItemCount = new BehaviorSubject(0);
  bagCount: Observable<number> = this.BagItemCount.asObservable();

  private shoppingCart = new BehaviorSubject([]);
  cart = this.shoppingCart.asObservable();
  private myBag = new BehaviorSubject([]);
  bag = this.myBag.asObservable();
  user: any = {};
  public unreadNotification = new BehaviorSubject(0);
  unreadNotificationCount: Observable<number> = this.unreadNotification.asObservable();
  public searchString: any = '';
  public searchModelChanged: Subject<string> = new Subject<string>();
  public searchModelChangeSubscription: Subscription
  constructor() {
    this.getUserFromLocalStorage();
    let isEmptyCart: boolean = localStorage.getItem('Cart') == null;
    let isEmptyBag: boolean = localStorage.getItem('bag') == null;
    this.updateCartItemCount(isEmptyCart ? 0 : JSON.parse(localStorage.getItem('Cart')).length);
    //this.updateShoppingCart(isEmptyCart ? [] : JSON.parse(localStorage.getItem('Cart')));
    this.updateBagCount(isEmptyBag ? 0 : JSON.parse(localStorage.getItem('bag')).length);
    //this.updateMyBag(isEmptyBag ? [] : JSON.parse(localStorage.getItem('bag')));
  }

  changeMessage(message: string) {
    this.message.next(message);
  }

  updateCartItemCount(count: number) {
    this.ItemCount.next(count);
  }

  // updateShoppingCart(cartItems: CartProduct[]) {
  //   this.shoppingCart.next(cartItems);
  // }

  updateBagCount(count: number) {
    this.BagItemCount.next(count);
  }
  // updateMyBag(bagItems: CartProduct[]) {
  //   this.myBag.next(bagItems);
  // }

  copyToClip(text: any) {
    navigator.clipboard.writeText(text)
  }

  OpenInWa(text) {
    text = text.replaceAll('&', '%26');
    window.open('https://wa.me/?text=' + text)
  }

  getUserFromLocalStorage() {
    this.user = {}
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
      }
      if (localStorage.getItem('token').indexOf('customer') > -1) {
        localStorage.setItem('token', window.btoa(localStorage.getItem('token')));
      }
      this.user = JSON.parse(window.atob(localStorage.getItem('token')));
    } else if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.setUserInLocalStorage(this.user);
    }
    return this.user
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

  getSelectedStatusFromLocalStorage() {
    if (localStorage.getItem('filterStatus')) {
      return JSON.parse(window.atob(localStorage.getItem('filterStatus')));
    }
    return []
  }
  setSelectedStatusInLocalStorage(data = []) {
    localStorage.setItem('filterStatus', window.btoa(JSON.stringify(data)));
    this.getSelectedStatusFromLocalStorage()
  }

}
