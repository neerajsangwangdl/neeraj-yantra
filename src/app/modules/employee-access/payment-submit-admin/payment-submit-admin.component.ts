import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/services/order.service';
import { GlobalService } from 'src/app/services/Shared/global.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-payment-submit-admin',
  templateUrl: './payment-submit-admin.component.html',
  styleUrls: ['./payment-submit-admin.component.scss']
})
export class PaymentSubmitAdminComponent implements OnInit {

  
  payment: any = {};
  paymentForm: FormGroup;
  loading = false;
  submitted = false;
  isChecked = 0;
  @Input('orderDetailData') OrderDetail: any;
  @Input('paymentDetailData') paymentDetail: any;
  @Output() refreshPaymentList = new EventEmitter<boolean>();
  payable: number = 0;
  status: any;
  constructor(
    private formBuilder: FormBuilder,
    private MasterService: MasterService,
    public OrderService: OrderService,
    public globalService: GlobalService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
    if (this.paymentDetail) {
      this.payable = Math.round(this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(this.OrderDetail, 'quantity', 'unit_cost') - this.globalService.getTotalOfColumn(this.paymentDetail, 'Amount'))
    } else {
      this.payable = this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(this.OrderDetail, 'quantity', 'unit_cost')
    }
    this.paymentForm = this.formBuilder.group({
      Amount: ['', [Validators.required, Validators.min(1)]],
      Status: ['', [Validators.required]],
    });
    this.getStatusMaster();
  }

  get f() { return this.paymentForm.controls; }

  payFull(e:Event) {
    let isPayFull = (e.target as HTMLButtonElement).value
    this.payable = this.globalService.getTotalOfNonCancelledOrderWithDeliveryCharges(this.OrderDetail, 'quantity', 'unit_cost') - this.globalService.getTotalOfColumn(this.paymentDetail, 'Amount')
    this.paymentForm.controls.Amount.setValue(isPayFull ? this.payable : 0)
  }

  getStatusMaster() {
    this.MasterService.getStatusMaster().subscribe(res => {
      if (res['status'] == 200) {
        this.status = res['data'];
      }
    });
  }


  onSubmit() {
    this.submitted = true;
    if (this.paymentForm.invalid || !confirm('Are you sure to Pay Rs. ' + this.paymentForm.value.Amount + '?')) {
      return;
    }
    this.payment = this.paymentForm.value;
    this.payment['OrderId'] = this.OrderDetail[0].order_id;
    // this.globalService.show();
    this.OrderService.addNewPaymentByOrderId(this.payment)
      .subscribe(res => {
        this.globalService.hide();
        if (res['status'] == 200) {
          this.refreshPaymentList.emit(true);
          this.OrderService.getPendingOrderForCustomerAndSendWhatsapp(this.OrderDetail[0].customer_id, this.OrderDetail[0].mob_phone, this.OrderDetail[0].cName)
          alert('Success');
          // this.orde
        } else {
          this.toastr.warning('Error!', res['message']);
        }
      })
  }

}
