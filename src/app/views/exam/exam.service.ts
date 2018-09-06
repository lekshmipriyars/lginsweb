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
import { AddExam } from '../_models/AddExam';
import { ExamTypeAdd } from './examtypeadd';
@Injectable()
export class ExamService {
    baseUrl = environment.baseUrl;
    //baseUrl =""
    exam_type_add_url=this.baseUrl +'examType/add';
    exam_type_all_get_url=this.baseUrl +'examType/list/{instituteId}';
    constructor(private http:Http) {

    }
    /*getLoginWithObservable(): Observable<Login[]> {
     return this.http.get(this.url)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
     }*/
    addExamTypeAddWithObservable(examTypeAdd:ExamTypeAdd): Observable<ExamTypeAdd> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.exam_type_add_url, examTypeAdd, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    getExamTypesWithPromise(instituteId): Promise<ExamTypeAdd[]> {
        this.exam_type_all_get_url=this.exam_type_all_get_url.replace('{instituteId}',instituteId);
        return this.http.get(this.exam_type_all_get_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addExamTypeAddWithPromise(examTypeAdd:ExamTypeAdd): Promise<ExamTypeAdd> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.exam_type_add_url, examTypeAdd, options).toPromise()
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