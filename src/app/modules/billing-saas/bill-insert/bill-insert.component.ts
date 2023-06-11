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
import { BillingSaasService } from '../billing-saas.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OrderService } from 'src/app/services/order.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-bill-insert',
  templateUrl: './bill-insert.component.html',
  styleUrls: ['./bill-insert.component.scss']
})
export class BillInsertComponent implements OnInit, OnDestroy {
  orderList: any = [];
  Count: any = 1000;
  orderListOriginal: any = [];
  SelectedUsersArr: any = [];
  filteredBillList: any;
  customerList: any[] = [];
  customer: Customer = new Customer();
  BillInsertForm: FormGroup;
  loading = false;
  submitted = false;
  user: any;
  status: any;
  searchString: any = '';
  public BillSearchModelChanged: Subject<string> = new Subject<string>();
  public BillsDateSearchModelChanged: Subject<any> = new Subject<any>();
  public searchModelChangeSubscription: Subscription
  SelectedUsers: any;
  filterStatus: any = [
    { StatusId: 1, StatusName: "Placed" },
    { StatusId: 2, StatusName: "Confirmed" },
    { StatusId: 6, StatusName: "Paid & DeliveryPending" }
  ];
  customerListDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 2,
    allowSearchFilter: true
  };
  ProductAndItemList: any[];
  pendingAmountForUser: any;
  billList: any = []
  today = new Date();
  billsFromDate: any= new Date(new Date().setDate(this.today.getDate() - 30));
  constructor(
    private formBuilder: FormBuilder,
    private OrderService: OrderService,
    private datepipe: DatePipe,
    public BillingSaasService: BillingSaasService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router,
    private GlobalHttpService: GlobalHttpService,
    public globalService: GlobalService) {
  }
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'StatusId',
    textField: 'StatusName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    noDataAvailablePlaceholderText: 'No Data Available',
    itemsShowLimit: 4,

    allowSearchFilter: true
  };

  ngOnInit() {
    console.log(this.billsFromDate)
    this.user = this.dataService.getUserFromLocalStorage();
    this.buildForm()
    this.getbills();
    this.searchModelChangeSubscription = this.BillSearchModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        this.searchString = newText.trim();
        console.log(newText);
        this.getbills();

      });

      this.searchModelChangeSubscription = this.BillsDateSearchModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(newDate => {
        this.billsFromDate = newDate;
        console.log(newDate);
        this.getbills();

      });

  }
  buildForm() {
    this.BillInsertForm = this.formBuilder.group({
      Mobile: ['', [Validators.required, Validators.min(5000000000), Validators.max(9999999999)]],
      Description: [''],
      IsActive: ['1'],
      SellerDetail: [this.user.customer_id || 15, [Validators.required]],
      WarrantyInDays: ['90', [Validators.required, Validators.min(0)]],
      image: [null, [Validators.required]],
    });
    
  }

  get f() { return this.BillInsertForm.controls; }

  // getOrders() {
  //   let status = [];
  //   if (this.filterStatus.length) {
  //     this.filterStatus.forEach(element => {
  //       status.push(element.StatusId)
  //     });
  //   }
  //   this.dataService.setSelectedStatusInLocalStorage(this.filterStatus);
  //   const data = {
  //     count: this.Count || 500,
  //     customer_id: '0',
  //     status: status
  //   }
  //   this.OrderService.getMostRecentOrdersByCount(data).subscribe(res => {
  //     if (res['status'] == 200) {
  //       this.orderListOriginal = res['data'];
  //       this.orderList = res['data'];
  //       this.pendingAmountForUser = 0;
  //       if (this.SelectedUsersArr.length) {
  //         this.filterOrdersbyCustomer();
  //       }
  //     }
  //   });
  // }



  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.BillInsertForm.get('image').setValue(file);
    }
  }

  deleteBillsbyId(bill) {
    console.log(12,bill);
    if (confirm('Do you want to delete this?')) {
      this.BillingSaasService.deleteBillsById(bill.Bill_id).subscribe(res => {
        if (res['status'] == 200) {
          this.toastr.success(res['message']);
          this.getbills();
        }
      })
    }


  }
  getbills(event = '') {
    event = event ? event : this.datepipe.transform(this.billsFromDate, 'yyyy-MM-dd')
    let splitEvent = event.split('-')
    let joinedEvent = splitEvent.join('')
    console.log('ae',joinedEvent)
    const params = {
      SearchString: this.searchString,
      count: '100',
      date: joinedEvent
    }
    this.BillingSaasService.getBills(params).subscribe(a => {
      this.billList = a.data;
      console.log(11,this.billList)
      this.filteredBillList = a;
    })
  }

  OnclickDownload(image) {
    window.open(image);
  }
  onSubmit() {
    this.submitted = true;

    if (this.BillInsertForm.invalid) {
      return;
    }
    // this.globalService.show();
    let BillInsertFormRaw = this.BillInsertForm.getRawValue()
    const formData = new FormData();
    formData.append('Mobile', BillInsertFormRaw['Mobile']);
    formData.append('Description', BillInsertFormRaw['Description']);
    formData.append('IsActive', BillInsertFormRaw['IsActive']);
    formData.append('SellerDetail', BillInsertFormRaw['SellerDetail']);
    formData.append('WarrantyInDays', BillInsertFormRaw['WarrantyInDays']);
    formData.append('image', BillInsertFormRaw['image']);
    this.BillingSaasService.createBill(formData)
      .subscribe(res => {
        this.globalService.hide();
        if (res['status'] == 200) {
          this.toastr.success('Bill Inserted Successfully!');
          this.getbills();
          this.BillingSaasService.notifyCustomer(this.user['name'], BillInsertFormRaw['Description'], BillInsertFormRaw['Mobile'],
            BillInsertFormRaw['WarrantyInDays'], res['data']['Location']);
        } else {
          this.toastr.warning('Error!', res['data']);
        }

      })
 
    console.log(this.BillInsertForm.value);
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
    this.searchModelChangeSubscription.unsubscribe();
    this.searchModelChangeSubscription.unsubscribe();
  }
}
function convertToDateTime(billsFromDate: any, arg1: string) {
  throw new Error('Function not implemented.');
}

