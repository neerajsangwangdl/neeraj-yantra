import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { HTML2PDFService } from 'src/app/services/html2pdf.service';
import { CreditDebitService } from 'src/app/services/credit-debit.service';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-credit-debit-detail',
  templateUrl: './credit-debit-detail.component.html',
  styleUrls: ['./credit-debit-detail.component.scss']
})
export class CreditDebitDetailComponent implements OnInit {
  user: Customer;
  orderDetail: any = [];
  orderDetailOriginal: any;
  CustomerId: void;
  paymentDetail: any;
  PaymentTotal: number;
  totalRem: number;
  payLink: string;
  allowedStatus: any = [1, 2, 5]; // for payment
  refreshFlag: boolean;
  creditDebitList: any;
  creditDebitListOriginal: any;
  orderService: any;
  type: any;
  hideForPdf: boolean = true;

  constructor(private CreditDebitService: CreditDebitService,
    private dataService: DataService,
    public globalService: GlobalService,
    public OrderService: OrderService,
    public html2pdfService: HTML2PDFService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(res => {
      this.CustomerId = res.id;
    });
    this.route.queryParams.subscribe(params => {
      this.type = params['flag'] || 0; // 0 for retailer, 1 for saleman details
    })
  }
  ngOnInit(): void {
    this.user = this.dataService.getUserFromLocalStorage();
    this.type == 0 ? this.getCreditDebitByCustomerId() : this.getCreditDebitBySalemanId();
  }

  // getInvoice() {
  //   if (confirm('Generate invoice?')) {
  //     this.html2pdfService.captureScreen(document.getElementById('contentToConvert'), 'invoice');
  //   }
  // }
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

  deleteLedger(id) {
    this.CreditDebitService.deleteCreditDebitById(id).subscribe(res => {
      alert(res['message'])
      if (res['status'] == 200) {
        this.type == 0 ? this.getCreditDebitByCustomerId() : this.getCreditDebitBySalemanId();
      }
    });
  }

  getCreditDebitByCustomerId() {
    this.CreditDebitService.getCreditDebitByCustomerId(this.CustomerId).subscribe(res => {
      if (res['status'] == 200) {
        this.creditDebitListOriginal = res['data'].reverse();
        this.creditDebitList = res['data'];
      }
    });
  }
  getCreditDebitBySalemanId() {
    this.CreditDebitService.getCreditDebitBySalemanId(this.CustomerId).subscribe(res => {
      if (res['status'] == 200) {
        this.creditDebitListOriginal = res['data'];
        this.creditDebitList = res['data'];
      }
    });
  }
  getPaymentDetail() {
    this.refreshFlag = false;
    this.orderService.getPaymentDetail(this.CustomerId).subscribe(res => {
      // this.paymentDetail = res['data'];
      // this.refreshFlag = true;
      // this.PaymentTotal = this.globalService.getTotalOfColumn(this.paymentDetail, 'Amount');
      // // this.totalRem = Math.round(this.globalService.getTotalOfNonCancelledCreditDebitWithDeliveryCharges(this.orderDetail, 'quantity', 'unit_cost') - this.PaymentTotal)
      // this.payLink = "upi://pay?pa=paytmqr281005050101i59jwvlwuuy1@paytm&amp;pn=Neeraj Sangwan&amp;cu=INR";
    });
  }
  filterCreditDebit(str) {
    this.orderDetail = this.orderDetailOriginal;
    if (str.length) {
      this.orderDetail = this.globalService.filterByValue(this.orderDetail, str);
    } else {
      this.orderDetail = this.orderDetailOriginal;
    }
    console.log(this.orderDetail)
  }

}