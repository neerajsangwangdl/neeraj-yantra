import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { environment } from 'src/environments/environment';
import { HttpApiService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  version = environment.VERSION;
  constructor(private http: HttpApiService) {
  }

  geProductByDepartmentId(paging: Paging) {
    return this.http.post(`department/getDepartments`, paging);
  }

  getProductList(paging: Paging) {
    return this.http.post(`product/getFilteredProducts`, { paging: paging });
  }

  createProduct(data: any) {
    return this.http.post(`product/create`, data);
  }

  updateProduct(data: any) {
    return this.http.post(`product/update`, data);
  }
  deleteInventory(product_id: number) {
    return this.http.delete(`product/deleteUnappliedInventoryProduct?product_id=${product_id}`);
  }

  applyInventory(data: any) {
    return this.http.post(`product/applyInventory`, data);
  }

  getProductDetailsById(productId: number) {
    return this.http.get(`product/getProductDetails?productId=${productId}`);
  }

  getNewStockProducts(productId: number) {
    return this.http.get(`product/getNewStockProducts`);
  }

}
