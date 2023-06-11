import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { environment } from 'src/environments/environment';
import { HttpApiService } from './http.service';
import { DatePipe } from '@angular/common';
import { GlobalService } from './Shared/global.service';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  orderList: any = [];
  constructor(private http: HttpApiService,
    public globalService: GlobalService,
    private datepipe: DatePipe) { }

  // submitBag(data: any) {
  //   return this.http.post(`${this.url}order/submitBag`, data);
  // }

  SubmitBag(data: any): Observable<Product[]> {
    return this.http.post(`bag/submitBag`, data);
  }
  
  archievedBags(data: any): Observable<Product[]> {
    return this.http.post(`bag/archievedBags`, data);
  }

  handoverBagsToSaleman(data: any): Observable<Product[]> {
    return this.http.post(`bag/handoverBagsToSaleman`, data);
  }

  returnBag(data: any): Observable<Product[]> {
    return this.http.post(`bag/returnBag`, data);
  }

  getMostRecentOrdersByCount(data: any): Observable<Product[]> {
    return this.http.post(`order/mostRecentOrdersByCount`, data);
  }

  updateSpareProductInBag(data: any): Observable<Product[]> {
    return this.http.post(`bag/updateSpareProductInBag`, data);
  }

  getPendingPayment(): Observable<Product[]> {
    return this.http.get(`order/getPendingPayment`);
  }

  // updateOrderStatusByOrderID(id, data): Observable<Product[]> {
  //   return this.http.post(`order/updateOrderStatusByOrderID/${id}`, data);
  // }

  cancelOrderByOrderID(data): Observable<Product[]> {
    return this.http.post(`order/cancelOrderByOrderID`, data);
  }

  updateOrderStatusByItemID(data): Observable<any[]> {
    return this.http.post(`order/updateOrderStatusByItemID`, data);
  }

  updateOrderQtyByItemID(data): Observable<any[]> {
    return this.http.post(`order/updateOrderQtyByItemID`, data);
  }

  removeOrderDeliveryCharges(data): Observable<any[]> {
    return this.http.post(`order/removeOrderDeliveryCharges`, data);
  }

  updateBagInitQtyByBagID(data): Observable<any[]> {
    return this.http.post(`order/updateBagInitQtyByBagID`, data);
  }

  getorderByCustomerId(CustomerId): Observable<any[]> {
    return this.http.get(`order/orderByCustomerId/${CustomerId}`);
  }

  getPendingPaymentByCustomerId(CustomerId): Observable<any[]> {
    return this.http.get(`order/getPendingPaymentByCustomerId/${CustomerId}`);
  }

  getMonthSaleByCustomerId(CustomerId): Observable<any[]> {
    return this.http.get(`order/getMonthSaleByCustomerId/${CustomerId}`);
  }

  getorderDetail(OrderId): Observable<Product[]> {
    return this.http.get(`order/orderByOrderId/${OrderId}`);
  }

  getPaymentDetail(OrderId): Observable<Product[]> {
    return this.http.get(`payment/paymentByOrderId/${OrderId}`);
    // this.http.get(`product/getProductDetails?productId=${productId}`);
  }

  addNewPaymentByOrderId(customer): Observable<boolean> {
    return this.http.post(`payment/addNewPaymentByOrderId`, customer);
  }
  SearchCustomer(searchString: any) {
    return this.http.post(`customer/SearchCustomerByNameMobileAddress`, searchString);
  }

  sendWAppMsgForPendingPayments(mob_phone, name, orders = []) {
    // this.globalService.show();
    let finalStr = `https://wa.me/+91${mob_phone}/?text=${name.toUpperCase()} ji, %0a%0a `;
    let totalPend = 0
    let i = 1;
    orders.forEach((element) => {
      let orderPendingAmount = Math.round(this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(element.order_details, 'units', 'unit_cost') - element.pAmount);
      totalPend += orderPendingAmount;
      finalStr += `${i}. Apke ${this.datepipe.transform(element.created_on, 'mediumDate')} ke is Order ki *Rs. ${orderPendingAmount}* payment pending hai. _Check Details *here:*_ https://apnidukan.yantraworld.in/order/order-detail/${element.order_id} %0a%0a`;
      i += 1;
    });
    let totalStr = totalPend ? `Final: Apke *Total Rs. ${totalPend}* payment pending hai. _Check Details *here:*_ https://apnidukan.yantraworld.in/order/history %0a%0a` : `Apke koi bhi payment pending nhi hai. %0a%0a _Thank you._ %0a%0a Your's YANTRA`;
    finalStr += totalStr
    this.globalService.hide();
    window.open(finalStr);
  }

  getPendingOrderForCustomerAndSendWhatsapp(customer_id, mob_phone, name) {
    // this.globalService.show();
    const data = {
      customer_id: customer_id,
      status: [5],
      count: 100,
    }
    this.getMostRecentOrdersByCount(data).subscribe(res => {
      this.globalService.hide();
      if (res['status'] == 200) {
        this.orderList = res['data'];
        this.sendWAppMsgForPendingPayments(mob_phone, name, this.orderList)
      }
    });
  }
}
