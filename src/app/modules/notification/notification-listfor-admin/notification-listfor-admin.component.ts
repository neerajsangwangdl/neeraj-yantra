import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { MasterService } from 'src/app/services/master.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-notification-listfor-admin',
  templateUrl: './notification-listfor-admin.component.html',
  styleUrls: ['./notification-listfor-admin.component.scss']
})
export class NotificationListforAdminComponent implements OnInit {
  NotificationData: any = {
    ForCustomerIds: [],
    PartnerId: '',
  };
  customerListdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  allNotificationData: any = [];
  allNotification: any = [];
  user: any;
  customerList: any[] = [];
  SelectedUser: any;
  wordWrap: any = {};
 
  
  public searchText: string;
  constructor(private notificationService: NotificationService,
    private dataService: DataService,
    private masterService: MasterService) { }

  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();
    this.getAllNotification();
    this.getNotificationListByCustomerId();
    this.searchCustomer();
  }


  onCustomerSelect(event) {
    console.log(event);
    let indx = this.NotificationData['ForCustomerIds'].indexOf(event.customer_id);
    if (indx > -1) {
      this.NotificationData['ForCustomerIds'].splice(indx, 1);
    } else {
      this.NotificationData['ForCustomerIds'].push(event.customer_id);
    }
    this.getNotificationListByCustomerId();
  }

  onAllCustomerSelect(event) {
    console.log(event)
    for (let i = 0; i < event.length; i++) {
      let element = event[i]
      let indx = this.NotificationData['ForCustomerIds'].indexOf(element.customer_id);
      if (indx > -1) {
        this.NotificationData['ForCustomerIds'].splice(indx, 1);
      } else {
        this.NotificationData['ForCustomerIds'].push(element.customer_id);
      }
    }
    this.getNotificationListByCustomerId();
  }

  wordWrapFunction(id){
    this.wordWrap = {};
    this.wordWrap[id] = 1;
  }

  getNotificationListByCustomerId() {
    this.NotificationData['PartnerId'] = this.user.customer_id;
    this.notificationService.getNotificationListByCustomerIds(this.NotificationData).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allNotificationData = res['data'];
      }
    });
  }

  getAllNotification() {
    this.notificationService.getAllNotification(this.user.customer_id).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allNotification = res['data'];
      }
    });
  }

  searchCustomer() {
    const data = {
      SearchString: this.searchText || ''
    }
    this.customerList = [];
    this.masterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          this.customerList = res['data'];
        }
      })
  }
}
