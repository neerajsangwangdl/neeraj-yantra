import { Component, OnInit, Input } from '@angular/core';
import { Paging } from 'src/app/models/paging';
import { Category } from 'src/app/models/Category';
import { ProductSubCategory } from 'src/app/models/ProductSubCategory';
import { Department } from 'src/app/models/department';
import { CategoryService } from 'src/app/services/Category/category.service';
import { DepartmentService } from 'src/app/services/Department/department.service';
import { ProductListComponent } from '../product-list/product-list.component';
import { DataService } from 'src/app/services/Shared/data.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  departmentList: Department[] = [];
  categoryList: any = [];
  Subcategory: any = '';
  searchText: string;
  filteredCategoryList: Category[] = [];
  filteredSubCategoryList: ProductSubCategory[] = [];
  selectedDepartment: number;
  selectedCategory: number;
  searchString: string = '';
  searchForAllWords: boolean = true;
  subCategoryList: ProductSubCategory[];
  selectedSubCategory: any = 0;


  @Input() productList: ProductListComponent;
  sortedItems = ['Link 1', 'Link 2', 'Link 3', 'Link 4'];
  searchValue: string = '';
  user: any;
  public searchModelChanged: Subject<string> = new Subject<string>();
  public searchModelChangeSubscription: Subscription

  filterItems() {
    return this.filteredSubCategoryList.filter(el => el.Name.indexOf(this.searchValue) != -1);
  }
  constructor(private departmentService: DepartmentService,
    private dataService: DataService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.user = this.dataService.getUserFromLocalStorage();
    // this.getCategoryList();
    this.getSubCategoryList()
    this.selectedDepartment = 0;
    this.selectedCategory = 0;
    this.selectedSubCategory = 0;
    this.searchForAllWords = true;
    // this.getDepartmenstList();
    this.searchModelChangeSubscription = this.searchModelChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(newText => {
        console.log(newText);
        this.onClickSearch();

      });
  }



  getDepartmenstList() {
    this.departmentService.getDepartments().subscribe(parameter => {
      this.getCategoriesByDepartmentId();
      this.departmentList = parameter as Department[];
      let allDep: Department = new Department();
      allDep.DepartmentId = 0;
      allDep.Name = 'All Departments';
      this.departmentList.push(allDep);
    });
  }

  getCategoryList() {
    this.categoryService.getCategories().subscribe(a => {
      this.categoryList = a;
      this.filteredCategoryList = a;
    })
  }

  getSubCategoryList() {
    this.categoryService.getSubCategories().subscribe(a => {
      this.filteredSubCategoryList = a as ProductSubCategory[];
    })
  }

  getCategoriesByDepartmentId() {
    if (this.selectedDepartment) {
      this.filteredCategoryList = this.categoryList.filter(a => a.DepartmentId == this.selectedDepartment);
    } else {
      this.filteredCategoryList = this.categoryList;
    }
  }

  onSelectDepartment(department) {
    this.selectedDepartment = department.DepartmentId;
    this.selectedCategory = 0;
    this.getCategoriesByDepartmentId();
    let filter: Paging = new Paging();
    filter.DepartmentId = this.selectedDepartment;
    const filteredDep = this.departmentList.filter(a => a.DepartmentId == this.selectedDepartment)
    filter.DepartmentName = filteredDep.length ? filteredDep[0].Name : '';
    filter.CategoryId = this.selectedCategory;
    filter.CategoryName = (this.selectedCategory == 0) ? '' : this.categoryList.filter(a => a.DepartmentId == this.selectedCategory)[0].Name;
    filter.SearchString = this.searchString ? this.searchString.trim() : '';
    filter.IsAllWords = true;
    this.productList.CURRENT_PAGE = 1;
    this.productList.filter = filter;
    this.productList.setFilterTriggered = true;
    this.productList.setFilters(true);
  }

  onSelectCategory(category) {
    this.selectedCategory = category.CategoryId;
    let filter: Paging = new Paging();
    filter.DepartmentId = this.selectedDepartment;
    filter.DepartmentName = this.departmentList.filter(a => a.DepartmentId == this.selectedDepartment)[0].Name;
    filter.CategoryId = this.selectedCategory;
    filter.SubCategoryId = this.selectedSubCategory;
    filter.CategoryName = (this.selectedCategory == 0) ? '' : this.categoryList.filter(a => a.DepartmentId == this.selectedCategory)[0].Name;
    filter.SearchString = this.searchString ? this.searchString.trim() : '';
    filter.IsAllWords = true;
    this.productList.CURRENT_PAGE = 1;
    this.productList.filter = filter;
    this.productList.setFilterTriggered = true;
    this.productList.setFilters(true);
  }

  onSelectSubCategory(subcategory) {
    this.selectedSubCategory = subcategory.SubcategoryId;
    let filter: Paging = new Paging();
    filter.DepartmentId = this.selectedDepartment;
    filter.DepartmentName = this.departmentList && this.departmentList.length ? this.departmentList.filter(a => a.DepartmentId == this.selectedDepartment)[0].Name : '';
    filter.CategoryId = this.selectedCategory;
    filter.SubCategoryId = this.selectedSubCategory;
    filter.CategoryName = (this.selectedCategory == 0) ? '' : this.categoryList.filter(a => a.DepartmentId == this.selectedCategory)[0].Name;
    filter.SearchString = this.searchString ? this.searchString.trim() : '';
    filter.IsAllWords = true;
    this.productList.CURRENT_PAGE = 1;
    this.productList.filter = filter;
    this.productList.setFilterTriggered = true;
    this.productList.setFilters(true);
  }

  onClickSearch() {
    let filter: Paging = new Paging();
    // filter.DepartmentId = this.selectedDepartment;
    // filter.DepartmentName = this.departmentList.filter(a => a.DepartmentId == this.selectedDepartment)[0].Name;
    // filter.CategoryId = this.selectedCategory;
    // filter.SubCategoryId = this.selectedSubCategory;
    // filter.CategoryName = (this.selectedCategory == 0)? '' : this.categoryList.filter(a => a.DepartmentId == this.selectedCategory)[0].Name;
    // filter.SearchString = this.searchString ? this.searchString.trim() : '';
    // filter.IsAllWords = true;
    this.selectedDepartment = 0
    this.selectedSubCategory = 0
    this.selectedCategory = 0
    filter.DepartmentId = 0;
    filter.DepartmentName = '';
    filter.CategoryId = 0;
    filter.SubCategoryId = 0;
    filter.CategoryName = '';
    filter.SearchString = this.searchString ? this.searchString.trim() : '';
    filter.IsAllWords = true;
    this.productList.CURRENT_PAGE = 1;
    this.productList.filter = filter;
    this.productList.setFilterTriggered = true;
    this.productList.setFilters(true);
  }
  clearSearch() {
    this.searchString = '';
    this.onClickSearch();
  }


}
