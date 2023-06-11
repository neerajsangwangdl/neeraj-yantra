import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.user = this.dataService.getUserFromLocalStorage();
  }

}
