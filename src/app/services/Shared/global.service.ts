import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  allowedStatus: any = [5]; // for pending payment calculation
  nonCancelledStatus: any = [1, 2, 5, 6, 7]; // for pending payment calculation
  user: any;
  constructor(
    private datepipe: DatePipe,
    private dataService: DataService,
  ) {
    this.user = this.dataService.getUserFromLocalStorage()
  }

  isLoading = new Subject<boolean>();
  show() {
    this.isLoading.next(true);
  }
  hide() {
    this.isLoading.next(false);
  }

  filterByValue(array, string) {
    return array.filter(o =>
      Object.keys(o).some(k => o[k] && o[k].toString().includes(string.toLowerCase())));
  }
  WarrantyValidator(Warranty, CreatedOn) {
    let today = new Date();
    let expirationDate = new Date(CreatedOn);
    expirationDate.setDate(expirationDate.getDate() + Warranty);
    if (expirationDate > today) {
      return true
    } else {
      return false
    }
  }

  filterCustomerAndEmployeesbyRole(data, role = []) {
    const custArr = []
    const empArr = []
    for (const Obj of data) {
      if (Obj.Role) {
        if (Obj.Role == 10) {
          custArr.push(Obj)

        } else {
          empArr.push(Obj)
        }
      }
    }
    return [custArr, empArr]
  }


  getTotalOfColumn(arr, key) {
    let total = 0;
    if (arr && arr.length) {
      arr.forEach((obj) => {
        total += obj[key] || 0
      });
    }
    return Math.round(total)
  }
  sortByFieldName(arr, field, order) {
    if (order == 'asc') {
      arr.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));;
    } else {
      arr.sort((a, b) => parseFloat(b[field]) - parseFloat(a[field]));;
    }
    return arr
  }
  getArrayofOneColumnOfArrOfObj(arrObj, columnName) {
    let arr = [];
    if (arrObj && arrObj.length) {
      arrObj.forEach((obj) => {
        arr.push(obj[columnName])
      });
    }
    return arr
  }

  getTotalOfQtyAndPriceWithColumnName(arr, Qtykey, Pricekey) {
    let total = 0;
    if (arr.length) {
      arr.forEach((obj) => {
        total += obj[Qtykey] * obj[Pricekey] || 0
      });
    }
    return Math.round(total)
  }

  getTotalOfNonCancelledOrderWithDeliveryCharges(arr, Qtykey, Pricekey) {
    let total = 0;
    let delivey_charges_obj = {}
    if (arr.length) {
      arr.forEach((obj) => {
        if (this.nonCancelledStatus.indexOf(obj.item_status) > -1) {
          delivey_charges_obj = obj;
          total += obj[Qtykey] * obj[Pricekey] || 0
          total += obj['od_dh_charges'] || 0
        }
      });
    }
    return Math.round(total)
  }
  ngMultiSelectModelData(data, idField, nameField, selectedIds) {
    const modelData = [];
    if (selectedIds && selectedIds.length) {
      const selectedidsArray = selectedIds.split(',');
      let obj = {}
      for (const element of data) {
        if (selectedidsArray.indexOf(element.customer_id.toString()) > -1) {
          obj[idField] = element.customer_id,
            obj[nameField] = element.name,
            modelData.push(obj)
        }
      }
    }
    return modelData
  }



  getTotalPendingPayments(arr, Qtykey, Pricekey) {
    let total = 0;
    let delivey_charges_obj = {}
    if (arr.length) {
      arr.forEach((obj) => {
        if (this.allowedStatus.indexOf(obj.item_status) > -1) {
          delivey_charges_obj = obj;
          total += obj[Qtykey] * obj[Pricekey] || 0
          total += obj['od_dh_charges'] || 0
        }
      });
      // total += arr[0]['order_dhc'] || 0
    }
    return Math.round(total)
  }

  sendWAppMsgForPendingPayments(customer, name, orders = []) {
    let finalStr = `https://wa.me/+91${customer.mob_phone}/?text=*${name} ji*, %0a%0a`;
    let totalPend = 0
    let i = 1;
    orders.forEach((element) => {
      if (this.allowedStatus.indexOf(element.status) > -1 && customer.customer_id == element.customer_id) {
        let orderPendingAmount = Math.round(this.getTotalOfNonCancelledOrderWithDeliveryCharges(element.OrderDetail, 'units', 'unit_cost') - element.TotalPaid);
        totalPend += orderPendingAmount;
        finalStr += `${i}. Apke ${this.datepipe.transform(element.created_on, 'mediumDate')} ke is Order ki *Rs. ${orderPendingAmount}* payment pending hai. _Check Details *here:*_ https://apnidukan.yantraworld.in/order/order-detail/${element.order_id} %0a%0a`;
        i += 1;
      }
    });
    let totalStr = totalPend ? `Final: Apke *Total Rs. ${totalPend}* payment pending hai. _Check Details *here:*_ https://apnidukan.yantraworld.in/order/history %0a%0a` : '';
    finalStr += totalStr
    if (totalPend) {
      window.open(finalStr);
    } else {
      alert('No pending bills for ' + name);
    }
  }

}
