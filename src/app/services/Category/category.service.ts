import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/Category';
import { ProductSubCategory } from 'src/app/models/ProductSubCategory';
import { environment } from 'src/environments/environment';
import { HttpApiService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  getCategories(): Observable<Category[]>{
    return this.http.get(`category/getCategories`);
  }
  getSubCategories(): Observable<ProductSubCategory[]>{
    return this.http.get(`category/getSubCategories`);
  }
 

}
