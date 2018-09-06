/**
 * Created by priya on 12/07/18.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { StudentAdd } from './studentadd';
import { Permission } from '../permission';
@Injectable()
export class StudentService {
    baseUrl = environment.baseUrl;
    //baseUrl =""
    staff_add_url = this.baseUrl + 'user/add';
    staff_all_get_url = this.baseUrl + 'examType/list/{instituteId}';
    all_permissionlist_url = this.baseUrl + 'permission/get/all';
    all_departments_byacadamicid_url = this.baseUrl + 'department/getByAcademicId/{academicId}';

    constructor(private http:Http) {

    }
}