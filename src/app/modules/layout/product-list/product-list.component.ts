import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { Paging } from 'src/app/models/paging';
import { ProductService } from 'src/app/services/Product/product.service';
import { Product } from 'src/app/models/product';
import { DataService } from 'src/app/services/Shared/data.service';
import { debounceTime, defaultIfEmpty, distinctUntilChanged, isEmpty } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { GlobalHttpService } from 'src/app/services/Shared/global-http.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productList: Product[] = [];
  loading = false;
  departmentName: string;
  categoryName: string;
  searchString: string = '';
  allWords: boolean;
  TOTAL = 0;
  CURRENT_PAGE = 1;
  PER_PAGE = 12;
  PRODUCT_COUNT: number = 0;
  SubCategoryName: any;
  filter: any = {};
  setFilterTriggered: boolean = false;
  sortOrder: any = '';
  @Input('productData') productData=[]
  constructor(private productService: ProductService,
    private DataService: DataService,
    private masterService: MasterService,
    private GlobalHttpService: GlobalHttpService,
    public globalService: GlobalService) {
  }

  optionsSelect: Array<any>;
  ngOnInit() {
    this.optionsSelect = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
    this.getUnreadNotificationsById();
    this.getProducts();
    this.DataService.searchModelChangeSubscription = this.DataService.searchModelChanged
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        this.searchString = newText == 'clear' ? '' : newText;
        this.searchString = this.searchString.length ? this.searchString : '';
        if (this.searchString.trim().length) {
          this.GlobalHttpService.saveanalytics('', 'searched: ' + this.searchString);
        }
        // this.globalService.show();
        this.resetFilters();
      });

  }

  resetFilters() {
    let filter: any = {};
    filter.DepartmentId = 0;
    filter.DepartmentName = '';
    filter.CategoryId = 0;
    filter.SubCategoryId = 0;
    filter.CategoryName = '';
    filter.SearchString = this.searchString ? this.searchString.trim() : '';
    filter.IsAllWords = true;
    this.CURRENT_PAGE = 1;
    this.filter = filter;
    this.filter.orderBy = this.sortOrder ? 'price ' + this.sortOrder : null;
    this.setFilterTriggered = true;
    this.setFilters(true);
  }

  setFilters(isFilterChange = false) {
    this.filter.PageSize = this.PER_PAGE;
    this.filter.ReceivedCount = (this.CURRENT_PAGE - 1) * this.PER_PAGE;
    this.filter.CurrentPage = this.CURRENT_PAGE;
    this.departmentName = this.filter.DepartmentName;
    this.categoryName = this.filter.CategoryName;
    this.SubCategoryName = this.filter.SubCategoryName;
    this.searchString = this.filter.SearchString;
    this.allWords = this.filter.IsAllWords;
    this.filter.orderBy = this.sortOrder ? 'price ' + this.sortOrder : null;
    let productPagingObj: ProductPaginData = new ProductPaginData();
    this.globalService.hide();
    this.productService.getProductList(this.filter).subscribe(res => {
      if (res.status == 200) {
        productPagingObj = res.data as ProductPaginData;
        this.productList = isFilterChange ? productPagingObj.Products : this.productList.concat(productPagingObj.Products);
        this.PRODUCT_COUNT = productPagingObj.ProductCount[0].ProductCount;
      }
    });
  }
  getUnreadNotificationsById(){
    let customerId=this.DataService.user.customer_id
    this.masterService.getunreadNotificationByCustomerId(customerId).subscribe(res => {
      if (res['status'] == 200) {
        this.DataService.unreadNotification.next(res['data']['length'])
         this.DataService.unreadNotificationCount = res['data']['length'];
      }
    });
  }
  getProducts() {
    let filterObj: any= {};
    filterObj.DepartmentId = 0;
    this.departmentName = 'All Departments';
    filterObj.CategoryId = 0;
    filterObj.SubCategoryId = 0;
    filterObj.PageSize = this.PER_PAGE;
    filterObj.ReceivedCount = (this.CURRENT_PAGE - 1) * this.PER_PAGE;
    filterObj.CurrentPage = this.CURRENT_PAGE;
    filterObj.SearchString = this.searchString;
    filterObj.orderBy = this.sortOrder ? 'price ' + this.sortOrder : null;
    let productPagingObj: ProductPaginData = new ProductPaginData();
    this.productService.getProductList(filterObj).subscribe(res => {
      if (res.status == 200) {
        productPagingObj = res.data as ProductPaginData;
        this.productList = !this.productList.length ? productPagingObj.Products : this.productList.concat(productPagingObj.Products);
        this.PRODUCT_COUNT = productPagingObj.ProductCount[0].ProductCount;
      }
    });
  }

  sortBy(ord){
    this.sortOrder = ord;
    this.CURRENT_PAGE = 1;
    this.setFilters(true);
    // this.productList = this.GlobalService.sortByFieldName(this.productList, 'price', this.sortOrder)
  }
  onScroll() {
    // if (this.productList.length >= this.PRODUCT_COUNT) return
    this.CURRENT_PAGE += 1;
    if (!this.setFilterTriggered) { this.getProducts(); } else { this.setFilters() }
  }
  goToPage(n: number): void {
    this.CURRENT_PAGE = n;
    this.getProducts();
  }

  onNext(): void {
    this.CURRENT_PAGE++;
    this.getProducts();
  }

  onPrev(): void {
    this.CURRENT_PAGE--;
    this.getProducts();
  }

}
