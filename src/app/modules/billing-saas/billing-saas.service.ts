import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpApiService } from '../../services/http.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BillingSaasService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  version = environment.VERSION;

  constructor(private http: HttpApiService) {
  }
  notifyCustomer(shopName, Description: any, mobile: any, WarrantyInDays: any, Link: any, isInWarranty = true) {
    let finalStr = `https://wa.me/+91${mobile}/?text=*Dear Customer*, %0a%0a Apke ${Description} product ki  ${isInWarranty ? WarrantyInDays + ' din ki  Warranty hai' : WarrantyInDays + ' din ki  Warranty thi, Ab expire ho chuki hai'}. Please find invoice on link ${Link} \n
    Yours Truely \n
    *${shopName}*.`;
    window.open(finalStr)
  }
  createBill(data: any) {
    return this.http.post(`billing_saas/create`, data);
  }
  getBills(params): Observable<any> {
    return this.http.get(`billing_saas/FilteredBills`, params);
  }
  deleteBillsById(Bill_id: number): Observable<any> {
    return this.http.delete(`billing_saas/DeleteBills/?Bill_id=${Bill_id}`);
  }
}
