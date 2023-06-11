import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from './global.service';
import { HttpApiService } from '../http.service';
import { DataService } from './data.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class GlobalHttpService {
  allowedStatus: any = [5]; // for pending payment calculation
  user: any;
  constructor(
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private http: HttpApiService,
    private router: Router,
    private DataService: DataService,
    public globalService: GlobalService) {
      this.user = this.DataService.getUserFromLocalStorage();
      if (this.user) this.getCustomerByIdCall(this.user.customer_id);
  }
  saveChildProductHttp(data: any) {
    return this.http.post(`product/saveChildProduct`, data);
  }
  saveChildProduct(product) {
    var price = prompt('Price batao?');
    var qty = prompt('quantity batao?');
    var WarrantyInDays = prompt('Warranty?');
    if (price && qty) {
      const data = {
        price: price,
        stock: qty,
        WarrantyInDays: WarrantyInDays || 0,
        product_id: product.ProductId,
      }
      this.saveChildProductHttp(data)
        .subscribe(res => {
          if (res['status'] == 200) {
            this.toastr.success(res['message']);
            this.router.navigate(['products/product-details/' + res['data']['insertId']]);
          } else {
            this.toastr.warning('Error!', res['message']);
          }
        })
    }
  }

  deleteChildProductHttp(data: any) {
    return this.http.post(`product/deleteChildProduct`, data);
  }
  deleteChildProduct(ProductId) {
    if (confirm('Are you sure to delete this product?')) {
      const data = {
        product_id: ProductId,
      }
      this.deleteChildProductHttp(data)
        .subscribe(res => {
          if (res['status'] == 200) {
            this.toastr.success(res['message']);
          } else {
            this.toastr.warning('Error!', res['message']);
          }
        })
    }
  }

  saveanalyticsHttp(data: any) {
    return this.http.post(`analytics/save`, data);
  }

  saveanalytics(ProductId, description = '') {
    const data = {
      description: description || '',
      product_id: ProductId || 0,
      customer_id: this.user['customer_id'] || '0',
    }
    this.saveanalyticsHttp(data)
      .subscribe(res => {
      })
  }

  getCustomerByIdCall(id) {
    this.getCustomerById(id)
      .subscribe(res => {
        if(res['status'] && res['status'] == 200){
          this.DataService.setUserInLocalStorage(res.data);
        }
      })
  }

  getCustomerById(id){
    console.log(1, id)
    return this.http.get(`customer/getCustomerById/${id}`);
  }
}
