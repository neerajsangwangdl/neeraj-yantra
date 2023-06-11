import { Component, OnDestroy, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { empty, Subject, Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TargetService } from '../target.service';
import { MasterService } from 'src/app/services/master.service';
import { __values } from 'tslib';
import { ProductService } from 'src/app/services/Product/product.service';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';

@Component({
  selector: 'app-target-insert',
  templateUrl: './target-insert.component.html',
  styleUrls: ['./target-insert.component.scss']
})
export class TargetInsertComponent implements OnInit, OnDestroy {
  
  Count: any = 1000;
  SelectedUsersArr: any = [];
  selectProduct: any;
  selectedUsers = [];
  flagSwitch = true;
  flagProduct = true;
  customerList: any[] = [];
  selectedProductArr: any = [];
  productList: any;
  productId: any = [];
  product: any;
  PRODUCT_COUNT: any;
  addNew: number;
  customer: Customer = new Customer();
  TargetInsertForm: FormGroup;
  loading = false;
  submitted = false;
  user: any;
  status: any;
  searchString: any = '';
  public searchText: string;
  public BillSearchModelChanged: Subject<string> = new Subject<string>();
  // public searchModelChangeSubscription: Subscription


  customerListdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    limitSelection: 1,
    allowSearchFilter: true,
  };

  productListDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'ProductId',
    textField: 'Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    maxHeight: 100,
    itemsShowLimit: 1,
    limitSelection: 1,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'Product List not Available'
  };

  constructor(
    private targetService: TargetService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastrService,
    public globalService: GlobalService,
    private masterService: MasterService) {
  }


  ngOnInit() {

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['id']) {
        this.productId = queryParams['id'];
      }
      if (queryParams['addNew']) {
        this.addNew = parseInt(queryParams['addNew']);
      }
    })
    
    this.searchCustomer();
    this.searchProduct();
    this.user = this.dataService.getUserFromLocalStorage();
    this.buildForm()
    
  }


  buildForm() {
    this.TargetInsertForm = this.formBuilder.group({
      ForCustomerIds: [''],
      PartnerId: [this.user.customer_id],
      product_units: ['', !this.flagProduct ? [Validators.required, Validators.min(1)] : null],
      target_money: ['', this.flagProduct ? [Validators.required, Validators.min(1)] : null],
      target_name: ['', [Validators.required, Validators.maxLength(50)]],
      target_type:[''],
      target_prize: ['', [Validators.required,]],
      target_time_in_days: [30, [Validators.required]],
      target_description: [''],
    });
  }

  get f() { return this.TargetInsertForm.controls; }


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


  // ------for get Product id from Product list dropdown--------------------

  onSelectProduct(event) {
    this.productId=event.ProductId;
    this.TargetInsertForm.value.ProductId =  this.productId;
  }
  onDeselectProduct() {
    this.flagProduct = true;
  }

  onAllProduct() {
    this.flagProduct = true;
  }

  updateField(event) {
    console.log('event', event);
    this.flagProduct = event
    let target_money_control = this.TargetInsertForm.get('target_money')
    let product_units_control = this.TargetInsertForm.get('product_units')

    if (event) {
      target_money_control.setValidators([Validators.required, Validators.min(1)]);
      product_units_control.setValidators([]);

      target_money_control.updateValueAndValidity();
      product_units_control.updateValueAndValidity();
      
    } else {
      product_units_control.setValidators([Validators.required, Validators.min(1)]);
      target_money_control.setValidators([]);

      product_units_control.updateValueAndValidity();
      target_money_control.updateValueAndValidity();
      
    }
  }
 
  searchProduct() {
    let filterObj: Paging = new Paging();
    filterObj.DepartmentId = 0;
    filterObj.CategoryId = 0;
    filterObj.SubCategoryId = 0;
    filterObj.PageSize = 100;
    filterObj.PageNumber = 0;
    filterObj.CurrentPage = 1;
    filterObj.SearchString = this.searchText;
    let productPagingObj: ProductPaginData = new ProductPaginData();
    this.productService.getProductList(filterObj).subscribe(a => {
      productPagingObj = a.data as ProductPaginData;
      if (productPagingObj.Products) {
        this.productList = productPagingObj.Products.length ? productPagingObj.Products : [{ 'ProductId': 0, 'Name': 'No Data' }];
        this.PRODUCT_COUNT = productPagingObj.ProductCount[0].ProductCount;
      }
    });
  }

  // ------for get customer id from customer list dropdown ------------------

  onSelect(element) {
    let indx = this.SelectedUsersArr.indexOf(element.customer_id);
    if (indx > 0) {
      this.SelectedUsersArr.splice(indx, 1);
    } else {
      this.SelectedUsersArr.push(element.customer_id);
    }
  }

  onSelectAll() {
    this.flagSwitch = true;
  }

  // -----------Form submit--------------------------------
  onSubmit() {
    this.submitted = true;
    if (this.TargetInsertForm.invalid) {
      return;
    }
    
    // agar for all users ki state hai
    if (!this.flagSwitch) {
      if (this.SelectedUsersArr.length) {
        this.TargetInsertForm.value.ForCustomerIds = this.SelectedUsersArr;
       
      } else {
        alert('Apne koi User Select nahi kiya hai');
        return;
      }
    }
    else if (this.flagSwitch) {
      this.TargetInsertForm.value.ForCustomerIds = [0];
      this.TargetInsertForm.value.target_type =2;
    }
    // -------for product select----------------

    if (!this.flagProduct) {
      this.TargetInsertForm.value.product_units = parseInt(this.TargetInsertForm.value.product_units);
      this.TargetInsertForm.value.target_money = 0;
      this.TargetInsertForm.value.target_type =1;
      if (this.productId) {
        this.TargetInsertForm.value.ProductId = this.productId;

      } else {
        alert('Aapne koi Product select nahi kiya hai');
        return;
      }
    } else if (this.flagProduct) {
      this.TargetInsertForm.value.ProductId = 0;
      this.TargetInsertForm.value.target_money = parseInt(this.TargetInsertForm.value.target_money);
      this.TargetInsertForm.value.product_units = 0; 
      this.TargetInsertForm.value.target_type =2; 
    }

    
    // this.TargetInsertForm.value.target_description = '';
    
    // console.log(this.TargetInsertForm.value);
    this.targetService.createTarget(this.TargetInsertForm.value)
      .subscribe(res => {
        this.globalService.hide();
        if (res['status'] == 200) {
          this.toastr.success(res['message']);
        } else {
          this.toastr.warning('Error!', res['data']);
        }
      })
  }


  ngOnDestroy() {
    // this.searchModelChangeSubscription.unsubscribe();
    // this.searchModelChangeSubscription.unsubscribe();
  }
}
