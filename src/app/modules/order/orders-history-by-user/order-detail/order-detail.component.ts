import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { HTML2PDFService } from 'src/app/services/html2pdf.service';
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
  paymentDetail: any=[];
  PaymentTotal: number;
  totalRem: number;
  payLink: string;
  hideForPdf: boolean =true;

  constructor(private orderService: OrderService,
    private dataService: DataService,
    public globalService: GlobalService,
    public html2pdfService: HTML2PDFService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.OrderId = res['id'];
    });
  }
  ngOnInit(): void {
    // alert()
    this.user = this.dataService.getUserFromLocalStorage();
    this.getOrderDetail();
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
      this.getPaymentDetail();
      this.orderDetailOriginal = res['data'];
      this.orderDetail = res['data'];
      
    });
  }
  getPaymentDetail() {
    this.orderService.getPaymentDetail(this.OrderId).subscribe(res => {
      this.paymentDetail = res['data'];
      this.PaymentTotal = this.globalService.getTotalOfColumn(this.paymentDetail, 'Amount');
      this.totalRem = Math.round(this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(this.orderDetail, 'quantity', 'unit_cost') - this.PaymentTotal)
      this.payLink = "upi://pay?pa=paytmqr281005050101i59jwvlwuuy1@paytm&amp;pn=Neeraj Sangwan&amp;cu=INR";
    });
  }
  filterOrder(event: Event) {
    const str = (event.target as HTMLInputElement).value;
    this.orderDetail = this.orderDetailOriginal;
    if (str.length) {
      this.orderDetail = this.globalService.filterByValue(this.orderDetail, str);
    } else {
      this.orderDetail = this.orderDetailOriginal;
    }
    console.log(this.orderDetail)
  }

}