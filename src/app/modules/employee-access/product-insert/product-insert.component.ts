import { Component, OnDestroy, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/Shared/data.service';
import { ProductService } from 'src/app/services/Product/product.service';
import { CategoryService } from 'src/app/services/Category/category.service';
import { ProductSubCategory } from 'src/app/models/ProductSubCategory';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { Product } from 'src/app/models/product';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';
import { Options } from 'html2canvas';
@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.scss']
})
export class ProductInsertComponent implements OnInit, OnDestroy {
  productListDropdownSettings = {
    singleSelection: false,
    idField: 'ProductId',
    textField: 'Name',
    limitSelection: 1,
    closeDropDownOnSelection: true,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Data Available'
  };
  SelectedProduct: any;
  customer: Customer = new Customer();
  public ProductInsertForm: FormGroup;
  loading = false;
  submitted = false;
  refId: any;
  totalNewAmount: any;
  user: any;
  categoryList: any;
  filteredCategoryList: any;
  filteredSubCategoryList: any[];
  customerList: any[];
  productId: any;
  product: any;
  searchString: any = '';
  productList: any;
  PRODUCT_COUNT: any;
  public searchText: string;
  public searchModelChanged: Subject<any> = new Subject<any>();
  public searchModelChangeSubscription: Subscription
  newstockProducts: any;
  totalNewStock: any;
  addNew: number;
  productIds: any = [];
  currentUserId: any = 0;
  options: {
    maxSizeMB: number,
    onProgress: Function,
    useWebWorker: boolean,
    signal: AbortSignal,
  }

  constructor(
    private formBuilder: FormBuilder,
    private ProductService: ProductService,
    private checkoutService: CheckoutService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router,
    public GlobalHttpService: GlobalHttpService,
    public globalService: GlobalService) {
    // imageCompression(file: File, options: Options): Promise<File>
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['id']) {
        this.productId = queryParams['id'];
        this.getProductDetailsById();
      }
      if (queryParams['addNew']) {
        this.addNew = parseInt(queryParams['addNew']);
      }
    })
    this.getNewStockProducts();
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        this.searchText = newText.trim();
        console.log(newText);
        this.searchProduct();
      });
    this.searchProduct();
    this.getCategoryList();
    this.getSubCategoryList();
    this.searchCustomer();
    this.user = this.dataService.getUserFromLocalStorage();
    this.currentUserId = parseInt(this.user.customer_id)
    console.log(this.user);
    this.buildForm()

  }
  buildForm() {
    this.ProductInsertForm = this.formBuilder.group({
      name: ['', Validators.required],
      // alternate_name: ['', Validators.required],
      videolink: [''],
      CanSeeRole: ['10', [Validators.required, Validators.min(1), Validators.max(10)]],
      CategoryId: ['1', Validators.required],
      DepartmentId: ['1', Validators.required],
      description: ['', Validators.required],
      DiscountPercentage: ['0', [Validators.min(0), Validators.max(10)]],
      DisplayPriority: ['20', [Validators.required, Validators.min(1)]],
      stock: ['', !this.addNew ? [Validators.required, Validators.min(0)] : Validators.min(1)],
      newstock: ['', this.addNew ? [Validators.required, Validators.min(1)] : Validators.min(1)],
      IsActive: ['1', Validators.required],
      dhc_category: ['0', Validators.required],
      max_quantity: ['100', [Validators.required, Validators.min(1), Validators.max(1000)]],
      min_quantity: ['1', [Validators.required, Validators.min(1), Validators.max(1000)]],
      // ModelName: ['', Validators.required],
      price: ['1', !this.addNew ? [Validators.required, Validators.min(1)] : Validators.min(1)],
      landing_rate: ['', [Validators.min(1)]],
      newprice: ['', this.addNew ? [Validators.required, Validators.min(1)] : Validators.min(1)],
      // product_code: ['', Validators.required],
      // SellerDetail: [15, Validators.required],
      SubCategoryId: ['', Validators.required],
      Tags: [''],
      WarrantyInDays: ['90', [Validators.required, Validators.min(0)]],
      ImageWidth: ['600', !this.productId ? Validators.required : null],
      ImageHeight: ['auto', !this.productId ? Validators.required : null],
      image: [null, !this.productId ? Validators.required : null],
    });
    if (this.addNew) {
      this.ProductInsertForm.controls['price'].disable()
      this.ProductInsertForm.controls['stock'].disable()
    } else {
      this.ProductInsertForm.controls['newprice'].disable()
      this.ProductInsertForm.controls['newstock'].disable()
    }
  }



  get f() { return this.ProductInsertForm.controls; }

  getCategoryList() {
    this.categoryService.getCategories().subscribe(a => {
      this.categoryList = a;
      this.filteredCategoryList = a;
    })
  }

  onProductSelect(event) {
    console.log(event)
    this.productId = event.ProductId
    this.getProductDetailsById();
  }

  getProductDetailsById() {
    this.productService.getProductDetailsById(this.productId)
      .subscribe(p => {
        this.product = p;
        this.patchProductForm()
      })
  }
  getNewStockProducts() {
    this.productService.getNewStockProducts(this.productId)
      .subscribe(p => {
        this.newstockProducts = p;
        this.totalNewStock = this.globalService.getTotalOfColumn(p, 'newstock') || 0
      })
  }


  onFileSelect(event) {
    console.log(event)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(121, file)
      this.ProductInsertForm.get('image').setValue(file);
    }
  }


  handleImageUpload(event) {

    var imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    var options = {
      maxSizeMB: 0.1,
      useWebWorker: true
    }
    let that =  this
    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024 / 1000} MB`); // smaller than maxSizeMB
        console.log(compressedFile);
        that.ProductInsertForm.get('image').setValue(compressedFile)
        return compressedFile; // write your own logic
        
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  patchInventoryProductForm(p) {
    this.product = p;
    this.patchProductForm();
  }
  patchProductForm() {
    this.productId = this.product['ProductId']
    this.buildForm();
    this.ProductInsertForm.patchValue({
      name: this.product['Name'] || '',
      // alternate_name: this.product['alternate_name'] || this.product['Name'].split("").reverse().join(""),
      CanSeeRole: this.product['CanSeeRole'] || '',
      CategoryId: this.product['CategoryId'] || '',
      DepartmentId: this.product['DepartmentId'] || '',
      description: this.product['Description'] || '',
      DiscountPercentage: this.product['DiscountPercentage'] || '0',
      DisplayPriority: this.product['DisplayPriority'] || '',
      stock: this.product['stock'],
      newstock: this.product['newstock'],
      IsActive: this.product['IsActive'],
      dhc_category: this.product['dhc_category'],
      max_quantity: this.product['max_quantity'] || '',
      min_quantity: this.product['min_quantity'] || '',
      // ModelName: this.product['ModelName'] || '',
      price: this.product['Price'],
      landing_rate: this.product['landing_rate'],
      newprice: this.product['newprice'] || this.product['newprice'],
      // product_code: this.product['product_code'] || 'no code',
      SellerDetail: parseInt(this.product['SellerDetail']) || 15,
      SubCategoryId: this.product['SubCategoryId'] || '',
      Tags: this.product['Tags'] || this.product['Name'],
      WarrantyInDays: this.product['WarrantyInDays'] || '0',
      videolink: this.product['videolink'] || '',
    });
  }

  deleteInventory(product_id) {
    if (confirm('Remove this product from this Inventory?')) {
      this.productService.deleteInventory(product_id)
        .subscribe(res => {
          if (res && res['status'] == 200) {
            this.toastr.success('UnApplied Inventory deleted Successfully!');
          } else {
            this.toastr.warning('Error!', res);
          }
          this.getNewStockProducts();
        })
    }

  }

  applyInventory() {
    if (!this.newstockProducts || !this.newstockProducts.length) return
    this.newstockProducts.forEach(element => {
      this.productIds.push(element.ProductId)
    });
    console.log(this.productIds)
    const data = { product_ids: this.productIds }
    this.productService.applyInventory(data)
      .subscribe(p => {
        if (p) {
          this.toastr.success('Inventory updated Successfully!');
        } else {
          this.toastr.warning('Error!', p);
        }
        this.getNewStockProducts();
      })
  }

  searchCustomer() {
    const data = {
      SearchString: ''
    }
    this.customerList = [];
    this.checkoutService.SearchCustomer(data)
      .subscribe(res => {
        if (res['status'] == 200) {
          this.customerList = res['data'];
        } else {
          // this.toastr.warning('Error!', res['message']);
        }
      })
  }
  onProductSearchFilterChange(event) {
    this.searchText = event;
    this.searchProduct();
  }
  searchProduct() {
    let filterObj: Paging = new Paging();
    filterObj.DepartmentId = 0;
    filterObj.CategoryId = 0;
    filterObj.SubCategoryId = 0;
    filterObj.PageSize = 100;
    filterObj.ReceivedCount = 0;
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

  getSubCategoryList() {
    this.categoryService.getSubCategories().subscribe(a => {
      this.filteredSubCategoryList = a as ProductSubCategory[];
    })
  }
  onSubmit() {
    this.submitted = true;

    if (this.ProductInsertForm.invalid) {
      return;
    }
    // this.globalService.show();
    let ProductInsertFormRaw = this.ProductInsertForm.getRawValue()
    ProductInsertFormRaw['DisplayPriority'] = environment.production ? ProductInsertFormRaw['DisplayPriority'] : '1';
    const formData = new FormData();
    formData.append('name', ProductInsertFormRaw['name']);
    formData.append('videolink', ProductInsertFormRaw['videolink']);
    formData.append('CanSeeRole', ProductInsertFormRaw['CanSeeRole']);
    formData.append('CategoryId', ProductInsertFormRaw['CategoryId']);
    formData.append('DepartmentId', ProductInsertFormRaw['DepartmentId']);
    formData.append('description', ProductInsertFormRaw['description']);
    formData.append('DiscountPercentage', ProductInsertFormRaw['DiscountPercentage']);
    formData.append('DisplayPriority', ProductInsertFormRaw['DisplayPriority']);
    formData.append('stock', ProductInsertFormRaw['stock']);
    formData.append('newstock', ProductInsertFormRaw['newstock']);
    formData.append('IsActive', ProductInsertFormRaw['IsActive']);
    formData.append('max_quantity', ProductInsertFormRaw['max_quantity']);
    formData.append('min_quantity', ProductInsertFormRaw['min_quantity']);
    formData.append('price', ProductInsertFormRaw['price']);
    formData.append('landing_rate', ProductInsertFormRaw['landing_rate']);
    formData.append('newprice', ProductInsertFormRaw['newprice']);
    // formData.append('product_code', ProductInsertFormRaw['product_code']);
    // formData.append('SellerDetail', this.user.customer_id);
    formData.append('SubCategoryId', ProductInsertFormRaw['SubCategoryId']);
    formData.append('Tags', ProductInsertFormRaw['Tags']);
    formData.append('WarrantyInDays', ProductInsertFormRaw['WarrantyInDays']);
    formData.append('ImageWidth', ProductInsertFormRaw['ImageWidth']);
    formData.append('ImageHeight', ProductInsertFormRaw['ImageHeight']);
    formData.append('image', ProductInsertFormRaw['image']);
    formData.append('dhc_category', ProductInsertFormRaw['dhc_category']);
    formData.append('alternate_name', ProductInsertFormRaw['name']);
    formData.append('SellerDetail', this.currentUserId);
    formData.append('ModelName', ProductInsertFormRaw['name']);
    formData.append('product_code', ProductInsertFormRaw['name']);
    if (this.productId) {
      let data = {};
      ProductInsertFormRaw.alternate_name = ProductInsertFormRaw.name;
      ProductInsertFormRaw.SellerDetail = this.currentUserId;
      ProductInsertFormRaw.ModelName = ProductInsertFormRaw.name;
      ProductInsertFormRaw.product_code = ProductInsertFormRaw.name;
      if (this.ProductInsertForm.value.image) {
        formData.append('product_id', this.productId);
        data = formData
      } else {
        delete ProductInsertFormRaw['image']
        ProductInsertFormRaw['product_id'] = this.productId;
        data = ProductInsertFormRaw;
      }
      this.updateProduct(data);
    } else {
      this.ProductService.createProduct(formData)
        .subscribe(res => {
          this.globalService.hide();
          this.getNewStockProducts()
          if (res['status'] == 200) {
            this.toastr.success('Product Inserted Successfully!');
          } else {
            this.toastr.warning('Error!', res['message']);
          }
        })
    }
    console.log(this.ProductInsertForm.value);
  }
  updateNewInventory(product) {
    let newStock = parseInt(window.prompt('Kitne or peice badhane hai? (type digits only)'));
    if (isNaN(newStock)) return alert('bhai sirf digit daalo');
    let total = product.newstock + newStock;
    if (confirm(product.name + ' ka new stock ' + product.newstock + ' + ' + newStock + ' = ' + total + ' kr dun ?')) {
      product.newstock = total;
      this.product = product
      this.patchProductForm();
      this.onSubmit();
    }
  }
  updateProduct(data) {
    this.ProductService.updateProduct(data)
      .subscribe(res => {
        this.globalService.hide();
        this.getNewStockProducts();
        if (res['status'] == 200) {
          this.toastr.success('Product updated Successfully!');
        } else {
          this.toastr.warning('Error!', res['message']);
        }
      })
  }
  ngOnDestroy() {
    this.searchModelChangeSubscription.unsubscribe();
  }
}
