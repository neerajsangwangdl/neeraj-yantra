import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  customerInfor: any = {};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.customerInfor = this.dataService.getUserFromLocalStorage();
  }

}
