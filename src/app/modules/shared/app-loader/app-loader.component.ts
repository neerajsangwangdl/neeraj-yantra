import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/Shared/data.service';
import { GlobalService } from 'src/app/services/Shared/global.service';


@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.scss']
})
export class LoaderComponent {
  isLoading: Subject<boolean> = this.globalService.isLoading;

  constructor(public globalService: GlobalService){}
}