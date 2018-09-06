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
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { AddSubject } from '../_models/AddSubject';
import { AddSubjectType } from '../_models/AddSubjectType';
import { ConfigFile } from '../services/configfile';
import { NumberValidatorsService } from '../services/NumberValidaorService';
@Component({
    selector: 'app-student',
    templateUrl: 'addsubject.component.html',
    styleUrls: ['./subject.component.scss']

})
export class AddSubjectComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addSubject = new AddSubject();
    departmentData = new Department();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    subjectType = new AddSubjectType();
    departmentList:Department [];
    courseList:GetCourse [];
    subjectTypeList:AddSubjectType [];
    subjectForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    stLastName:string;
    permission = '';
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    gender_value = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectTypeData = null;
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
        this.subjectForm = this.formBuilder.group({
            subjectName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            subjectDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            passingMarks: ['', [Validators.required, NumberValidatorsService.max(200), NumberValidatorsService.min(0)]],
            totalMarks: ['', [Validators.required, NumberValidatorsService.max(200), NumberValidatorsService.min(0)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();
        this.getAllSubjectTypeList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.subjectForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.subjectForm.invalid) {
            return;
        }

        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.courseList != null) {
                if (this.courseList.length == 0) {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add subject...");
                } else {
                    if (this.courseList.length == 1) {
                        this.selectedCourseData = this.courseList[0];
                    }
                }
            }
            else {
                this.toastr.error('', "No Course for this selected department.. so cant able to add subject...");
            }

            return;
        } else if (this.selectedFiles == undefined) {
            this.toastr.error('', "Choose Image ");
            return;
        } else if (this.selectedSubjectTypeData == '' || this.selectedSubjectTypeData == undefined || this.selectedSubjectTypeData == null) {
            this.toastr.error('', "Choose Subject Type");
            return;
        }

        if (this.userData.lgUserMappingEntity.lgInstituteEntity.currentAcademicYearStatus == 0) {
            this.toastr.error('', "Please set the Acadamic Year. Then Only You can able to add Department");
        } else {
            this.assignSubjectAddParams();

        }

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    getImageFileFolderName():string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + '/Subject/';
    }

    private assignSubjectAddParams() {
        var pMark = parseInt(this.subjectForm.value.passingMarks.trim());
        var tMark = parseInt(this.subjectForm.value.totalMarks.trim());
        if (pMark > tMark) {
            this.toastr.error('', "Passing marks higher than total marks");
            return;
        }
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        this.addSubject.courseId = this.selectedCourseData.courseId;
        this.addSubject.name = this.subjectForm.value.subjectName.trim();
        this.addSubject.semesterId = 0;
        this.addSubject.description = this.subjectForm.value.subjectDescription.trim();
        this.addSubject.image = this.uploadFileName;
        this.addSubject.userId = this.userData.userId;
        this.addSubject.instituteId = this.userData.instituteId;
        this.addSubject.subjectTypeId = this.selectedSubjectTypeData.subjectId;
        this.addSubject.maxMark = parseInt(this.subjectForm.value.totalMarks.trim());
        this.addSubject.passingMark = parseInt(this.subjectForm.value.passingMarks.trim());
         console.log("add Subject params==="+JSON.stringify(this.addSubject))
         this.addSubjectApi();

    }

    getUploadFileName() {
        var FOLDER = this.getImageFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
    }


    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
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
                    this.selectedCourseData = this.courseList[0];
                    console.log("selectedCourseData========" + JSON.stringify(this.selectedCourseData));
                } else {
                    this.courseList = [];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectTypeList():void {
        this.insmanagerService.getSubjectTypesWithPromise(this.userData.instituteId)
            .then(subjectTypeAddData => {
                var data = JSON.parse(JSON.stringify(subjectTypeAddData));
                if (data.status.success) {
                    this.subjectTypeList = data.data;
                    console.log("subjectTypeList========" + JSON.stringify(this.subjectTypeList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    addSubjectApi():void {
        this.insmanagerService.addSubjectWithPromise(this.addSubject)
            .then(subjectAddData => {
                console.log("subjectAddData======================" + JSON.stringify(subjectAddData));
                var data = JSON.parse(JSON.stringify(subjectAddData));
                if (data.status.success) {
                    this.toastr.success('', "Subject added successfully! ");
                    this.localStorageService.set("deparmentInSubject", this.selectedDepartmentData);
                    this.localStorageService.set("courseInSubject", this.selectedCourseData);
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.router.navigate(['subject/subject-list']);
                    }, 1000);

                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    selectFile(event) {
        this.selectedFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenFileName = event.target.files[0].name;
        this.chosenFileType = event.target.files[0].type;
        this.chosenFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    getFileType() {
        /* var extensionIndex = this.chosenFileName.lastIndexOf('.');
         this.chosenExtension = this.chosenFileName.substring(extensionIndex).toUpperCase();
         if (content_file_type_extension_name[content_file_type_extension.PNG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.PNG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.JPG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPEG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.JPEG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.GIF - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.GIF - 1];
         } else {
         this.chosenFileType = 'Unknown File Type';
         }*/

    }

    getFileSize() {
        var fileSizeInBytes = 0;
        fileSizeInBytes = parseInt(this.chosenFileSize);
        var tempSize = 0;
        if (fileSizeInBytes > 1024 * 1024) {
            var fileSizeInMB = fileSizeInBytes / 1024 / 1024;
            tempSize = Math.round(fileSizeInMB * 100) / 100 ////+ ' MB';
            this.chosenFileSize = tempSize.toString() + 'MB';
        } else if (fileSizeInBytes > 1024) {
            var fileSizeInKB = fileSizeInBytes / 1024;
            tempSize = Math.round(fileSizeInKB * 100) / 100 /////+ ' KB';
            this.chosenFileSize = tempSize.toString() + 'KB';
        } else {
            tempSize = fileSizeInBytes //; + ' Bytes';
            this.chosenFileSize = tempSize.toString() + 'Bytes';
        }
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

            }

        }
    }

    getValueInSubjectType(data) {
        this.selectedSubjectTypeData = null;
        for (var i = 0; i < this.subjectTypeList.length; i++) {
            this.selectedSubjectTypeData = this.subjectTypeList[i];
            if (this.selectedSubjectTypeData.subjectType == data) {
                this.selectedSubjectTypeData = this.subjectTypeList[i];
                console.log(" this.selectedSubjectTypeData=====" + JSON.stringify(this.selectedSubjectTypeData));

            }

        }
    }

    goToReset() {

        this.chosenFileName = "";
        this.chosenFileType = "";
        this.chosenFileSize = '';
        this.url = 'assets/img/no_image.png';
    }
}


