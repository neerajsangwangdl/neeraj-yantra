import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/modules/user/customer.service';
import { MasterService } from 'src/app/services/master.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  customerListDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    limitSelection: 1,
    closeDropDownOnSelection: true,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Data Available'
  };

  public searchText: string;
  public searchModelChanged: Subject<any> = new Subject<any>();
  public searchModelChangeSubscription: Subscription
  customerList: any[];
  OnLoadFlag: any;
  submitted = false;
  SelectedUser: any;
  customerId: any;
  customerIds:any=[];
  addNew: number;
  customer: any;
  userUpdateForm: FormGroup;

  constructor(
    private MasterService: MasterService,
    private customerService: CustomerService,
    private formBilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private globalService: GlobalService,
  ) { }


  ngOnInit() {
    // this.route.queryParams.subscribe(queryParams => {
    //   if (queryParams['id']) {
    //     this.customerId = queryParams['id'];
    //     this.getCustomerById();
    //   }
    //   if (queryParams['addNew']) {
    //     this.addNew = parseInt(queryParams['addNew']);
    //   }
    // });

    
    this.searchCustomer();
    // this.searchModelChangeSubscription = this.searchModelChanged
    //   .pipe(
    //     debounceTime(800),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(text => {
    //     this.searchText = text;
    //     this.searchCustomer();
    //   });
    this.updateForm();
  }

  updateForm() {
    this.userUpdateForm = this.formBilder.group({
      name: ['', [Validators.required]],
      address_1: ['', [Validators.required]],
      IsActive: ['', [Validators.required]],
      Role: ['', [Validators.required]],
      partner_name: ['', [Validators.required]],

    })
  }


  get f() { return this.userUpdateForm.controls; }

  onCustomerSelect(event) {
    this.customerId = event.customer_id
    this.getCustomerById();
    console.log(this.customerId);
  }

  getCustomerById() {
    this.customerService.getCustomerById(this.customerId)
      .subscribe(p => {
        this.customer = p['data'];
        console.log(this.customer);
        this.patchUserForm()
      })
  }

  
  patchUserForm() {
    
    this.userUpdateForm.patchValue({
      name: this.customer['name'],
      address_1: this.customer['customer_id'],
      IsActive: this.customer['IsActive'],
      Role: this.customer['Role'],
      partner_name: this.customer['partner_name'],
      
    })
  }

  
  searchCustomer() {
    const data = {
      SearchString: this.searchText || '',
      CustomerRole: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    this.customerList = [];
    this.MasterService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          this.customerList = res['data'];
        }
      })
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.userUpdateForm.value);

    // let userUpdateFormRaw = this.userUpdateForm.getRawValue()
    // userUpdateFormRaw['DisplayPriority'] = environment.production ? userUpdateFormRaw['DisplayPriority'] : '1';
    // const formData = new FormData();

    // formData.append('name', userUpdateFormRaw['name']);
    // formData.append('address_1', userUpdateFormRaw['address_1']);
    // formData.append('IsActive', userUpdateFormRaw['IsActive']);
    // formData.append('Role', userUpdateFormRaw['Role']);
    // formData.append('partner_name', userUpdateFormRaw['partner_name']);

    // There is some errors in post after update.
    // post field not match or something

    this.customerService.updateCustomer(this.userUpdateForm.value)
      .subscribe(res => {
        this.globalService.hide();
        this.customerId;
        if (res['status'] == 200) {
          this.toastr.success(res['message']);
        } else {
          this.toastr.warning('Error!', res['data']);
        }
      })
  }

  
  ngOnDestroy() {
    this.searchModelChangeSubscription.unsubscribe();
  }

}
