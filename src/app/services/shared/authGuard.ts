import { Injectable, isDevMode } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
//import { DataService } from './Shared/data.service';
import { DataService } from './data.service';
@Injectable()
export class Authguard implements CanActivate {
  constructor(private dataService: DataService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // if (!(isDevMode()) && (location.protocol !== 'https:')) {
    //   location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    //   // return false;
    // }
    let user = this.dataService.getUserFromLocalStorage();
    console.log(user);
    if (user && user['customer_id']) {
      return true;
    }
    this.router.navigate(['/customer/login']);
    return false;
  }
}
