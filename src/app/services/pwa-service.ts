import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PWAAppUpdateService {
  constructor(public updates: SwUpdate,
    private http: HttpClient) {
    interval(1000 * 10 * 60).subscribe(() => {
      if (updates.isEnabled) {
        updates.checkForUpdate()
          .then(() => {
            console.log('checking for updates')
          }
          )
      }
    });
  }

  ngOnInit() {
    console.log('ng on init called fro pwa service')
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          document.location.reload()
          setTimeout(() => {
            window.location.reload();
          }, 10000);
        }
      });
    }
  }

  getVersion() {
    return this.http.get('https://apnidukan.yantraworld.in/index.html', { responseType: 'text' });
  }
  
}