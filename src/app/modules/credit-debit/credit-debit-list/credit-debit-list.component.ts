import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { HTML2PDFService } from 'src/app/services/html2pdf.service';
import { MasterService } from 'src/app/services/master.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CreditDebitService } from 'src/app/services/credit-debit.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-credit-debit-list',
  templateUrl: './credit-debit-list.component.html',
  styleUrls: ['./credit-debit-list.component.scss']
})
export class CreditDebitListComponent implements OnInit {
  user: Customer;
  orderList: any = [];
  orderListOriginal: any;
  Count: any = 1000;
  public searchText: string;
  private searchModelChanged: Subject<string> = new Subject<string>();
  private searchModelChangeSubscription: Subscription
  SelectedUser: any;
  customerList: any[];
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
  creditDebitListOriginal: any;
  creditDebitList: any;

  constructor(private MasterService: MasterService,
    private CreditDebitService: CreditDebitService,
    private dataService: DataService,
    public OrderService: OrderService,
    public globalService: GlobalService) {
    this.filterStatus = this.dataService.getSelectedStatusFromLocalStorage();

  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  showItems: any = {};


  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();;
    this.getCreditDebits();
    this.getStatusMaster();
    this.searchCustomer();
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
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onChangeSelectedUser(val) {
    this.SelectedUser = val;
    this.getorderByCustomerId();
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

  getCreditDebits() {
    this.CreditDebitService.getAllCreditDebit().subscribe(res => {
      if (res['status'] == 200) {
        this.creditDebitListOriginal = res['data'].reverse();
        this.creditDebitList = res['data'];
      }
    });
  }

  deleteLedger(id) {
    this.CreditDebitService.deleteCreditDebitById(id).subscribe(res => {
      alert(res['message'])
      if (res['status'] == 200) {
        this.getCreditDebits()
      }
    });
  }

  getAllPendingPayments() {
    // this.CreditDebitService.getPendingPayment().subscribe(res => {
    //   if (res['status'] == 200) {
    //     this.pendingPayment = res['data']['pendingtotalTobePaid'];
    //     // this.orderList = res['data'];
    //   }
    // });
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
    this.MasterService.getorderByCustomerId(this.SelectedUser['customer_id']).subscribe(res => {
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
        item_id: item.item_id
      }
    }
  }

  onCancelCompleteCreditDebit(order) {
    let str = order.cName + 'ji ka complete ' + order.order_id + ' order cancel krna hai? ';
    if (confirm(str)) {
      const data = {
        StatusId: 4
      }
    }
  }

  filterCreditDebit(str) {
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
}