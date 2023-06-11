import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { environment } from 'src/environments/environment';
import { HttpApiService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  getStatusMaster(): Observable<Product[]>{
    return this.http.get(`status/getStatusMaster`);
  }

  getorderByCustomerId(CustomerId): Observable<Product[]>{
    return this.http.get(`order/orderByCustomerId/${CustomerId}`);
  }
  getunreadNotificationByCustomerId(customerId){
    return this.http.get(`notification/getUnreadNotificationListByCustomerId/?id=${customerId}`)
  }

  passwordReset(CustomerId): Observable<Product[]>{
    return this.http.get(`customer/passwordReset/${CustomerId}`);
  }

  getbagBySalemanId(id): Observable<Product[]>{
    return this.http.get(`bag/BagBySalemanId/${id}`);
  }

  getpendingItemTobeReturn(id): Observable<Product[]>{
    return this.http.get(`bag/getpendingItemTobeReturn/${id}`);
  }

  getorderDetail(OrderId): Observable<Product[]>{
    return this.http.get(`order/orderByOrderId/${OrderId}`);
  }

  getPaymentDetail(OrderId): Observable<Product[]>{
    return this.http.get(`payment/paymentByOrderId/${OrderId}`);
    // this.http.get(`product/getProductDetails?productId=${productId}`);
  }

  addNewPaymentByOrderId(customer): Observable<boolean> {
    return this.http.post(`payment/addNewPaymentByOrderId`, customer);
  }

  generateOtp(data): Observable<boolean> {
    return this.http.post(`otp/generateOtp`, data);
  }

  SearchCustomer(searchString: any){
    return this.http.post(`customer/SearchCustomerByNameMobileAddress`, searchString);
  }
  SearchCustomerByName(searchString: any){
    return this.http.post(`customer/SearchCustomerByNameMobileAddress`, searchString);
  }

  getProductList(paging: any) {
    return this.http.post(`product/getFilteredProducts`, { paging: paging });
  }
}
