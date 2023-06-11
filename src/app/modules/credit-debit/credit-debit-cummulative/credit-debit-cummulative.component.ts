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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-credit-debit-cummulative',
  templateUrl: './credit-debit-cummulative.component.html',
  styleUrls: ['./credit-debit-cummulative.component.scss']
})
export class CreditDebitCommulativeComponent implements OnInit {
  user: any;
  orderList: any = [];
  orderListOriginal: any;
  Count: any = 1000;
  public searchText: any;
  public searchModelChanged: Subject<any> = new Subject<any>();
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
  ledgerForm: FormGroup;
  submitted: boolean;
  ledgerToggle: boolean = false;

  constructor(private MasterService: MasterService,
    private CreditDebitService: CreditDebitService,
    private formBuilder: FormBuilder,
    public OrderService: OrderService,
    private dataService: DataService,
    public globalService: GlobalService) {
    this.filterStatus = this.dataService.getSelectedStatusFromLocalStorage();

  }
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  showItems: any = {};


  ngOnInit(): void {
    this.ledgerForm = this.formBuilder.group({
      action_for: ['', Validators.required],
      type: ['debit', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
    this.user = this.dataService.getUserFromLocalStorage();;
    this.getAllCreditDebitCommulative();
    this.getStatusMaster();
    this.searchCustomer();
    // this.getAllPendingPayments();
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        
        this.searchText = newText ? newText.trim() : '';
        console.log(newText);
        this.searchCustomer();

      });

    // multi select
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'customer_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No Data Available'
    };
  }

  get f() { return this.ledgerForm.controls; }


  onChangeSelectedUser(val) {
    this.SelectedUser = val;
    this.getorderByCustomerId();
  }

  searchCustomer() {
    const data = {
      SearchString: this.searchText || ''
    }
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          this.customerList = res['data'] && res['data'].length ? res['data']: [{ 'customer_id': 0, 'name': 'No Data' }] ;
        }
      })
  }
  deleteLedger(id) {
    this.CreditDebitService.deleteCreditDebitById(id).subscribe(res => {
      alert(res['message'])
      if (res['status'] == 200) {
        this.getAllCreditDebitCommulative();
      }
    });
  }

  onSubmitForm() {
    this.submitted = true;
    if (this.ledgerForm.invalid) {
      return;
    }
    this.ledgerForm.value['action_for'] = typeof this.ledgerForm.value['action_for'] == 'number' ? this.ledgerForm.value['action_for'] :  this.ledgerForm.value['action_for'][0]['customer_id']
    this.ledgerForm.value['CustomerId'] = this.user.customer_id;
    this.CreditDebitService.addNewStatementByCustomerId(this.ledgerForm.value)
      .subscribe(
        res => {
          alert(res['message']);
          if (res['status'] && res['status'] == 200) {
          }
        },
        error => {
          // this.toastr.error(error);
        });
  }

  getAllCreditDebitCommulative() {
    let status = [];
    // this.dataService.setSelectedStatusInLocalStorage(this.filterStatus);
    // const data = {
    //   count: this.Count || 500,
    //   customer_id: this.SelectedUser ? this.SelectedUser.customer_id : '0',
    //   status: status
    // }
    this.CreditDebitService.getAllCreditDebitCommulative().subscribe(res => {
      if (res['status'] == 200) {
        this.creditDebitListOriginal = res['data'];
        this.creditDebitList = res['data'];

      }
    });
  }
  filterLedger(isChecked) {
    this.creditDebitList = this.creditDebitListOriginal;
    if(isChecked) {
      this.creditDebitList = this.creditDebitList.filter((obj) => {
        return obj.Balance > 0;
      })
    }
    
  }

  getPendingAmountForUser() {
    // let totalPaidForUser = 0;
    // let totalAmountForUser = 0;
    // this.orderListOriginal.forEach(element => {
    //   if (this.allowedStatus.indexOf(element.status) > -1) {
    //     totalPaidForUser += element.pAmount || 0;
    //     totalAmountForUser += this.globalService.getTotalOfNonCancelledCreditDebitWithDeliveryCharges(element.order_details, 'units', 'unit_cost') || 0;
    //   }
    // });
    // this.pendingAmountForUser = Math.round(totalAmountForUser - totalPaidForUser);
  };

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
    console.log(this.orderList)
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}