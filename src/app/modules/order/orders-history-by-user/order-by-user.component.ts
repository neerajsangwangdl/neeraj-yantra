import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { MasterService } from 'src/app/services/master.service';
import { OrderService } from 'src/app/services/order.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
@Component({
  selector: 'app-order-by-user',
  templateUrl: './order-by-user.component.html',
  styleUrls: ['./order-by-user.component.scss']
})
export class OrderByUserComponent implements OnInit {
  user: any;
  orderList: any = [];
  orderListOriginal: any;
  previousHtml: any;
  status: any;
  showItems: any = {};
  constructor(private orderService: OrderService,
    private dataService: DataService,
    public globalService: GlobalService,
    private MasterService: MasterService) { }
  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();
    this.getProducts();
    this.getStatusMaster();
  }

  getProducts() {
    this.orderService.getorderByCustomerId(this.user.customer_id).subscribe(res => {
      this.orderListOriginal = res['data'];
      this.orderList = res['data'];
    });
  }

  getStatusMaster(){
    this.MasterService.getStatusMaster().subscribe(res => {
      if (res['status'] && res['status'] == 200) {
        this.status = res['data'];
      }
    });
  }
  
  filterOrder(e: Event) {
    let str = (e.target as HTMLButtonElement).value;
      this.orderList = this.orderListOriginal;
      if(str.length) {
      this.orderList = this.globalService.filterByValue(this.orderList, str);
    } else {
      this.orderList = this.orderListOriginal;
    }
    // this.orderList.filter(o => Object.keys(o).some(k => o[k] && o[k].toString().toLowerCase().includes(str.toLowerCase())))
    console.log(this.orderList)
  }

}