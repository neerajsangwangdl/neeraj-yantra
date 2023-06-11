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
import { Paging } from 'src/app/models/paging';
@Component({
  selector: 'app-create-bag-by-admin',
  templateUrl: './create-bag-by-admin.component.html',
  styleUrls: ['./create-bag-by-admin.component.scss']
})
export class createBagByAdminComponent implements OnInit {
  user: any;
  orderList: any = [];
  orderListOriginal: any = [];
  Count: any = 1000;
  bagItemCount: number = 0;
  public searchText: string;
  public searchModelChanged: Subject<string> = new Subject<string>();
  public searchModelChangeSubscription: Subscription
  SelectedSaleman: any;
  SelectedUsers: any = [];
  customerList: any[] = [];
  status: any;
  waNoti: string;
  filterStatus: any = [
    { StatusId: 1, StatusName: "Placed" },
    { StatusId: 2, StatusName: "Confirmed" },
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
  productList: any;
  SelectedProduct: any;
  spareQty: any;
  salemanList: any[];
  OnLoadFlag: any = true;
  salemanListDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };

  constructor(private MasterService: MasterService,
    private OrderService: OrderService,
    private dataService: DataService,
    public globalService: GlobalService) {
    // this.filterStatus = this.dataService.getSelectedStatusFromLocalStorage();

  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  customerListDropdownSettings: IDropdownSettings = {};
  productListDropdownSettings: IDropdownSettings = {};
  SalemanListDropdownSettings: IDropdownSettings = {};
  showItems: any = {};


  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();;
    this.dataService.bagCount.subscribe(count => this.bagItemCount = count);
    this.getOrders();
    this.getStatusMaster();
    this.searchCustomer();
    this.searchSaleman();
    this.searchProducts();
    // this.getAllPendingPayments();
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(obj => {
        let query = obj.split('/');
        this.searchText = query[0].trim();
        if (query[1] == 'customer') this.searchCustomer();
        else if (query[1] == 'products') this.searchProducts();
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
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
    this.SalemanListDropdownSettings = {
      singleSelection: false,
      idField: 'customer_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 30,
      allowSearchFilter: true
    };
    this.productListDropdownSettings = {
      singleSelection: false,
      idField: 'product_id',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: true
    };
  }

  onChangeSelectedUser(val) {
    this.SelectedSaleman = val;
    this.getorderByCustomerId();
  }

  searchCustomer() {
    const data = {
      SearchString: this.searchText || '',
      CustomerRole: [10]
    }
    this.customerList = [];
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          // this.orde
          this.customerList = res['data'];
          if (this.OnLoadFlag){
            [this.customerList, this.salemanList] = this.globalService.filterCustomerAndEmployeesbyRole(res['data'], [7,8,9])
            this.OnLoadFlag = false
          }
        } else {
          // this.toastr.warning('Error!', res['message']);
        }
      })
  }


  searchSaleman() {
    const data = {
      SearchString: this.searchText || '',
      CustomerRole: [8]
    }
    this.salemanList = [];
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          // this.orde
          this.salemanList = res['data'];
        } else {
          // this.toastr.warning('Error!', res['message']);
        }
      })
  }

  saveSpareProductinBag(qty, product, notes) {
    const data = {
      product_id: product.ProductId,
      total_units: qty,
      notes: notes || '',
      saleman: this.SelectedSaleman.customer_id || this.user.customer_id,
    }
    this.OrderService.updateSpareProductInBag(data).subscribe(res => {
      if (res['status'] == 200) {
        alert(res['message']);
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

  
  searchProducts() {
    let filterObj: Paging = new Paging();
    filterObj.DepartmentId = 0;
    filterObj.CategoryId = 0;
    filterObj.SubCategoryId = 0;
    filterObj.PageSize = 500; //count
    filterObj.PageNumber = 0; //offset
    filterObj.CurrentPage = 1;
    filterObj.SearchString = this.searchText;
    // let productPagingObj: any = {};
    this.MasterService.getProductList(filterObj).subscribe(res => {
      if (res.status == 200) {
        this.productList = res.data['Products'];
        // this.productList = !this.productList.length ? productPagingObj.Products : this.productList.concat(productPagingObj.Products);
      }
    });
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

  getorderByCustomerId() {
    this.MasterService.getorderByCustomerId(this.SelectedSaleman['customer_id']).subscribe(res => {
      if (res['status'] == 200) {
        this.orderListOriginal = res['data'];
        this.orderList = res['data'];
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

  SubmitBag(): void {
    const self = this;
    this.user = this.dataService.getUserFromLocalStorage()
    // this.ProductAndItemList
    const data = {
      bag: this.ProductAndItemList,
      notes: this.notes || '',
      saleman: this.SelectedSaleman.customer_id,
    }
    self.OrderService.SubmitBag(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          alert(res['message']);
          this.getOrders();
        }
      });
  }
}