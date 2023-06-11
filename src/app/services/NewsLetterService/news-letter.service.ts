import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { environment } from "src/environments/environment";



@Injectable()
export class NewsLetterService {

    constructor(private http: HttpClient) {

    }

    addPushSubscriber(sub:any) {
        return this.http.post(environment.apiUrl + 'common/subscribe-newsletter', sub);
    }

    send() {
        // return this.http.post('common/newsletter', null);
    }

}
