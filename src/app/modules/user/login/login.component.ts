// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule,FormControl, FormGroup } from '@angular/forms';
// import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    user:new FormControl(''),
    password:new FormControl(''),
    
  })
  loginUser(){
    console.log(this.loginForm.value)
  }

  constructor(
    private router:Router,
    // private user:CustomerService,
    
  
  ) { }

  ngOnInit(): void {
  }

}
