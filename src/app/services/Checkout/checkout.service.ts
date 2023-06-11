import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDetail } from 'src/app/models/order-detail';
import { environment } from 'src/environments/environment';
import { HttpApiService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  CreatePaypalTransacton(orderDetail: OrderDetail){
    return this.http.post(`order/submitOrder`, orderDetail);
  }

  calculateDeliveryChargesBeforePlaced(orderDetail: OrderDetail){
    return this.http.post(`order/calculateDeliveryChargesBeforePlaced`, orderDetail);
  }

  SearchCustomer(searchString: any){
    return this.http.post(`customer/SearchCustomerByNameMobileAddress`, searchString);
  }
}
