import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/Shared/data.service';
import { TargetService } from '../target.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-target-listfor-admin',
  templateUrl: './target-listfor-admin.component.html',
  styleUrls: ['./target-listfor-admin.component.scss']
})
export class TargetListforAdminComponent implements OnInit {

  user:any;
  allTargets:any = [];
  allTargetData:any=[];
  TargetData: any = {
    ForCustomerIds: [],
    PartnerId: '',
  };
  customerList: any[] = [];
  SelectedUser: any;
  wordWrap: any = {};
  searchText:any;
  customerListdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'customer_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    private targetService: TargetService,
    private dataService: DataService,
    private masterService:MasterService) { }

  ngOnInit(): void {

    this.user = this.dataService.getUserFromLocalStorage();
    this.getAllTarget();
    this.searchCustomer();
    this.getTargetListByCustomerIds();
  }

  // to call function from  target service.

  getAllTarget() {
    this.targetService.getAllTarget(this.user.customer_id).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allTargets = res['data'];
      }
    });
  }

  getTargetListByCustomerIds() {
    this.TargetData['PartnerId'] = this.user.customer_id;
    this.targetService.getTargetListByCustomerIdsUnderPartner(this.TargetData).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allTargetData = res['data'];
      }
    });
  }
  wordWrapFunction(id){
    this.wordWrap = {};
    this.wordWrap[id] = 1;
  }

  onCustomerSelect(event) {
    console.log(event);
    let indx = this.TargetData['ForCustomerIds'].indexOf(event.customer_id);
    if (indx > -1) {
      this.TargetData['ForCustomerIds'].splice(indx, 1);
    } else {
      this.TargetData['ForCustomerIds'].push(event.customer_id);
    }
    this.getTargetListByCustomerIds();
  }

  onAllCustomerSelect(event) {
    console.log(event)
    for (let i = 0; i < event.length; i++) {
      let element = event[i]
      let indx = this.TargetData['ForCustomerIds'].indexOf(element.customer_id);
      if (indx > -1) {
        this.TargetData['ForCustomerIds'].splice(indx, 1);
      } else {
        this.TargetData['ForCustomerIds'].push(element.customer_id);
      }
    }
    this.getTargetListByCustomerIds();
  }

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
}
