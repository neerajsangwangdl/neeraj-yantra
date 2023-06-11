import { Component, OnInit } from '@angular/core';
import { TargetService } from '../target.service';
import { DataService } from '../../../services/Shared/data.service';


@Component({
  selector: 'app-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss']
})
export class TargetListComponent implements OnInit {

  user:any;
  allTargets:any = [];

  constructor(
    private targetService: TargetService,
    private dataService: DataService,
    ) { }

  ngOnInit(): void {

    this.user = this.dataService.getUserFromLocalStorage();
    this.getAllTarget();
  }

  // to call function from  target service.

  getAllTarget() {
    this.targetService.getAllTarget(this.user.customer_id).subscribe(res => {
      console.log(res);
      if (res['status'] == 200) {
        this.allTargets = res['data'];
      }
    });
  }
}
