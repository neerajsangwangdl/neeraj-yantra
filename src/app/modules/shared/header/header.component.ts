import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from 'src/app/services/shared/data.service';
import { Customer } from 'src/app/models/customer';
import { Router } from '@angular/router';
import { CustomerService } from '../../user/customer.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { SwPush } from '@angular/service-worker';
@Component({
  selector: 'app-header',
  providers: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  itemCount: number = 0;
  bagItemCount: number = 0;
  notificationCount: number = 0;
  message: string;
  user: Customer;
  isLogged: boolean = false;
  deferredPrompt: any;
  readonly VAPID_PUBLIC_KEY =
    'BGG8V5aP5-B_D4RTE9cLGlUPewCafawmZO5_9_uTmc99r8CDWCsLmTnAh3ToHEarTH5z24OhyBEUncqmF8SvLto';
  showPwaButton: boolean;
  version = environment.VERSION;
  host = environment.host;
  partnerName: any;
  PartnerId: number;

  constructor(
    private dataService: DataService,
    private customerService: CustomerService,
    private router: Router,
    private swPush: SwPush,
    private toastr: ToastrService,
    //private newsletterService: NewsLetterService
  ) {}

  ngOnInit() {
    // this.notificationCount = this.dataService.unreadNotificationCount;

    // this.dataService.bagCount.subscribe(count => this.bagItemCount = count);
    this.user = this.dataService.getUserFromLocalStorage();

    console.log(11, this.user);
    if (this.user) {
      if (this.user.Role <= 6) {
        this.partnerName = this.user.name;
        this.PartnerId = this.user.customer_id;
      } else {
        this.partnerName = this.user.partner_name;
        this.PartnerId = this.user.PartnerId;
      }
    }
    this.isLogged = this.user['customer_id'] ? true : null;
    this.swPush.notificationClicks.subscribe((result) => {
      alert('notificationClicks');
    });
  }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        let subs = JSON.parse(JSON.stringify(sub));
        console.log('subs', subs);
        let data = {
          endpoint: subs['endpoint'],
          expirationTime: 0,
          p256dh: subs['keys']['p256dh'],
          auth: subs['keys']['auth'],
          customerId: this.user['customer_id'] || 0,
        };
       // this.newsletterService.addPushSubscriber(data).subscribe((res) => {
          // if (res['status'] == 200){
          // }
        //  this.toastr.success(res['message']);
       // });
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  onLogout() {
    localStorage.removeItem('token');
    this.toastr.success('Thankyou!');
    window.location.href = '/';
    // this.customerService.Logout().subscribe(a => {
    //   this.user = null;
    //   this.isLogged = null;
    // });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    console.log(e);
    // this.subscribeToNotifications()
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showPwaButton = true;
    this.addToHomeScreen();
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showPwaButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      // this.subscribeToNotifications()
      this.deferredPrompt = null;
    });
  }

  showAppUpdateAlert() {
    const header = 'App Update available';
    const message = 'Choose Ok to update';
    const caller = this;
    // alert('update');
    // Use MatDialog or ionicframework's AlertController or similar
    // if (confirm('App Update Available, Do you want to update?')) {
    //   this.updates.activateUpdate().then(() => document.location.reload());
    // }
  }
  // clearSearch() {
  //   this.dataService.searchString = '';
  //   this.dataService.searchModelChanged.next('clear');
  // }
}
