import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  loggedUser: any = {};
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loggedUser = this.dataService.getUserFromLocalStorage();
  }

}
