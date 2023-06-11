import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { DataService } from '../../../services/Shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  user: any;
  allNotification: any = [];
  isReadMore: boolean = true;
  notificationId: number;
  redirectUrl: any;
  holder: any = {};
  constructor(
    private notificationService: NotificationService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['url']) {
        this.redirectUrl = queryParams['url'];
      }
    })
  }

  ngOnInit(): void {

    this.user = this.dataService.getUserFromLocalStorage();
    this.getAllNotification();
  }

  // to call function from  notification service.

  markasReadNotificationByCustomerIds(noti) {
    if (noti.noti_broadcast_type == 3) {
      this.notificationId = noti.notification_id;
      this.notificationService.markasReadNotificationByCustomerIds(this.notificationId).subscribe(res => {
        console.log(res);
        this.redirectUrl = noti.RedirectURL;
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
        } else {
          this.router.navigate(['/notification/list']);
        }
      });
    }
    else {
      this.redirectUrl = noti.RedirectURL;
      if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl]);
      } else {
        this.router.navigate(['/notification/list']);
      }
    }
    this.getAllNotification();
  }


  getAllNotification() {
    this.notificationService.getAllNotification(this.user.customer_id).subscribe(res => {
      console.log(res);
      this.allNotification = res['data'];
    });
  }
  
  // showText() {
  //   this.isReadMore = !this.isReadMore
  // }
}
