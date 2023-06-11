import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { GlobalService } from "./Shared/global.service";
import { Router } from "@angular/router";

@Injectable()
export class YantraInterceptor implements HttpInterceptor {
    constructor(public globalService: GlobalService,
        private router: Router) { }


    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            localStorage.clear();
            setTimeout(() => {
                this.router.navigateByUrl(`/`);
            }, 2000);
            setTimeout(() => {
                window.location.reload();
            }, 4000);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return of(err.message); // or EMPTY may be appropriate here
        }
        return throwError(err);
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('index.html') == -1) {
            // // this.globalService.show();
            // window['NProgress'].start();
        }
        const authReq = req.clone({ headers: req.headers });
        // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
        return next.handle(req).pipe(catchError(rerror => this.handleAuthError(rerror)),
            finalize(() => {
                // window['NProgress'].done()
            })
        );
    }
}