import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/services/Shared/data.service';
import { Customer } from 'src/app/models/customer';
import { Router } from '@angular/router';
import { CustomerService } from '../../user/customer.service';
import { NewsLetterService } from '../../../services/NewsLetterService/news-letter.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-footer',
  // providers: [NewsLetterService],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dataService: DataService,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private newsletterService: NewsLetterService,
    private readonly updates: SwUpdate) {
  }
  ngOnInit() {
   
  }

}
