/**
 * Created by priya on 10/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { GetSubject } from '../_models/GetSubject';
import { FilterPipe} from '../services/FilterPipe';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EditSubject } from '../_models/EditSubject';
import { DataTableResource } from 'angular4-smart-table';

@Component({
    selector: 'app-student',
    templateUrl: 'subjectlist.component.html',
    styleUrls: ['./subject.component.scss']

})
@NgModule({
    declarations:[FilterPipe],
    exports:[FilterPipe]
})
export class SubjectListComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addSubject = new AddSubject();
    departmentData = new Department();
    getSubject = new GetSubject();
    subjectData= new GetSubject();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    editSubjectData=new GetSubject();
    editSubject=new EditSubject();
    subjectType = new AddSubjectType();
    departmentList:Department [];
    subjectList:GetSubject [];
    courseList:GetCourse [];
    subjectTypeList:AddSubjectType [];
    subjectForm:FormGroup;
    editSubjectForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    editSubmitted = false;
    data = '';
    desSubjectData = 'No Subject Found';
    public handleError;
    errorMessage:String;
    stLastName:string;
    permission='';
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
    desDepartmentData='';
    desData = '';
    msgInPopup='';
    backgroundImage='../assets/img/search-icon.png';
    selectedDepartmentId:number;
    selectedCourseId:number;
    isConnected: Observable<boolean>;

    itemResource = new DataTableResource(this.subjectList);
    items = [];
    itemCount = 0;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private uploadService:UploadFileService,
                private spinnerService: Ng4LoadingSpinnerService,
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


        this.editSubjectForm = this.formBuilder.group({
            editSubjectName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            editSubjectDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            editPassingMarks: ['', [Validators.required, Validators.minLength(1), , Validators.maxLength(3)]],
            editTotalMarks: ['', [Validators.required, Validators.minLength(1), , Validators.maxLength(3)]],

        });

        this.getAllDepartmentList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.editSubjectForm.controls;
    }

    onEditSubmit() {
        this.editSubmitted = true;
        // stop here if form is invalid
        if (this.editSubjectForm.invalid) {
            return;
        }
        this.assignSubjectEditParams();
        this.editSubjectApi();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    assignSubjectEditParams()
    {
       // var url = this.userData.instituteId + '/subject/' + this.selectedDepartmentData.departmentId + '/' + this.selectedCourseData.courseId + "/";
       // const file = this.selectedFiles.item(0);
        //this.uploadService.uploadfile(file, url);
       // this.getUploadFileName();
        this.editSubject.courseId = this.editSubjectData.courseId;
        this.editSubject.name = this.editSubjectForm.value.editSubjectName;
        this.editSubject.semesterId = 0;
        this.editSubject.description = this.editSubjectForm.value.editSubjectDescription;
        this.editSubject.image = this.editSubjectData.image;
        this.editSubject.userId = this.userData.userId;
        this.editSubject.instituteId = this.userData.instituteId;
        this.editSubject.subjectTypeId = this.editSubjectData.subjectId;
        this.editSubject.maxMark = this.editSubjectForm.value.editTotalMarks;
        this.editSubject.passingMark = this.editSubjectForm.value.editPassingMarks;
        console.log("this.editSubject----"+JSON.stringify(this.editSubject))
    }

    editSubjectApi()
    {
        var edit_subejct_url = this.baseUrl + this.configFile.edit_subject_url;
        this.insmanagerService.editSubjectWithPromise(this.editSubject,edit_subejct_url)
            .then(resData => {
                console.log("subjectEdit======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.editModal.hide();
                    this.getAllSubjectList(this.editSubject.courseId);
                    this.toastr.success('', "Subject  edited successfully!. ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    getUploadFileName() {
        var FOLDER = this.userData.instituteId + '/subject/' + this.selectedDepartmentData.departmentId + '/' + this.selectedCourseData.courseId + "/";
        var devBucketURL = "https://insbetaresources.s3.ap-southeast-1.amazonaws.com/";
        /// var prodBucketURL = "http://insresources.s3.amazonaws.com/";
        var imagebaseUrL = 'https://betacontent.learnerguru.com/';
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
    getFileSize() {
        var fileSizeInBytes = 0;
        fileSizeInBytes = parseInt(this.chosenFileSize);
        var tempSize=0;
        if (fileSizeInBytes > 1024 * 1024) {
            var fileSizeInMB = fileSizeInBytes / 1024 / 1024;
            tempSize = Math.round(fileSizeInMB * 100) / 100 ////+ ' MB';
            this.chosenFileSize=tempSize.toString()+'MB';
        } else if (fileSizeInBytes > 1024) {
            var fileSizeInKB = fileSizeInBytes / 1024;
            tempSize = Math.round(fileSizeInKB * 100) / 100 /////+ ' KB';
            this.chosenFileSize=tempSize.toString()+'KB';
        } else {
            tempSize = fileSizeInBytes //; + ' Bytes';
            this.chosenFileSize=tempSize.toString()+'Bytes';
        }
    }


    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.departmentList = data.data;
                    this.desDepartmentData='';
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.localStorageService.get('deparmentInSubject') == '' || this.localStorageService.get('deparmentInSubject') == null) {
                        this.selectedDepartmentData = this.departmentList[0];
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    } else {
                        this.selectedDepartmentData = this.localStorageService.get('deparmentInSubject');
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    }
                    ///  console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
                        this.localStorageService.set('courseInSubject','');
                        this.getAllCourseList(this.selectedDepartmentData.departmentId);
                    }

                } else {
                    this.spinnerService.hide();
                    this.departmentList=[];
                    this.desDepartmentData = data.status.description;
                    this.toastr.error('', data.status.description);


                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCourseList(id):void {
        this.spinnerService.show();
        var course_all_get_url = this.baseUrl +this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', id);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    /// this.desSubjectData='';
                    this.spinnerService.hide();
                    this.courseList = data.data;
                   // console.log("courseList========" + JSON.stringify(this.courseList));

                    if (this.localStorageService.get('courseInSubject') == '' || this.localStorageService.get('courseInSubject') == null) {
                        this.selectedCourseData = this.courseList[0];
                        this.selectedCourseId = this.selectedCourseData.courseId;
                    } else {
                        this.selectedCourseData = this.localStorageService.get('courseInSubject');
                        this.selectedCourseId = this.selectedCourseData.courseId;
                    }
                    ///  console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.selectedCourseData != null || this.selectedCourseData != undefined) {

                        this.getAllSubjectList(this.selectedCourseData.courseId);
                    }



                } else {
                    try {
                        this.desSubjectData = 'No Subject Found';
                        this.courseList=[];
                        this.subjectList=[];
                    } catch (e) {
                    }
                    this.spinnerService.hide();
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        this.spinnerService.show();
        var get_all_subject_url = this.baseUrl + 'subject/{courseId}'
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    this.setDataSourceInList(this.subjectList);

                    console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.spinnerService.hide();
                    this.subjectList.length = 0;
                    this.desSubjectData = data.status.description;
                    this.setDataSourceInList(this.subjectList);
                    this.toastr.error('', data.status.description);

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

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) {
        return item.jobTitle;
    }


    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }
    getValueInDepartment(data) {
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.departmentId == data) {
                this.selectedDepartmentData = this.departmentList[i];
                this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                this.localStorageService.set("deparmentInSubject", this.selectedDepartmentData);
                break;
            }
        }
        if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
            this.localStorageService.set('courseInSubject','');
            this.getAllCourseList(this.selectedDepartmentData.departmentId);
        }

    }

    getValueInCourse(data) {
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.courseId == data) {
                this.selectedCourseData = this.courseList[i];
                this.selectedCourseId = this.selectedCourseData.courseId;
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));
                this.localStorageService.set("courseInSubject", this.selectedCourseData);
                break;
            }
        }
        if (this.selectedCourseData != null || this.selectedCourseData != undefined) {
            this.getAllSubjectList(this.selectedCourseData.courseId);
        }
    }
    goToEditNamePopUp(data):void {
        console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editName",data);
        this.editSubjectData=data;
        this.editModal.show();

    }
    goToConFirmSubjectDelete():void {
        var popupSubject = this.localStorageService.get("popupSubject");
        console.log("popupSubject=====" + JSON.stringify("popupSubject"));
        this.goToADeleteApiForSubject(popupSubject.subjectId)
    }

    goToADeleteApiForSubject(id) {
        var subject_delete_url = this.baseUrl + this.configFile.disable_subject;
        subject_delete_url = subject_delete_url.replace('{userId}', this.userData.userId.toString());
        subject_delete_url = subject_delete_url.replace('{subjectId}', id);
        console.log("subject_delete_url--"+subject_delete_url)
        this.insmanagerService.deleteSubjectWithPromise(subject_delete_url)
            .then(subjectData=> {
                var data = JSON.parse(JSON.stringify(subjectData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllSubjectList(this.selectedCourseData.courseId);
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }







    goToDeleteSubjectPopUp(data):void {
         console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupSubject",data);
        this.childModal.show();
        this.msgInPopup='Do you want to delete '+data.name;

    }
    goToViewSubjectPopUp(data):void {
        this.subjectData=data;
        this.url=data.image;
        this.viewModal.show();


    }

}


