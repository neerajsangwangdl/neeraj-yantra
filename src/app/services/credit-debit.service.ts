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
export class CreditDebitService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  orderList: any = [];
  constructor(private http: HttpApiService,
    public globalService: GlobalService,
    private datepipe: DatePipe) { }

  getAllCreditDebit(): Observable<Product[]> {
    return this.http.get(`credit-debit/getAllCreditDebit`);
  }

  deleteCreditDebitById(id): Observable<Product[]> {
    return this.http.delete(`credit-debit/deleteCreditDebitById/${id}`);
  }

  addNewStatementByCustomerId(data): Observable<Product[]> {
    return this.http.post(`credit-debit/addNewStatementByCustomerId`, data);
  }

  getAllCreditDebitCommulative(): Observable<Product[]> {
    return this.http.get(`credit-debit/getAllCreditDebitCommulative`);
  }

  getCreditDebitByCustomerId(id): Observable<Product[]> {
    return this.http.get(`credit-debit/getCreditDebitByCustomerId/${id}`);
  }

  getCreditDebitBySalemanId(id): Observable<Product[]> {
    return this.http.get(`credit-debit/getCreditDebitBySalemanId/${id}`);
  }
}
