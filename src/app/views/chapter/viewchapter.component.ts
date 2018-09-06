/**
 * Created by priya on 22/08/18.
 */
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
import { EditChapterData } from '../_models/EditChapterData'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { AddSubject } from '../_models/AddSubject';
import { GetSubject } from '../_models/GetSubject';
import { GetChapter } from '../_models/GetChapter';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
    templateUrl: 'viewchapter.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class ViewChapterComponent {
    userData = new UserData();
    baseUrl = environment.baseUrl;
    configFile = new ConfigFile();
    addChapter = new AddChapter();
    editChapter= new EditChapterData();
    editChapterForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    crypto = new BasicCrptoCredentials();
    desData = '';
    desSubjectData = '';
    msgInPopup = '';
    chapter = new GetChapter();
    departmentList:Department [];
    courseList:GetCourse [];
    chapterList:GetChapter [];
    addSubject = new AddSubject();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    chapterData = new GetChapter();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    url = 'assets/img/no_image.png';
    timer:any;
    subjectList:GetSubject [];
    backgroundImage = '../assets/img/search-icon.png';

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
    chapDept = '';
    chapCourse = '';
    chapSubject = '';
    desChapterData = "No Chapter Found";
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private uploadService:UploadFileService,
                private spinnerService:Ng4LoadingSpinnerService,
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
        this.editChapterForm = this.formBuilder.group({
            chapterTitle: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            chapterDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
        });
        this.desChapterData = "No Chapter Found";
        this.getAllDepartmentList();


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
                    this.spinnerService.hide();
                    this.departmentList = data.data;
                    ////     console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.departmentList = [];
                    this.subjectList = [];
                    this.chapterList = [];
                    this.courseList = [];
                    this.selectedDepartmentData = null;
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.spinnerService.hide();
                    this.desChapterData = "No Chapter Found";
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllCouseList():void {
        this.subjectList = [];
        this.chapterList = [];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));
                    this.selectedCourseData = this.courseList[0];
                    this.getAllSubjectList(this.courseList[0].courseId);
                } else {
                    this.spinnerService.hide();
                    this.courseList = [];
                    ;
                    this.subjectList = [];
                    this.chapterList = [];
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.desChapterData = "No Chapter Found";
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        this.chapterList = [];
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    this.selectedSubjectData = this.subjectList[0];
                    this.getAllChapters(this.subjectList[0].subjectId);
                    /// console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.chapterList = [];
                    this.subjectList = [];
                    this.selectedSubjectData = null;
                    this.desSubjectData = data.status.description;
                    this.desChapterData = "No Chapter Found";
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllChapters(id):void {
        this.chapterList = [];
        var get_all_chapter_url = this.baseUrl + this.configFile.getall_chapters;
        get_all_chapter_url = get_all_chapter_url.replace('{subjectId}', id);
        console.log("get_all_chapter_url========" + get_all_chapter_url);
        this.insmanagerService.getAllChaptersWithPromise(get_all_chapter_url)
            .then(resData => {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.desChapterData = '';
                    this.chapterList = data.data.lgchapterEntities;
                    if (data.data.lgchapterEntities == null) {
                        this.desChapterData = "No Chapter Found";
                    }
                    ////   console.log("chapterList========" + JSON.stringify(this.chapterList));
                } else {
                    this.desChapterData = "No Chapter Found";
                    this.chapterList = [];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getValueInDepartment(data) {
        this.selectedDepartmentData = '';
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
                    this.getAllChapters(this.selectedSubjectData.subjectId);
                    console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

                }
            }

        }
    }

    onEditSubmit() {
        if (this.editChapterForm.invalid) {
            return;
        }
      this.assignEditChapterParams();

    }

    assignEditChapterParams()
    {
      //  var url = this.getImageFileFolderName();
       // const file = this.selectedFiles.item(0);
       // this.uploadService.uploadfile(file, url);
      //  this.getUploadFileName();
        this.editChapter.chapterId =this.chapterData.chapterId;
        this.editChapter.chapterImage = this.chapterData.chapterImage;
        this.editChapter.chapterTitle = this.editChapterForm.value.chapterTitle.trim();
        this.editChapter.description = this.editChapterForm.value.chapterDescription.trim();
        this.editChapter.subjectId = this.chapterData.lgSubjectEntity.subjectId;
        this.editChapter.userId = this.userData.userId;
        this.editChapter.userTypeId = this.userData.userType;
        console.log("edit chapter params=====" + JSON.stringify(this.editChapter));
       this.editChapterApi();
    }
    editChapterApi():void {
        var edit_chapter_url = this.baseUrl + this.configFile.edit_chapter_url;
        edit_chapter_url = edit_chapter_url.replace('{chapterId}', this.chapterData.chapterId.toString());
        this.insmanagerService.editChapterWithPromise(this.editChapter, edit_chapter_url)
            .then(resData => {
                console.log("resData======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.editModal.hide();
                    this.getAllChapters(this.chapterData.lgSubjectEntity.subjectId);
                    this.toastr.success('', "Chapter  edited successfully!. ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }




    goToDeleteChapterPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupchapterData", data);
        this.msgInPopup = 'Do you want to delete ' + data.chapterTitle;
        this.childModal.show();
    }

    goToConFirmDelete():void {
        var popupchapterData = this.localStorageService.get("popupchapterData");
        console.log("popupchapterData=====" + popupchapterData);
        this.goToADeleteApiForChapter(popupchapterData.chapterId)
    }

    goToADeleteApiForChapter(id) {
        var chapter_delete_url = this.baseUrl + this.configFile.disable_chapter;
        chapter_delete_url = chapter_delete_url.replace('{userId}', this.userData.userId.toString());
        chapter_delete_url = chapter_delete_url.replace('{chapterId}', id);
        this.insmanagerService.deleteChapterWithPromise(chapter_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    if (this.selectedSubjectData != null) {
                        this.getAllChapters(this.selectedSubjectData.subjectId);
                    }
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToViewChapterPopUp(data):void {
        this.chapterData = data;
        this.chapDept = data.lgSubjectEntity.lgcourseinfoEntity.lgdepartmentinfoEntity.name;
        this.chapCourse = data.lgSubjectEntity.lgcourseinfoEntity.name;
        this.chapSubject = data.lgSubjectEntity.name;
        this.url = data.chapterImage;
        this.viewModal.show();

    }

    goToEditChapterPopUp(data):void {
        this.chapterData = data;
        console.log("edit chapter data=====" + JSON.stringify(data));
        this.localStorageService.set("editChapter", data);
        this.chapDept = data.lgSubjectEntity.lgcourseinfoEntity.lgdepartmentinfoEntity.name;
        this.chapCourse = data.lgSubjectEntity.lgcourseinfoEntity.name;
        this.chapSubject = data.lgSubjectEntity.name;
        this.editModal.show();

    }

}