import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { HTML2PDFService } from 'src/app/services/html2pdf.service';
import { MasterService } from 'src/app/services/master.service';
import { OrderService } from 'src/app/services/order.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  user: Customer;
  orderDetail: any = [];
  orderDetailOriginal: any;
  OrderId: void;
  paymentDetail: any = [];
  PaymentTotal: number;
  totalRem: number;
  payLink: string;
  allowedStatus: any = [1, 2, 5]; // for payment
  refreshFlag: boolean;
  status: any;
  bulkStatusArr: any[] = [];
  hideForPdf = true;
  constructor(private orderService: OrderService,
    private dataService: DataService,
    private MasterService: MasterService,
    public globalService: GlobalService,
    private toastr: ToastrService,
    public html2pdfService: HTML2PDFService,
    private OrderService: OrderService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.OrderId = res.id;
    });
  }

  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();
    this.getOrderDetail();
    this.getStatusMaster();
  }

  removeOrderDeliveryCharges() {
    const data = { 'order_id': this.OrderId };
    this.OrderService.removeOrderDeliveryCharges(data).subscribe(res => {
      alert(res['message'])
      this.getOrderDetail();
    });
  }

  getInvoice() {
    this.hideForPdf = false;
    setTimeout(() => {
      if (this.orderDetail.length) {
        document.title = this.orderDetail[0].cName + ' Invoice For OrderId ' + this.orderDetail[0].order_id
        window.focus()
        window.print()
      }
      document.title = "YantraWorld"
      this.hideForPdf = true;
    }, 500);
  }

  getOrderDetail() {
    this.orderService.getorderDetail(this.OrderId).subscribe(res => {
      this.orderDetailOriginal = res['data'];
      this.orderDetail = res['data'];
      this.getPaymentDetail();
    });
  }

  getPaymentDetail() {
    this.refreshFlag = false;
    this.orderService.getPaymentDetail(this.OrderId).subscribe(res => {
      this.paymentDetail = res['data'];
      this.refreshFlag = true;
      this.PaymentTotal = this.globalService.getTotalOfColumn(this.paymentDetail, 'Amount');
      this.totalRem = Math.round(this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(this.orderDetail, 'quantity', 'unit_cost') - this.PaymentTotal)
      this.payLink = "upi://pay?pa=paytmqr281005050101i59jwvlwuuy1@paytm&amp;pn=Neeraj Sangwan&amp;cu=INR";
    });
  }

  filterOrder(e: Event) {
    let str = (e.target as HTMLButtonElement).value;
    this.orderDetail = this.orderDetailOriginal;
    if (str.length) {
      this.orderDetail = this.globalService.filterByValue(this.orderDetail, str);
    } else {
      this.orderDetail = this.orderDetailOriginal;
    }
    console.log(this.orderDetail)
  }

  getStatusMaster() {
    this.MasterService.getStatusMaster().subscribe(res => {
      if (res['status'] == 200) {
        this.status = res['data'];
      }
    });
  }

  bulkStatusChange(item_id) {
    if (!this.bulkStatusArr.includes(item_id)) {
      this.bulkStatusArr.push(item_id);
    } else {
      this.bulkStatusArr.splice(this.bulkStatusArr.indexOf(item_id), 1);  //deleting
    }
    console.log(this.bulkStatusArr)
  }

  onChangeStatus(e: Event) {
    let Status = (e.target as HTMLButtonElement).value;
    if (confirm('Are you sure')) {
      this.bulkStatusArr.forEach(id => {
        const data = {
          StatusId: Status,
          item_id: id,
          order_id: this.OrderId,
          updatedByName:this.user.name
        }
        this.OrderService.updateOrderStatusByItemID(data).subscribe(res => {
          if (res['status'] == 200) {
            this.toastr.success(res['message']);
          } else {
            this.toastr.error(res['message']);
          }
        });
      });
    }
  }

}