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
import { AddProject } from '../_models/AddProject';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';

import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';

import { environment } from '../../../environments/environment';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { ConfigFile } from '../services/configfile';
import { InsManagerService } from '../services/insmanager.service';
import { GetSubject } from '../_models/GetSubject';


@Component({
    templateUrl: 'addproject.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./project.component.scss']
})
export class AddProjectComponent implements OnInit {
    configFile = new ConfigFile();
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    departmentData = new Department();
    courseData = new GetCourse();
    ProjectForm:FormGroup;
    uploadFileName = '';
    courseList:GetCourse [];
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = 0;
    selectedDepartmentData = null;
    selectedCourseData = null;
    baseUrl = environment.baseUrl;
    selectedAcadamicYearData = null;
    departmentList:Department [];
    selectedSubjectData = null;
    subjectList:GetSubject [];
    subjectData = new GetSubject();
    desSubjectData = '';
    selectedDepartmentId:number;
    selectedCourseId:number;
    // pic choosing variables
    addProject = new AddProject();
    timer:any;
    isConnected:Observable<boolean>;


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
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
        this.ProjectForm = this.formBuilder.group({
            ProjectName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            ProjectDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();


    }


    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.ProjectForm.invalid) {
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
        }
        this.assignProjectAddParams();


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
                    this.selectedDepartmentData = null;
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.courseList = [];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList():void {
        this.subjectList = [];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));
                    this.selectedCourseData = this.courseList[0];

                } else {
                    this.courseList = [];

                    this.selectedSubjectData = null;
                    this.selectedCourseData = null;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
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
                    console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

                }
            }

        }
    }


    // need to move common
    refresh():void {
        window.location.reload();
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

    getUploadFileName() {
        var FOLDER = this.getImageFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
    }

    getImageFileFolderName():string {
        var data;
        data = this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + "/Project/";
        return data;
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
        fileSizeInBytes = this.chosenFileSize;
        if (fileSizeInBytes > 1024 * 1024) {
            var fileSizeInMB = fileSizeInBytes / 1024 / 1024;
            this.chosenFileSize = Math.round(fileSizeInMB * 100) / 100 ////+ ' MB';
        } else if (fileSizeInBytes > 1024) {
            var fileSizeInKB = fileSizeInBytes / 1024;
            this.chosenFileSize = Math.round(fileSizeInKB * 100) / 100 /////+ ' KB';
        } else {
            this.chosenFileSize = fileSizeInBytes //; + ' Bytes';
        }
    }

    private assignProjectAddParams() {
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        /*this.addProject.ProjectName = this.ProjectForm.value.ProjectName.trim();
         this.addProject.ProjectDescription = this.ProjectForm.value.ProjectDescription.trim();*/
        console.log("params=====" + JSON.stringify(this.addProject));


    }


}
