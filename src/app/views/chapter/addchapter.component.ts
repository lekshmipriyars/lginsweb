/**
 * Created by priya on 21/08/18.
 */
import {  NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';

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
import { InsManagerService } from '../services/insmanager.service';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { UploadFileService } from '../services/upload-file.service';
import { ConfigFile } from '../services/configfile';
import { environment } from '../../../environments/environment';
import { AddChapter } from '../_models/AddChapter';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { AddSubject } from '../_models/AddSubject';
import { GetSubject } from '../_models/GetSubject';
@Component({
    templateUrl: 'addchapter.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class AddChapterComponent {
    userData = new UserData();
    baseUrl = environment.baseUrl;
    configFile = new ConfigFile();
    addChapter = new AddChapter();
    chapterForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    crypto = new BasicCrptoCredentials();
    desData = '';
    desSubjectData = '';
    msgInPopup = '';
    departmentList:Department [];
    courseList:GetCourse [];
    addSubject = new AddSubject();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    url = 'assets/img/no_image.png';
    timer:any;
    subjectList:GetSubject [];

    // pic choosing variables
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    uploadFileName = '';
    selectedFiles:FileList;

    selectedDepartmentId:number;
    selectedCourseId:number;
    selectedSubjectId:number;
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;

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

        this.chapterForm = this.formBuilder.group({
            chapterTitle: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            chapterDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();

        this.getChapterList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.chapterForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.chapterForm.invalid) {
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
                this.toastr.error('', "Choose Course");
            }

            return;
        } else if (this.selectedSubjectData == '' || this.selectedSubjectData == undefined || this.selectedSubjectData == null) {
            if (this.subjectList != null) {
                if (this.subjectList.length == 0) {
                    this.toastr.error('', "No subject for this selected course.. so cant able to add chapter...");
                } else {
                    this.toastr.error('', "Choose subject");
                }
            }
            else {
                this.toastr.error('', "No subject for this selected course.. so cant able to add chapter...");
            }
            return;
        }
        this.assignChapterAddParams();

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    ////     console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.selectedDepartmentData=null;
                    this.selectedCourseData=null;
                    this.selectedSubjectData=null;
                    this.courseList=[];
                    this.subjectList=[];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList():void {
        this.subjectList=[];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));
                    this.selectedCourseData = this.courseList[0];
                    this.getAllSubjectList(this.courseList[0].courseId);
                } else {
                    this.courseList=[];
                    this.subjectList=[];
                    this.selectedSubjectData=null;
                    this.selectedCourseData=null;
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
                    this.selectedSubjectData=this.subjectList[0];
                    /// console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.subjectList=[];
                    this.selectedSubjectData=null;
                    this.desSubjectData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    private assignChapterAddParams() {
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        this.addChapter.chapterId = 0;
        this.addChapter.chapterImage = this.uploadFileName;
        this.addChapter.chapterTitle = this.chapterForm.value.chapterTitle.trim();
        this.addChapter.description = this.chapterForm.value.chapterDescription.trim();
        this.addChapter.subjectId = this.selectedSubjectData.subjectId;
        this.addChapter.userId = this.userData.userId;
        this.addChapter.userTypeId = this.userData.userType;
        console.log("params=====" + JSON.stringify(this.addChapter));
        this.addChapterApi();


    }

    getChapterList():void {

    }

    addChapterApi():void {
        this.insmanagerService.addChapterWithPromise(this.addChapter)
            .then(resData => {
                console.log("chapterAddData======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.toastr.success('', "Chapter added successfully! ");
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.router.navigate(['chapter/view-chapter']);
                    }, 1000);

                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);

    }

    getImageFileFolderName():string {
        var data;
        data = this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + "/Subject/" + this.selectedSubjectData.subjectId + "/Chapter/";
        return data;
    }

    getUploadFileName() {
        var FOLDER = this.getImageFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
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

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name != null || this.departmentData.name != '') {
                if (this.departmentData.name.trim() == data.trim()) {
                    this.selectedDepartmentData = this.departmentList[i];
                    console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                    this.getAllCouseList();
                }
            }

        }
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            console.log(" data=====" + data + "======" + this.courseData.name + "======");
            if (this.courseData.name != null || this.courseData.name != '') {
                if (this.courseData.name.trim() == data.trim()) {
                    this.selectedCourseData = this.courseList[i];
                    this.getAllSubjectList(this.selectedCourseData.courseId);
                    console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

                }
            }

        }
    }

    getValueInSubject(data) {
        this.selectedSubjectData = null;
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.name != null || this.subjectData.name != '') {
                if (this.subjectData.name.trim() == data.trim()) {
                    this.selectedSubjectData = this.subjectList[i];
                    console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

                }
            }

        }
    }


    goToConFirmDelete():void {

    }


    goToADeleteApiForChapter(id) {

    }

    goToDeleteChapterPopUp(data):void {


    }

}