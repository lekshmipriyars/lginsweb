/**
 * Created by priya on 02/08/18.
 */
/**
 * Created by priya on 10/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule,
    MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import { PermissionService } from '../../permission.service';
import { Permission } from '../../permission';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../../views/login/userdata';
import  {BasicCrptoCredentials} from '../../services/BasicCrptoCredentials';
import { ValidationService } from '../../services/validation.service';
import { IUserLogin } from '../../shared/interface';
import { Department } from '../../_models/Department';
import { GetCourse } from '../../_models/GetCourse';
import { GetExamType } from '../../_models/GetExamType';
import { LoggerService } from '../../services/logger.service';
import { environment } from 'environments/environment';
import { InsManagerService } from '../../services/insmanager.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ConfigFile } from '../../services/configfile';


@Component({
    selector: 'app-addfees',
    templateUrl: './addfees.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./addfees.component.scss']
})
export class AddfeesComponent implements OnInit {
    selectedDepartmentData = null;
    selectedCourseData = null;
    departmentData = new Department();
    courseData = new GetCourse();
    courseList:GetCourse [];
    FeesForm:FormGroup;
    getExamType = new GetExamType();
    departmentList:Department [];
    examTypeList:GetExamType [];
    submitted = false;
    public handleError;
    errorMessage:String;
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    selectedExamTypeData = null;
    isConnected:Observable<boolean>;


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private insmanagerService:InsManagerService) {
        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);

        } else {
            this.userData = this.localStorageService.get('userdata');
        }
    }

    ngOnInit() {
        this.FeesForm = this.formBuilder.group({}
        );
        this.getAllDepartmentList();
        this.getAllExamTypeList();


    }

    get f() {
        return this.FeesForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.FeesForm.invalid) {
            return;
        }
        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.courseList != null) {
                if (this.courseList.length == 0) {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add student...");
                } else {
                    this.toastr.error('', "Choose Course");
                }
            }
            else {
                this.toastr.error('', "No Course for this selected department.. so cant able to add student...");
            }


            return;
        }
        else if (this.selectedExamTypeData == '' || this.selectedExamTypeData == undefined || this.selectedExamTypeData == null) {
            this.toastr.error('', "Choose Exam Type");
            return;
        }

        this.assignFeesAddParams();


    }

    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllCouseList():void {
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    console.log("courseList========" + JSON.stringify(this.courseList));
                } else {
                    this.courseList.length = 0;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignFeesAddParams() {


    }

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name == data) {
                this.selectedDepartmentData = this.departmentList[i];
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                this.getAllCouseList();
            }

        }
    }

    getAllExamTypeList():void {
        var exam_type_get_url = this.baseUrl + 'examType/list/{instituteId}';
        exam_type_get_url = exam_type_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getExamTypeListWithPromise(exam_type_get_url)
            .then(examTypeData=> {
                var data = JSON.parse(JSON.stringify(examTypeData));
                if (data.status.success) {
                    this.examTypeList = data.data;
                    console.log("examTypeList========" + JSON.stringify(this.examTypeList));
                } else {
                    this.courseList.length = 0;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getValueInExamType(data) {
        this.selectedExamTypeData = null;
        for (var i = 0; i < this.examTypeList.length; i++) {
            this.getExamType = this.examTypeList[i];
            if (this.getExamType.examType == data) {
                this.selectedExamTypeData = this.examTypeList[i];
                console.log(" this.selectedExamTypeData=====" + JSON.stringify(this.selectedExamTypeData));
            }
        }
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.name == data) {
                this.selectedCourseData = this.courseList[i];
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

            }

        }
    }


}

