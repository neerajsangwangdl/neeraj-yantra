import { Component, Inject, OnDestroy, OnInit } from '@angular/core';


import { Customer } from 'src/app/models/customer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OrderService } from 'src/app/services/order.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../notification.service';
import { MasterService } from 'src/app/services/master.service';
import { CustomerService } from '../../user/customer.service';
import { __values } from 'tslib';
@Component({
  selector: 'app-notification-insert',
  templateUrl: './notification-insert.component.html',
  styleUrls: ['./notification-insert.component.scss']
})
export class NotificationInsertComponent implements OnInit, OnDestroy {
  orderList: any = [];
  Count: any = 1000;
  orderListOriginal: any = [];
  SelectedUsersArr: any = [];
  selectedUsers = [];
  flagSwitch = 3;
  filteredBillList: any;
  customerList: any[] = [];
  customer: Customer = new Customer();
  NotificationInsertForm: FormGroup;
  allNotification: any = [];
  noti_broadcast_type: any = 1;
  SelectedUser: any;
  customerId: any = [];
  partenrId: any;
  loading = false;
  submitted = false;
  user: any;
  status: any;
  NotificationData: any = {
    ForCustomerIds: [],
    PartnerId: '',
  };
  searchString: any = '';
  public searchText: string;
  // public SearchModelChanged: Subject<any> = new Subject<any>();
  // public searchModelChangeSubscription: Subscription
  SelectedUsers: any = [];
  filterStatus: any = [
    { StatusId: 1, StatusName: "Placed" },
    { StatusId: 2, StatusName: "Confirmed" },
    { StatusId: 6, StatusName: "Paid & DeliveryPending" }
  ];


  ProductAndItemList: any[];
  pendingAmountForUser: any;


  customerListdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    limitSelection: 1,
    allowSearchFilter: true
  };



  today = new Date();
  billsFromDate: any = new Date(new Date().setDate(this.today.getDate() - 30));
  constructor(
    private formBuilder: FormBuilder,
    private OrderService: OrderService,
    private datepipe: DatePipe,
    public notificationService: NotificationService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private GlobalHttpService: GlobalHttpService,
    public globalService: GlobalService,
    private masterService: MasterService,
    private customerService: CustomerService) {
  }


  ngOnInit() {
    this.searchCustomer();
    console.log(this.billsFromDate)
    this.user = this.dataService.getUserFromLocalStorage();
    this.buildForm()
    this.getbills();
    this.getAllNotification();
    // this.getNotificationListByCustomerId();
    // this.searchModelChangeSubscription = this.SearchModelChanged
    //   .pipe(
    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(newText => {
    //     this.searchString = newText.trim();
    //     console.log(newText);
    //     this.getNotificationListByCustomerId()
    //   });
  }
  buildForm() {
    this.NotificationInsertForm = this.formBuilder.group({
      notification_name: ['', [Validators.required, Validators.maxLength(50)]],
      notification_description: [''],
      notification_type: ['1', [Validators.required,]],
      ForCustomerId: [''],
      PartnerId: [this.user.customer_id],
    });
  }

  get f() { return this.NotificationInsertForm.controls; }

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


  // getCustomerById() {
  //   this.customerService.getCustomerById(this.customerId)
  //     .subscribe(p => {
  //       this.customer = p;
  //       // this.patchProductForm()
  //     })
  // }

  // onCustomerSearchFilterChange(event) {
  //   this.searchText = event;
  //   this.searchCustomer();
  // }

  getNotificationListByCustomerId() {
    this.NotificationData['PartnerId'] = this.user.customer_id;
    this.notificationService.getNotificationListByCustomerIds(this.NotificationData).subscribe(res => {
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

  getOrders() {
    let status = [];
    if (this.filterStatus.length) {
      this.filterStatus.forEach(element => {
        status.push(element.StatusId)
      });
    }
    this.dataService.setSelectedStatusInLocalStorage(this.filterStatus);
    const data = {
      count: this.Count || 500,
      customer_id: '0',
      status: status
    }
    this.OrderService.getMostRecentOrdersByCount(data).subscribe(res => {
      if (res['status'] == 200) {
        this.orderListOriginal = res['data'];
        this.orderList = res['data'];
        this.pendingAmountForUser = 0;
        if (this.SelectedUsersArr.length) {
          this.filterOrdersbyCustomer();
        }
      }
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.NotificationInsertForm.get('image').setValue(file);
    }
  }

 

  onSelect(element) {
    let indx = this.SelectedUsersArr.indexOf(element.customer_id);
    if (indx > -1) {
      this.SelectedUsersArr.splice(indx, 1);
    } else {
      this.SelectedUsersArr.push(element.customer_id);
    }
    console.log(12, this.SelectedUsersArr);
  }
  onSelectAll() {
    // this.noti_broadcast_type =1;
    // this.notification_broadcast_type(this.noti_broadcast_type);
  }
  notification_broadcast_type(event) {
    this.noti_broadcast_type = event;
  }
 


  deleteBillsbyId(bill) {

    if (confirm('Do you want to delete this?')) {
      // this.BillingSaasService.deleteBillsById(bill.Bill_id).subscribe(res => {
      //   if (res['status'] == 200) {
      //     this.toastr.success(res['message']);
      //     this.getbills();
      //   }
      // })
    }


  }


  getAllNotification() {
    this.notificationService.getAllNotification(this.user.customer_id).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allNotification = res['data'];
      }
    });
  }

  getbills() {
    // deleteCreditDebitById copy krna
    const params = {
      SearchString: this.searchString,
      count: '100',
      date: this.datepipe.transform(this.billsFromDate, 'shortDate')

    }
    // this.BillingSaasService.getBills(params).subscribe(a => {
    //   this.billList = a.data;
    //   this.globalService.WarrantyValidator(this.billList[0].WarrantyInDays, this.billList[0].CreatedOn)
    //   this.filteredBillList = a;
    // })
  }

  // OnclickDownload(image) {
  //   window.open(image);
  // }
  onSubmit() {
    this.submitted = true;
    if (this.NotificationInsertForm.invalid) {
      return;
    }
    // agar for all users ki state hai
    if (this.noti_broadcast_type==3) {
      if (this.SelectedUsersArr.length) {
        this.NotificationInsertForm.value.ForCustomerId = this.SelectedUsersArr;
        this.NotificationInsertForm.value.noti_broadcast_type =3;

      } else {
        alert('Apne koi User Select nahi kiya hai');
        return;
      }
    }
    else if (this.noti_broadcast_type==1) {
      this.NotificationInsertForm.value.noti_broadcast_type =1;
      // this.NotificationInsertForm.value.ForCustomerId =this.user.customer_id;
    }
    else{
      this.NotificationInsertForm.value.noti_broadcast_type =2;
      // this.NotificationInsertForm.value.ForCustomerId =this.user.customer_id;
    }
    // this.globalService.show();
    this.NotificationInsertForm.value;
    console.log(this.NotificationInsertForm.value)
    this.notificationService.createNotification(this.NotificationInsertForm.value)
      .subscribe(res => {
        this.globalService.hide();
        if (res['status'] == 200) {
          this.toastr.success(res['message']);
        } else {
          this.toastr.warning('Error!', res['data']);
        }
      })
    console.log(this.NotificationInsertForm.value);
  }

  salemanSelected() {
    this.ProductAndItemList = [];
    let productsById = {};
    this.orderList.forEach(order => {
      order.order_details.forEach(element => {
        if ([1, 2, 6].indexOf(element.status) > -1 && !element.assigned_bag_saleman) {
          if (productsById[element.product_id]) {
            // productsById[element.product_id]['saleman'] = this.SelectedSaleman;
            productsById[element.product_id]['total_units'] += element.units;
            productsById[element.product_id]['item_ids'].push(element.item_id);
          } else {
            productsById[element.product_id] = {
              product_id: element.product_id,
              item_ids: [element.item_id],
              total_units: element.units,
              name: element.name,
            }
          }
        }
      });
    });
    this.ProductAndItemList = Object.keys(productsById).map((key) => productsById[key]);
  }
  createSelectedUserArray() {
    this.SelectedUsersArr = [];
    this.SelectedUsers.forEach(element => {
      this.SelectedUsersArr.push(element.customer_id)
    });
  }
  filterOrdersbyCustomer() {
    this.orderList = [];
    this.createSelectedUserArray();
    this.orderListOriginal.filter((element) => {
      if (this.SelectedUsersArr.indexOf(element.customer_id) > -1 && !element.assigned_bag_saleman) {
        this.orderList.push(element)
      }
    });
    this.orderList = this.SelectedUsersArr.length ? this.orderList : this.orderListOriginal;
    this.salemanSelected();
  }
  ngOnDestroy() {
    // this.searchModelChangeSubscription.unsubscribe();
    // this.searchModelChangeSubscription.unsubscribe();
  }
}
