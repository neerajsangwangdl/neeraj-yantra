import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/app/models/customer';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DistributersList } from './register/distributerslist';
import { HttpApiService } from 'src/app/services/http.service';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  AddNewCustomer(customer: Customer): Observable<boolean> {
    return this.http.post(`customer/addNewCustomer`, customer);
  }

  Login(username: string, password: string): Observable<Customer> {
    return this.http.post(`customer/authenticateLogin`, { Mobile: username, Password: password });
  }

  Logout() {
    let result = this.http.get(`customer/logout`);
    return result;
  }

  getCustomerById(id) {
    return this.http.get(`customer/getCustomerById/${id}`);
  }
  getDistributersList(): Observable<DistributersList[]> {
    return this.http.get(`customer/getPartnersList`);
  }
  updateCustomer(data:any): Observable<any>{
    return this.http.post(`user/updateUserById`, data);
  }
}
