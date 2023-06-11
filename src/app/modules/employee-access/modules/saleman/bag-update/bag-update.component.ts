import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { HTML2PDFService } from 'src/app/services/html2pdf.service';
import { MasterService } from 'src/app/services/master.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bag-update',
  templateUrl: './bag-update.component.html',
  styleUrls: ['./bag-update.component.scss']
})
export class bagupdateComponent implements OnInit {
  user: Customer;
  orderList: any = [];
  orderListOriginal: any = [];
  Count: any = 1000;
  public searchText: string;
  private searchModelChanged: Subject<string> = new Subject<string>();
  private searchModelChangeSubscription: Subscription
  SelectedSaleman: any;
  SelectedUsers: any = [];
  customerList: any[] = [];
  status: any;
  waNoti: string;
  filterStatus: any = [
    { StatusId: 1, StatusName: "Placed" },
    { StatusId: 2, StatusName: "Confirmed" },
    { StatusId: 5, StatusName: "Delivered & PaymentPending" },
    { StatusId: 6, StatusName: "Paid & DeliveryPending" }
  ];
  total_order_amount_paid: number;
  total_order_amount: number;
  pendingPayment: number;
  pendingAmountForUser: any;
  allowedStatus: any = [5]; // for pending payment calculation
  SelectedUsersArr: any = [];
  ProductAndItemList: any;
  notes: any;
  bagOrderListOriginal: any;
  bagOrderList: any;
  bagIds: any[];
  pendingItemTobeReturn: any;

  constructor(private MasterService: MasterService,
    private OrderService: OrderService,
    private dataService: DataService,
    private route: ActivatedRoute,
    public globalService: GlobalService) {
    this.route.params.subscribe(res => {
      this.SelectedSaleman = res.id;
    });
    // this.filterStatus = this.dataService.getSelectedStatusFromLocalStorage();

  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  customerListDropdownSettings: IDropdownSettings = {};
  showItems: any = {};


  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();;
    this.getOrders();
    this.getStatusMaster();
    this.searchCustomer();
    this.getBagBySalemanId()
    this.getpendingItemTobeReturn();
    // this.getAllPendingPayments();
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        this.searchText = newText.trim();
        console.log(newText);
        this.searchCustomer();

      });

    // multi select
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'StatusId',
      textField: 'StatusName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };
    this.customerListDropdownSettings = {
      singleSelection: false,
      idField: 'customer_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 30,
      allowSearchFilter: true
    };
  }

  searchCustomer() {
    const data = {
      SearchString: this.searchText || ''
    }
    this.customerList = [];
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          // this.orde
          this.customerList = res['data'];
        } else {
          // this.toastr.warning('Error!', res['message']);
        }
      })
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
      if (this.SelectedUsersArr.indexOf(element.customer_id) > -1) {
        this.orderList.push(element)
      }
    });
    this.orderList = this.SelectedUsersArr.length ? this.orderList : this.orderListOriginal;
    this.salemanSelected();
  }

  getOrders() {
    let status = [];
    // if (this.filterStatus.length) {
    //   this.filterStatus.forEach(element => {
    //     status.push(element.StatusId)
    //   });
    // }
    // this.dataService.setSelectedStatusInLocalStorage(this.filterStatus);
    const data = {
      count: this.Count || 500,
      customer_id: '0',
      saleman_id: this.SelectedSaleman,
      status: status,

    }
    this.OrderService.getMostRecentOrdersByCount(data).subscribe(res => {
      if (res['status'] == 200) {
        this.orderListOriginal = res['data'];
        this.orderList = res['data'];
        this.pendingAmountForUser = 0;
        if (this.SelectedUsersArr.length) {
          this.filterOrdersbyCustomer();
        }
        this.salemanSelected()
      }
    });
  }

  getPendingAmountForUser() {
    let totalPaidForUser = 0;
    let totalAmountForUser = 0;
    this.orderListOriginal.forEach(element => {
      if (this.allowedStatus.indexOf(element.status) > -1) {
        totalPaidForUser += element.pAmount || 0;
        totalAmountForUser += this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(element.order_details, 'units', 'unit_cost') || 0;
      }
    });
    this.pendingAmountForUser = Math.round(totalAmountForUser - totalPaidForUser);
  };

  getAllPendingPayments() {
    this.OrderService.getPendingPayment().subscribe(res => {
      if (res['status'] == 200) {
        this.total_order_amount_paid = this.globalService.getTotalOfColumn(res['data'], 'TotalPaid') || 0;
        this.total_order_amount = this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(res['data'], 'units', 'unit_cost') || 0;
        this.pendingPayment = Math.round(this.total_order_amount - this.total_order_amount_paid);
        // this.orderList = res['data'];
      }
    });
  }

  Remaining(a = 0, b = 0) {
    return Math.round(a - b)
  }

  getStatusMaster() {
    this.MasterService.getStatusMaster().subscribe(res => {
      if (res['status'] == 200) {
        this.status = res['data'];
      }
    });
  }

  returnBagItem(bag) {
    let units = prompt('Kitni unit return ki hai?');
    const data = {
      bag_id: bag.bag_id,
      product_id: bag.product_id,
      return_units: units || 0,
      saleman: this.SelectedSaleman,
    }
    this.OrderService.returnBag(data)
      .subscribe(res => {
        alert(res['message']);
        this.getBagBySalemanId();
      });
  }

  archievedBags(): void {
    const self = this;
    this.user = this.dataService.getUserFromLocalStorage()
    // this.ProductAndItemList
    const data = {
      bag_ids: this.bagIds,
      saleman: this.SelectedSaleman,
    }
    self.OrderService.archievedBags(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          alert(res['message']);
          this.getOrders();
          this.getpendingItemTobeReturn();
        }
      });
  }

  handoverBagsToSaleman(): void {
    const self = this;
    this.user = this.dataService.getUserFromLocalStorage()
    // this.ProductAndItemList
    const data = {
      bag_ids: this.bagIds,
      saleman: this.SelectedSaleman,
    }
    self.OrderService.handoverBagsToSaleman(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          alert(res['message']);
          this.getOrders();
          this.getpendingItemTobeReturn();
        }
      });
  }

  setupdateOrderQtyByItemID(item) {
    let qty = prompt('kitni quantity set krni hai?')
    if (qty) {
      const data = { 'item_id': item.item_id, 'order_id': item.order_id, 'qty': qty };
      this.OrderService.updateOrderQtyByItemID(data).subscribe(res => {
        this.globalService.hide();
      });
    }
  }

  updateBagInitQtyByBagID(id) {
    let qty = prompt('kitni quantity set krni hai?')
    if(qty) {
      const data = {'bag_id': id, 'qty' : qty};
      this.OrderService.updateBagInitQtyByBagID(data).subscribe(res => {
        this.globalService.hide();
        if (res['status'] == 200) {
          this.getOrders();
        }
      });
    }
  }

  getBagBySalemanId() {
    this.MasterService.getbagBySalemanId(this.SelectedSaleman).subscribe(res => {
      if (res['status'] == 200) {
        this.bagOrderListOriginal = res['data'];
        this.bagOrderList = res['data'];
        this.bagIds = this.globalService.getArrayofOneColumnOfArrOfObj(this.bagOrderList, 'bag_id')
      }
    });
  }
  getpendingItemTobeReturn() {
    this.MasterService.getpendingItemTobeReturn(this.SelectedSaleman).subscribe(res => {
      if (res['status'] == 200) {
        this.pendingItemTobeReturn = res['data'];
      }
    });
  }
  onChangeStatus(Status, item) {
    let str = item.cName + 'ji ka "' + item.units + ' ' + item.name + '" ka status change karna hai? Amount: Rs. ' + item.units * item.unit_cost + '?';
    if (confirm(str)) {
      const data = {
        StatusId: Status,
        item_id: item.item_id,
        order_id: item.order_id
      }
      this.OrderService.updateOrderStatusByItemID(data).subscribe(res => {
        alert(res['message']);
        this.getOrders();
      });
    }
  }

  filterOrder(str) {
    this.orderList = this.orderListOriginal;
    if (str.length) {
      this.orderList = this.globalService.filterByValue(this.orderList, str);
    } else {
      this.orderList = this.orderListOriginal;
    }
    // this.orderList.filter(o => Object.keys(o).some(k => o[k] && o[k].toString().toLowerCase().includes(str.toLowerCase())))
    console.log(this.orderList)
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  salemanSelected() {
    this.ProductAndItemList = [];
    let productsById = {};
    this.orderList.forEach(element => {
      if ([1, 2, 6].indexOf(element.status) > -1) {
        if (productsById[element.product_id]) {
          // productsById[element.product_id]['saleman'] = this.SelectedSaleman;
          productsById[element.product_id]['total_units'] = element.units;
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
    this.ProductAndItemList = Object.keys(productsById).map((key) => productsById[key]);
  }
  SubmitBag(): void {
    this.user = this.dataService.getUserFromLocalStorage()
    // this.ProductAndItemList
    const data = {
      bag: this.ProductAndItemList,
      notes: this.notes || '',
      saleman: this.SelectedSaleman.customer_id,
    }
    this.OrderService.SubmitBag(data)
      .subscribe(res => {

      });
  }
}