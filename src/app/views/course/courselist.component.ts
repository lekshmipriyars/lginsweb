/**
 * Created by priya on 11/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


import { PermissionService } from './../permission.service';
import { Permission } from './../permission';
import { environment } from '../../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { LoggerService } from '../services/logger.service';
import { Course } from '../_models/Course';
import { Department } from '../_models/Department';
import { StaffService } from '../staff/staff.service';
import { FilterPipe} from '../services/FilterPipe';
import { InsManagerService } from '../services/insmanager.service';
import { ConfigFile } from '../services/configfile';
import { AddCourse } from '../_models/AddCourse';
import { GetCourse } from '../_models/GetCourse';
import { EditCourse } from '../_models/EditCourse';
import { DataTableResource } from 'angular4-smart-table';
@Component({
    templateUrl: 'courselist.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./course.component.scss']
})
@NgModule({
    declarations: [FilterPipe],
    exports: [FilterPipe]
})
export class CourseListComponent implements OnInit {
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    courseList:Course [];
    course = new Course();
    configFile = new ConfigFile();
    departmentList:Department [];
    departmentData = new Department();
    editCourseData = new GetCourse();
    editCourse = new EditCourse();
    editCourseForm:FormGroup;
    submitted = false;
    editSubmitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    desData = 'No Course Found';
    selectedDepartmentData = null;
    selectedDepartmentId:number;
    baseUrl = environment.baseUrl;
    msgInPopup = '';
    url = 'assets/img/no_image.png';
    backgroundImage = '../assets/img/search-icon.png';
    isConnected:Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;


    itemResource = new DataTableResource(this.courseList);
    items = [];
    itemCount = 0;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private insmanagerService:InsManagerService,
                public localStorageService:LocalStorageService,
                private spinnerService:Ng4LoadingSpinnerService,
                private staffService:StaffService) {
        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
        }
    }

    ngOnInit() {
        this.editCourseForm = this.formBuilder.group({
            editCourseName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            editCourseDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],

        });
        this.getAllDepartmentList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.editCourseForm.controls;
    }


    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) {
        return item.jobTitle;
    }


    onEditSubmit() {
        this.editSubmitted = true;
        // stop here if form is invalid
        if (this.editCourseForm.invalid) {
            return;
        }
        this.assignCourseEditParams();
        this.editCourseApi();
    }


    // need to move common
    refresh():void {
        window.location.reload();
    }

    assignCourseEditParams() {
        // var url = this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/';
        // const file = this.selectedFiles.item(0);
        // this.uploadService.uploadfile(file, url);
        // this.getUploadFileName();
        this.editCourse.departmentId = this.editCourseData.departmentId;
        this.editCourse.name = this.editCourseForm.value.editCourseName;
        this.editCourse.courseImage = this.editCourseData.courseImage;
        this.editCourse.description = this.editCourseForm.value.editCourseDescription;
        this.editCourse.userId = this.userData.userId;
        this.editCourse.courseId = this.editCourseData.courseId;
        this.editCourse.mediumTypeId = 0;

    }

    editCourseApi() {
        var edit_course_url = this.baseUrl + this.configFile.edit_course_url;
        this.insmanagerService.editCourseWithPromise(this.editCourse, edit_course_url)
            .then(resData => {
                console.log("courseEdit======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.editModal.hide();
                    this.getAllCourseList(this.editCourseData.departmentId);
                    this.toastr.success('', "Course  edited successfully!. ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    // all Course getting
    getAllCourseList(id):void {
        this.courseList = [];
        this.spinnerService.show();
        var course_all_get_url = this.baseUrl + 'course/get/{departmentId}';
        course_all_get_url = course_all_get_url.replace('{departmentId}', id);
        this.insmanagerService.getAllCoursesWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.courseList = data.data;
                    this.desData = '';
                    this.setDataSourceInList(this.courseList);

                    console.log(" this.itemResource========" + JSON.stringify(this.itemResource));
                } else {
                    this.spinnerService.hide();
                    this.courseList = [];
                    this.setDataSourceInList(this.courseList);
                    this.desData = data.status.description;
                    ////   this.toastr.error('', data.status.description);
                }
            },
                error => this.errorMessage = <any>error);
    }


    setDataSourceInList(data) {
        this.itemResource = new DataTableResource(data);
        this.itemResource.count().then(count => this.itemCount = count);
        this.reloadItems(this.itemResource);
        if (data.length < 10) {
            this.itemCount = data.length;
        }
    }

    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    if (this.localStorageService.get('deparmentInCourse') == '' || this.localStorageService.get('deparmentInCourse') == null) {
                        this.selectedDepartmentData = this.departmentList[0];
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    } else {
                        this.selectedDepartmentData = this.localStorageService.get('deparmentInCourse');
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    }
                    ///  console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
                        this.getAllCourseList(this.selectedDepartmentData.departmentId);
                    }
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getValueInDepartment(data) {
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.departmentId == data) {
                this.selectedDepartmentData = this.departmentList[i];
                this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                this.localStorageService.set("deparmentInCourse", this.selectedDepartmentData);
                break;
            }
        }
        if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
            this.getAllCourseList(this.selectedDepartmentData.departmentId);
        }
    }

    goToEditNamePopUp(data):void {
        console.log("data=====" + JSON.stringify(data));
        this.localStorageService.set("editName", data);
        this.editCourseData = data;
        this.editModal.show();

    }


    goToConFirmCourseDelete():void {
        var popupCourse = this.localStorageService.get("popupCourse");
        console.log("popupCourse=====" + JSON.stringify("popupCourse"));
        this.goToADeleteApiForCourse(popupCourse.courseId)
    }

    goToADeleteApiForCourse(id) {
        var course_delete_url = this.baseUrl + this.configFile.disable_course;
        course_delete_url = course_delete_url.replace('{userId}', this.userData.userId.toString());
        course_delete_url = course_delete_url.replace('{courseId}', id);
        console.log("course-delete--" + course_delete_url)
        this.insmanagerService.deleteCourseWithPromise(course_delete_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllCourseList(this.selectedDepartmentData.departmentId);
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToDeleteCoursePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupCourse", data);
        this.msgInPopup = 'Do you want to delete ' + data.name;
        this.childModal.show();

    }

    goToViewCoursePopUp(data):void {
        this.course = data;
        this.url = data.courseImage;
        this.viewModal.show();

    }
}