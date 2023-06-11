
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'
import { NotificationList } from './notificationlist';
import { HttpApiService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url = environment.apiUrl || localStorage.getItem('ServerUrl');
  constructor(private http: HttpApiService) { }

  getAllNotification(id): Observable<NotificationList[]>{
    return this.http.get('notification/getNotificationListByCustomerId/?id=' + id);
  }
  createNotification(data): Observable<any>{
    return this.http.post('notification/SaveNotification', data);
  }
  getNotificationListByCustomerIds(data): Observable<NotificationList[]>{
    return this.http.post('notification/getNotificationListByCustomerIdsUnderPartner', data );
  }
  markasReadNotificationByCustomerIds(id): Observable<NotificationList[]>{
    return this.http.get('notification/MarkAsReadNotification/?NotificationId=' + id );
  }
}
