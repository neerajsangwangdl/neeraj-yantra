
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/shared/data.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  redirectUrl: any;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private customerService: CustomerService) {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['url']) {
        this.redirectUrl = queryParams['url'];
      }
    })
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

   if (this.dataService.getUserFromLocalStorage()) {
    this.router.navigate(['/products']);
   }

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;
    

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.customerService.Login(this.f['username'].value, this.f['password'].value).subscribe( res => {
          if (res['data'] && res['data']['customer_id']) {
            this.toastr.success('Hi!', 'Welcome to ApniDukan!');
            this.dataService.setUserInLocalStorage(res['data']);
            setTimeout(() => {
              if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
              } else {
                this.router.navigate(['/products']);
              }
            }, 1000);
          } else {
            this.toastr.success(res['message']);
          }
        },
        error => {
          this.toastr.success('Mobile or password is invalid.');
        });
  }

}
