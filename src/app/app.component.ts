import { Component, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { PWAAppUpdateService } from './services/pwa-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yantra';
  previousHtml: any;
  // deferredPrompt: any;
  // showButton = false;


  constructor(private swUpdate: SwUpdate) {
    // this.sw.checkForUpdates();
    // const serverURL = 'https://yantra-api.herokuapp.com/api/'; // prod
    // // const serverURL = 'http://localhost:8080/api/'; // local
    // localStorage.setItem('ServerUrl', serverURL);
    // if (environment.production){
    //   interval(1000 * 9).subscribe(() => {
    //     // this.getversion()
    //   });
    // }
    swUpdate.available.subscribe(event => {
      if (confirm('Latest Version of App is Available, Do you want to update?')) {
        window.location.reload();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1000 * 60);
      }
    });
  }

  getversion() {
    // this.sw.getVersion().subscribe(res => {
    //   if (!this.previousHtml) {
    //     this.previousHtml = res;
    //   }
    //   if (this.previousHtml !== res) {
    //     this.previousHtml = res;
    //     // alert('New Version Available, Update to New Version.');
    //     window.location.reload()
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 3000);
    //   }
    // }, err => {
    //   console.log('err', err)
    //   if (!this.previousHtml) {
    //     this.previousHtml = err['error']['text'];
    //   }
    //   if (this.previousHtml !== err['error']['text']) {
    //     this.previousHtml = err['error']['text'];
    //     window.location.reload()
    //     setTimeout(() => {
    //       window.location.reload();
    //     }, 10000);
    //     // document.getElementById("update-available").style.display = "block";
    //   }
    // })
  }

}
