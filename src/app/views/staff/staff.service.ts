/**
 * Created by priya on 11/07/18.
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
import { AddStaff } from '../_models/AddStaff';
import { Permission } from '../permission';
import { Designation } from '../_models/Designation';
import {Department} from '../_models/Department';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
@Injectable()
export class StaffService {
    baseUrl = environment.baseUrl;
    //baseUrl =""
    staff_add_url=this.baseUrl +'user/add';
    staff_all_get_url=this.baseUrl +'examType/list/{instituteId}';
    all_permissionlist_url=this.baseUrl+'permission/get/all';
    all_departments_byacadamicid_url=this.baseUrl+'department/getByAcademicId/{academicId}';
    admin_all_designation_url= this.baseUrl +'designation/list/{instituteId}';
    ins_admin_list_user_url= this.baseUrl+'user/get';
    constructor(private http:Http) {

    }
    /*getLoginWithObservable(): Observable<Login[]> {
     return this.http.get(this.url)
     .map(this.extractData)
     .catch(this.handleErrorObservable);
     }*/
    addStaffAddWithObservable(staffAdd:AddStaff): Observable<AddStaff> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.staff_add_url, staffAdd, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }



    getAllDepartmentsWithPromise(academicId): Promise<Department[]> {
        this.all_departments_byacadamicid_url=this.all_departments_byacadamicid_url.replace('{academicId}',academicId);
        return this.http.get(this.all_departments_byacadamicid_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getAllPermissionWithPromise(instituteId): Promise<Permission[]> {
        return this.http.get(this.all_permissionlist_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }


    getAllStaffsWithPromise(instituteId): Promise<AddStaff[]> {
        this.staff_all_get_url=this.staff_all_get_url.replace('{instituteId}',instituteId);
        return this.http.get(this.staff_all_get_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }



    getAllDesignationWithPromise(instituteId): Promise<Designation[]> {
        this.admin_all_designation_url=this.admin_all_designation_url.replace('{instituteId}',instituteId);
        return this.http.get(this.admin_all_designation_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

/*
    addStaffWithPromise(staffAdd:StaffAdd): Promise<StaffAdd> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.staff_add_url, staffAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }*/

    getUserListWithPromise(userList:GetUserListParamData): Promise<GetUserListParamData> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        console.log("user list parmas"+JSON.stringify(userList))
        return this.http.post(this.ins_admin_list_user_url, userList, options).toPromise()
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