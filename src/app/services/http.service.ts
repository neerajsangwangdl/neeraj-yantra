import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpApiService {
    previousHtml: string;
    user: any = {};
    constructor(
        private httpClient: HttpClient,
    ) { 
        // setInterval(this.checkUpdatesInCode, 10000);
    }

    private formatErrors(error: any) {
        return throwError(error.error);
    }

    getUserFromLocalStorage(){
        if (localStorage.getItem('token')){
          this.user = JSON.parse(window.atob(localStorage.getItem('token')));
        }
        return this.user
      }

    createAuthorizationHeader() {
        const headers = {}
        this.getUserFromLocalStorage();
        headers['Content-Type'] = 'application/json'
        let userId = this.user['customer_id'] ? this.user['customer_id'] + '' : '';
        let RoleId = this.user['Role'] ? this.user['Role'] + '' : '';
        // headers['Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pr = -check=0
        // headers['Pragma', = 'no-cache
        // headers['Expires' =  '0
        headers['Access-Control-Allow-Orign'] = '*'
        headers['Access-Control-Allow-Credentials'] =  'true'
        const head = new HttpHeaders({'UserId':userId,'RoleId':RoleId})
        return head
    }
    // checkUpdatesInCode() {
    //     this.httpClient.get('https://apnidukan.yantraworld.in/index.html').subscribe(res => {
    //         console.log('VersionGet ',res)
    //         if (!this.previousHtml) {
    //             this.previousHtml = res['body'];
    //             return;
    //           }
    //           if (this.previousHtml !== res) {
    //             this.previousHtml = res['body'];
    //             document.getElementById("update-available").style.display = "block";
    //           }
    //     });
    // }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        let headers = this.createAuthorizationHeader();
        const options = { params: params, headers: headers }
        return this.httpClient.get(`${environment.apiUrl}${path}`, options)
            .pipe(catchError(this.formatErrors));
    }

    put(path: string, body: Object = {}): Observable<any> {
        let headers = this.createAuthorizationHeader();
        const options = { headers: headers }
        return this.httpClient.put(
            `${environment.apiUrl}${path}`,
            JSON.stringify(body),
            options
        ).pipe(catchError(this.formatErrors));
    }

    post(path: string, body: Object = {}): Observable<any> {
        let headers = this.createAuthorizationHeader();
        const options = { headers: headers }
        return this.httpClient.post(
            `${environment.apiUrl}${path}`,
            body,
            options
        ).pipe(catchError(this.formatErrors));
    }

    delete(path): Observable<any> {
        let headers = this.createAuthorizationHeader();
        const options = { headers: headers }
        return this.httpClient.delete(
            `${environment.apiUrl}${path}`, options
        ).pipe(catchError(this.formatErrors));
    }

    // VersionGet() {
    //     let headers = this.createAuthorizationHeader();
    //     const options = { headers: headers }
    //     // https and http impl
    //     return this.httpClient.get('https://apnidukan.yantraworld.in/index.html', options)
    //         .pipe(catchError(this.formatErrors));
    // }

    
}