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
import {EditStudent} from '../_models/EditStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { UserGetData} from '../_models/usergetdata';
import { ConfigFile } from '../services/configfile';
@Component({
    selector: 'app-student',
    templateUrl: 'editstudent.component.html',
    styleUrls: ['./student.component.scss']

})
export class EditStudentComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    editStudent = new EditStudent();
    editStudnetData=new UserGetData();
    departmentData = new Department();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    departmentList:Department [];
    courseList:GetCourse [];
    editStudentForm:FormGroup;
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
    gender_value:number;
    selectedDepartmentData = null;
    selectedCourseData = null;
    stContactPhone='';
    initialCountry='in';
    countryData=null;
    genderDatas = [{'id': '1', 'name': 'Male'}, {'id': '2', 'name': 'Female'}];
    timer:any;
    maleSelect=false;femaleSelect=false;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private uploadService:UploadFileService,
                public localStorageService:LocalStorageService,
                private insmanagerService:InsManagerService) {
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
        }

    }

    ngOnInit() {
        this.editStudentForm = this.formBuilder.group({
            fName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            studentQualification: ['', [Validators.required]],
            studentAddress: ['', [Validators.required, Validators.minLength(5)]],
            studentEmailId: ['', [Validators.required, ValidationService.emailValidator]],
        });

        this.editStudnetData= this.localStorageService.get("editStudentDatas");
        console.log("editStudnetData---"+JSON.stringify(this.editStudnetData))
        this.stLastName= this.editStudnetData.lName;
        this.stContactPhone= this.editStudnetData.phone;
        this.gender_value=this.editStudnetData.gender;
        if( this.gender_value==2)
        {
            this.femaleSelect=true;
        }else
        {
            this.maleSelect=true;
        }

        this.getAllDepartmentList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.editStudentForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.editStudentForm.invalid) {
            return;
        }

        if (this.userData.lgUserMappingEntity.lgInstituteEntity.currentAcademicYearStatus == 0) {
            this.toastr.error('', "Please set the Acadamic Year. Then Only You can able to add Department");
        } else {
            this.assignStudentEditParams();
            console.log("parms====" + JSON.stringify(this.editStudent));
        }

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignStudentEditParams() {
        //  var url=this. getImageFileFolderName();
        // const file = this.selectedFiles.item(0);
        // this.uploadService.uploadfile(file,url);
        //  this.getUploadFileName();
        this.editStudent.userId = this.editStudnetData.instituteId;
        this.editStudent.emailId = this.crypto.encryptByAES(this.editStudentForm.value.studentEmailId.trim());
        this.editStudent.fName = this.crypto.encryptByAES(this.editStudentForm.value.fName.trim());
        this.editStudent.lName  = (this.stLastName == null || this.stLastName == undefined || this.stLastName == '') ? '' : this.crypto.encryptByAES(this.stLastName.trim());
        this.editStudent.gender = this.gender_value;
        this.editStudent.birthDate = '';
        this.editStudent.phone = parseInt(this.stContactPhone.trim());
        this.editStudent.profileImage = this.crypto.encryptByAES(this.editStudnetData.profileImage);
        this.editStudent.location = '';
        this.editStudent.userType = INSTITUTE_TYPES.USER_TYPE_STUDENT;
        this.editStudent.countryCode = 'in';
        this.editStudent.dialCode = '91';
        if(this.countryData!=null)
        {   this.editStudent.countryCode = this.countryData.iso2;
            this.editStudent.dialCode = this.countryData.dialCode;

        }
        this.editStudent.latitude = 0;
        this.editStudent.longitude = 0;
        this.editStudent.address = this.crypto.encryptByAES(this.editStudentForm.value.studentAddress);
        this.editStudent.addedBy = this.userData.userId;
        this.editStudent.departmentId = this.editStudnetData.lgUserMappingEntity.lgdepartmentinfoEntity.departmentId;
        this.editStudent.courseId = 0;
        //this.editStudent.qualifications =this.crypto.encryptByAES(this.editStudentForm.value.studentQualification);
        this.editStudent.martialStatus = parseInt(this.editStudnetData.martialStatus);
        console.log("editStudent params======>"+JSON.stringify(this.editStudent));
        this.editStudentApi();
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

    editStudentApi():void {
        var edit_user_url = this.baseUrl + this.configFile.edit_user_url;
        this.insmanagerService.editStudentWithPromise(this.editStudent,edit_user_url)
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
    getNumber(data)
    {
        console.log("getNumber----"+data)
    }

    telInputObject(event: any)
    {
        console.log("telInputObject----"+event)
    }
    onCountryChange(data)
    {
        console.log("onCountryChange----"+JSON.stringify(data));
        this.countryData=data;
    }

    hasError: boolean;
    onError(obj) {
        this.hasError = obj;
        console.log('hasError: ', obj);
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