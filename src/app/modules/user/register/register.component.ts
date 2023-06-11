import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import jspdf from 'jspdf';
import { CustomerService } from '../customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { DistributersList } from './distributerslist';
import { GlobalService } from 'src/app/services/Shared/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  distributersListDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    limitSelection: 1,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  };
  customer: Customer = new Customer();
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  flagSwitch = true;
  customersList: any[];
  distributersList: any[];
  Selecteddistributers: any;
  refId: any;
  user: any;
  filteredDistributersList: DistributersList[];
  partnerId: any;
  OnloadpartnerId: any;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.refId = params['refId'] || 0;
      this.partnerId = params['partnerId'];
      this.OnloadpartnerId = this.partnerId ? true : false;
    })
  }

  ngOnInit() {
    this.user = this.dataService.getUserFromLocalStorage();
    if (!this.partnerId && this.user['customer_id']) {
      this.partnerId = this.user.Role == 6 ? this.user.customer_id : this.user.Role > 6 ? this.user.PartnerId : 15;
    }
    this.getDistributersList();
    this.customer.RegionId = 1;
    this.registerForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      AddressOne: ['', Validators.required],
      AddressTwo: ['', null],
      Role:[''],
      Town: ['', null],
      Country: ['', null],
      RegionId: ['2', null],
      ZipCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      Mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      CreditCard: ['', null],
      LastName: ['', null],
      Email: ['', null],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      PartnerId: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  onDistributerSelect(event) {
    console.log(event)
    this.partnerId = event.customer_id
  }

  onDistributerDeSelect(event) {
    console.log(event)
      this.partnerId= 0;
  }
  getDistributersList() {
    this.customerService.getDistributersList().subscribe(res => {
      this.distributersList = res['data'] as DistributersList[];
      if (this.partnerId) {
        this.Selecteddistributers = this.globalService.ngMultiSelectModelData(this.distributersList, 'customer_id', 'name', this.partnerId)
      }
    })
  }
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    if (this.partnerId) {
      this.registerForm.value['PartnerId'] = this.partnerId;
      this.registerForm.value['Role'] = 10;
    } else if (this.flagSwitch) {
      this.registerForm.value['PartnerId'] =this.partnerId;
      this.registerForm.value['Role'] = 6;
    } else if(!this.partnerId && !this.flagSwitch){
      return alert('Please select a distributer from distributer list.')
    }
    this.customer = this.registerForm.value;
    this.customer['RefId'] = this.refId;
    this.customerService.AddNewCustomer(this.customer).subscribe(res => {
        if (res['status'] == 200) {
          this.toastr.success('Congratulations!', 'Registered Successfully!');
          if (!this.user || !this.user['Role'] || this.user['Role'] > 8) {
            this.toastr.success('Hi!', 'Welcome to ApniDukan!');
            this.dataService.setUserInLocalStorage(res['data']);
          }
          this.router.navigate(['/products']);
        } else {
          this.toastr.warning('Error!', res['message']);
        }
      })
    console.log(this.registerForm.value);
  }

}
