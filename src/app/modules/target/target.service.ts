
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'
import { TargetList } from './targetList';
import { HttpApiService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  getAllTarget(id): Observable<TargetList[]>{
    return this.http.get('target/getTargetListByCustomerId/?id='+id);
  }
  createTarget(data): Observable<any>{
    return this.http.post('target/SaveTarget', data);
  }
  getTargetListByCustomerIdsUnderPartner(data): Observable<any>{
    return this.http.post('target/getTargetListByCustomerIdsUnderPartner', data);
  }
}
