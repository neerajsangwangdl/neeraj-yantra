import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { MasterService } from 'src/app/services/master.service';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedUser: any = {};
  otpForm: FormGroup;
  submitted: boolean;
  constructor(private dataService: DataService,
    private MasterService: MasterService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.otpForm = this.formBuilder.group({
      Reason: ['', Validators.required],
      created_for: ['']
    });
    this.loggedUser = this.dataService.getUserFromLocalStorage();
  }
  get f() { return this.otpForm.controls; }

  onSubmitOTP() {
    this.submitted = true;
    if (this.otpForm.invalid) {
      return;
    }
    this.otpForm.value['created_by'] = this.loggedUser.customer_id
    this.otpForm.value['created_for'] = this.otpForm.value['created_for'] ? this.otpForm.value['created_for'] : this.loggedUser.customer_id
    this.MasterService.generateOtp(this.otpForm.value)
      .subscribe(
        res => {
          alert(res['message']);
          if (res['status'] && res['status'] == 200) {
          }
        },
        error => {
          this.toastr.error(error);
        });
  }

}
