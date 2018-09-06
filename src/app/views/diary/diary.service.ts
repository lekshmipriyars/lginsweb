/**
 * Created by priya on 13/07/18.
 */
/**
 * Created by priya on 10/07/18.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { AddDiary } from './adddiary';

@Injectable()
export class DairyService {
    baseUrl = environment.baseUrl;
    //baseUrl =""
    add_diary_url=this.baseUrl +'examType/add';
    view_diary_url=this.baseUrl +'examType/list/{instituteId}';
    constructor(private http:Http) {

    }
    /*getLoginWithObservable(): Observable<Login[]> {
     return this.http.get(this.url)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
     }*/
    addAddDiaryWithObservable(addDiary:AddDiary): Observable<AddDiary> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.add_diary_url, addDiary, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    getExamTypesWithPromise(instituteId): Promise<AddDiary[]> {
        this.view_diary_url=this.view_diary_url.replace('{instituteId}',instituteId);
        return this.http.get(this.view_diary_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addAddDiaryWithPromise(addDiary:AddDiary): Promise<AddDiary> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.add_diary_url, addDiary, options).toPromise()
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