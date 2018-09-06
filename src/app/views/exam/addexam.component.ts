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

import { PermissionService } from './../permission.service';
import { Permission } from './../permission';

import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { AddExam } from '../_models/AddExam';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {AddStudent} from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { GetExamType } from '../_models/GetExamType';
import { ConfigFile } from '../services/configfile';
import { GetSubject } from '../_models/GetSubject';
import {
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatStepperModule,
    MatNativeDateModule,
    MAT_DATE_FORMATS,

} from '@angular/material';

@Component({
    selector: 'app-student',
    templateUrl: 'addexam.component.html',
    styleUrls: ['./exam.component.scss']

})
export class AddExamComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addExam = new AddExam();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    examTypeData = new GetExamType();
    configFile = new ConfigFile();

    getExamType = new GetExamType();
    departmentList:Department [];
    examTypeList:GetExamType [];
    courseList:GetCourse [];
    subjectList:GetSubject [];
    examForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    gender_value = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedExamTypeData = null;
    selectedSubjectData = null;
    examStartDate = '';
    examEndDate = '';
    desSubjectData = '';
    examStartDateTime = '';
    examEndDateTime = '';
    duration=0;

    // Min moment: current date and time
    public min = new Date();

    // Max moment: April 21 2018, 20:30
    public max = new Date(2019, 3, 21, 20, 30);
    examList = [];
    totalMarks=0;
    passingMarks=0;
    timer:any;
    isConnected: Observable<boolean>;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private uploadService:UploadFileService,
                public localStorageService:LocalStorageService,
                private insmanagerService:InsManagerService) {
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
        this.examForm = this.formBuilder.group({
            passingMarks: ['', [Validators.required, Validators.minLength(1), , Validators.maxLength(3)]],
            totalMarks: ['', [Validators.required, Validators.minLength(1), , Validators.maxLength(3)]],
            examStartDateTime: ['', [Validators.required]],
            examEndDateTime: ['', [Validators.required]],
          
        });
        this.getAllDepartmentList();
        this.getAllExamTypeList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.examForm.controls;
    }

    onSubmit() {
        this.examList = [];
        this.submitted = true;
        // stop here if form is invalid
        if (this.examForm.invalid) {
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
        } else if (this.selectedSubjectData == '' || this.selectedSubjectData == undefined || this.selectedSubjectData == null) {
            this.toastr.error('', "Choose subject ");
            return;
        } else if (this.selectedExamTypeData == '' || this.selectedExamTypeData == undefined || this.selectedExamTypeData == null) {
            this.toastr.error('', "Choose Exam Type");
            return;
        }

        this.duration=this.getDuration(this.examStartDateTime,this.examEndDateTime);
        console.log("duration===="+this.duration);
        this.examList.push({
            subjectId: this.selectedSubjectData.subjectId,
            startTime:new Date(this.examStartDateTime).getTime(), //this.formatDate(this.examStartDateTime),
            endTime:new Date(this.examEndDateTime).getTime(), //this.formatDate(this.examEndDateTime),
            maxMark: this.totalMarks,
            passMark: this.passingMarks,
            duration:  this.duration
        });


        if (this.userData.lgUserMappingEntity.lgInstituteEntity.currentAcademicYearStatus == 0) {
            this.toastr.error('', "Please set the Acadamic Year. Then Only You can able to add Department");
        } else {
            this.assignExamAddParams();
            console.log("parms====" + JSON.stringify(this.addExam));
          this.addExamApi();
        }
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

   formatDate(date) {
       var hours = date.getHours();
       var minutes = date.getMinutes();
       var ampm = hours >= 12 ? 'pm' : 'am';
       hours = hours % 12;
       hours = hours ? hours : 12; // the hour '0' should be '12'
       minutes = minutes < 10 ? '0'+minutes : minutes;
       var strTime = hours + ':' + minutes + ' ' + ampm;
       return strTime;
}

    private assignExamAddParams() {
        this.addExam.instituteId = this.userData.instituteId;
        this.addExam.examType = this.selectedExamTypeData.examTypeId;
        this.addExam.addedBy = this.userData.userId;
        this.addExam.lgExamList = this.examList;
        this.addExam.courseId = this.selectedCourseData.courseId;
    }


    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
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
                    ///this.selectedCourseData = this.courseList[0];
                    this.getAllSubjectList(this.courseList[0].courseId);
                } else {
                    this.courseList.length = 0;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.subjectList.length = 0;
                    this.desSubjectData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
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


    addExamApi():void {
        this.insmanagerService.addExamWithPromise(this.addExam)
            .then(studentAddData => {
                console.log("studentAddData======================" + JSON.stringify(studentAddData));
                var data = JSON.parse(JSON.stringify(studentAddData));
                if (data.status.success) {
                    this.toastr.success('', "Exam added successfully! ");
                    this.localStorageService.set("deparmentInExam", this.selectedDepartmentData);
                    this.localStorageService.set("courseInExam", this.selectedCourseData);
                    this.localStorageService.set("subjectInExam", this.selectedSubjectData);
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.router.navigate(['exam/exam-list']);
                    }, 1000);

                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getValue(data) {
        console.log("data====" + data.name)
        console.log("id====" + data.id);
        this.gender_value = data.id;
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

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.name == data) {
                this.selectedCourseData = this.courseList[i];
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));
                this.getAllSubjectList(this.selectedCourseData.courseId)

            }

        }
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

    getValueInSubject(data) {
        this.selectedSubjectData = null;
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.name == data) {
                this.selectedSubjectData = this.subjectList[i];
                this.passingMarks=this.subjectList[i].passingMarks;
                this.totalMarks=this.subjectList[i].maxMarks;
                console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

            }

        }
    }


    getDuration(date1,date2) {
        var difference = date2 - date1;
        /// console.log("difference -------"+difference)
        if (difference <= 0) {
            // Timer done
            // clearInterval(timer);
        } else {
            var seconds = Math.floor(difference / 1000);
            var minutes = Math.floor(seconds / 60);
            console.log("===mins===="+minutes+"=====seconds===="+seconds);
            return minutes;

        }
    }


}


export enum INSTITUTE_TYPES{
    USER_TYPE_ADMIN = 1,
    USER_TYPE_MANAGER = 2,
    USER_TYPE_PRINCIPAL = 3,
    USER_TYPE_STAFF = 4,
    USER_TYPE_ACCOUNTANT = 5,
    USER_TYPE_LIBRARIAN = 6,
    USER_TYPE_TRANSPORT_MANAGER = 7,
    USER_TYPE_ASSISTANT = 8,
    USER_TYPE_PARENT = 9,
    USER_TYPE_STUDENT = 10
}