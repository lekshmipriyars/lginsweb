/**
 * Created by priya on 09/07/18.
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { Register } from './register';

@Injectable()
export class RegisterService {
    institute_register='user/register';
    url = "https://betarest.learnerguru.com/inslearnerguru/"+this.institute_register;
    constructor(private http:Http) { }
    addRegWithObservable(reg:Register): Observable<Register> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url, reg, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    addRegWithPromise(reg:Register): Promise<Register> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.url, reg, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }
    private handleErrorPromise (error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }
}