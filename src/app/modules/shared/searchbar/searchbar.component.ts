import { Component, OnInit, Input } from '@angular/core';
import { Paging } from 'src/app/models/paging';
import { Category } from 'src/app/models/Category';
import { ProductSubCategory } from 'src/app/models/ProductSubCategory';
import { Department } from 'src/app/models/department';
import { CategoryService } from 'src/app/services/Category/category.service';
import { DepartmentService } from 'src/app/services/Department/department.service';
import { ProductListComponent } from '../../layout/product-list/product-list.component';
import { DataService } from 'src/app/services/Shared/data.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
 
  searchString: string = ''; 
 
  user: any;
  public searchModelChanged: Subject<string> = new Subject<string>();
  public searchModelChangeSubscription: Subscription
 
  constructor(private departmentService: DepartmentService,
    public dataService: DataService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.user = this.dataService.getUserFromLocalStorage();
    
  }
  clear(){
    this.dataService.searchString = '';
    this.dataService.searchModelChanged.next('clear')
  }

      


}
