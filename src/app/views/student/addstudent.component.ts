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
    MatTooltipModule,MatRadioModule,
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
import { StudentAdd } from './studentadd';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {AddStudent} from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { ConfigFile } from '../services/configfile';
@Component({
    selector: 'app-student',
    templateUrl: 'addstudent.component.html',
    styleUrls: ['./student.component.scss']

})
export class AddStudentComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addStudent = new AddStudent();
    departmentData = new Department();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    departmentList:Department [];
    courseList:GetCourse [];
    studentForm:FormGroup;
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
    genderDatas = [{'id': '1', 'name': 'Male'}, {'id': '2', 'name': 'Female'}];
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
        this.studentForm = this.formBuilder.group({
            stFirstName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            stAddress: ['', [Validators.required, Validators.minLength(5)]],
            stEmailId: ['', [Validators.required, ValidationService.emailValidator]],
            stContactPhone: ['', [Validators.required, Validators.minLength(10), , Validators.maxLength(15)]],
            //stFname: ['', [Validators.required, Validators.minLength(2), , Validators.maxLength(15)]],
            // stLname: ['', [Validators.required, Validators.minLength(2), , Validators.maxLength(15)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.studentForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.studentForm.invalid) {
            return;
        }

        if (this.gender_value == '' || this.gender_value == undefined || this.gender_value == null) {
            this.toastr.error('', "Choose gender");
            return;
        } else if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
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
        } else if (this.selectedFiles == undefined) {
            this.toastr.error('', "Choose Image ");
            return;
        }


        if (this.userData.lgUserMappingEntity.lgInstituteEntity.currentAcademicYearStatus == 0) {
            this.toastr.error('', "Please set the Acadamic Year. Then Only You can able to add Department");
        } else {
            this.assignStudentAddParams();
            console.log("parms====" + JSON.stringify(this.addStudent));
        }

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignStudentAddParams() {
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        this.addStudent.instituteId = this.userData.instituteId;
        this.addStudent.emailId = this.crypto.encryptByAES(this.studentForm.value.stEmailId.trim());
        this.addStudent.fName = this.crypto.encryptByAES(this.studentForm.value.stFirstName.trim());
        this.addStudent.lName = (this.stLastName == null || this.stLastName == undefined || this.stLastName == '') ? '' : this.crypto.encryptByAES(this.stLastName.trim());
        this.addStudent.gender = this.gender_value;
        this.addStudent.birthDate = '';
        this.addStudent.phone = this.studentForm.value.stContactPhone.trim();
        this.addStudent.profileImage = this.crypto.encryptByAES(this.uploadFileName);
        this.addStudent.location = '';
        this.addStudent.userType = INSTITUTE_TYPES.USER_TYPE_STUDENT;
        this.addStudent.countryCode = 'in';
        this.addStudent.dialCode = '+91';
        this.addStudent.latitude = 0;
        this.addStudent.longitude = 0;
        this.addStudent.address = this.crypto.encryptByAES(this.studentForm.value.stAddress.trim());
        this.addStudent.addedBy = this.userData.userId;
        this.addStudent.departmentId = this.selectedDepartmentData.departmentId;
        this.addStudent.courseId = this.selectedCourseData.courseId;
        this.addStudentApi();
    }

    getImageFileFolderName():string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + '/Student/';
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
                //    console.log("departmentList========" + JSON.stringify(this.departmentList));
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
                   /// console.log("courseList========" + JSON.stringify(this.courseList));
                } else {
                    this.courseList= [];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    addStudentApi():void {
        this.insmanagerService.addStudentWithPromise(this.addStudent)
            .then(studentAddData => {
                console.log("studentAddData======================" + JSON.stringify(studentAddData));
                var data = JSON.parse(JSON.stringify(studentAddData));
                if (data.status.success) {
                    this.toastr.success('', "Student added successfully! ");
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.router.navigate(['student/student-list']);
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
            if (this.departmentData.name.trim() == data.trim()) {
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
            if (this.courseData.name.trim() == data.trim()) {
                this.selectedCourseData = this.courseList[i];
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

            }

        }
    }

    goToReset()
    {

        this.chosenFileName="";
        this.chosenFileType="";
        this.chosenFileSize='';
        this.url = 'assets/img/no_image.png';
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