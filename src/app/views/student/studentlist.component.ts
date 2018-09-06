/**
 * Created by priya on 10/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,Pipe, PipeTransform,ViewChild} from '@angular/core';
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
import { StudentAdd } from './studentadd';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {AddStudent} from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { ConfigFile } from '../services/configfile';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
import { UserGetData } from '../_models/usergetdata';
import { FilterPipe} from '../services/FilterPipe';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
    selector: 'app-student',
    templateUrl: 'studentlist.component.html',
    styleUrls: ['./student.component.scss']

})
@NgModule({
    declarations:[FilterPipe],
    exports:[FilterPipe]
})

export class StudentListComponent implements OnInit {
    baseUrl = environment.baseUrl;
    crypto = new BasicCrptoCredentials();
    departmentData = new Department();
    getUserListParamData = new GetUserListParamData();
    departmentList:Department [];
    userTypeIdList:number[] = [];
    userGetDataList:UserGetData [] = [];
    courseData = new GetCourse();
    courseList:GetCourse [];
    configFile = new ConfigFile();
    userData = new UserGetData();
    errorMessage = String;
    desData = '';
    loggedUserData = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    maleCount = 0;
    femaleCount = 0;
    malePercentage = '';
    femalePercentage = '';
    malePercentageVal = 0;
    femalePercentageVal = 0;
    gender_value = '';
    searchText='';
    undefinedText = "X/uv7d/q3uQeLcu3AiAtpQ==";
    backgroundImage='../assets/img/search-icon.png';
    msgInPopup='';
    userDatas=new UserGetData();
    studentListForm:FormGroup;
    studentListEditForm:FormGroup;
    url = 'assets/img/no_image.png';
    genderDatas = [{'id': '1', 'name': 'Male'}, {'id': '2', 'name': 'FeMale'}, {'id': '3', 'name': 'Other'}];
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private spinnerService:Ng4LoadingSpinnerService,
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
            this.userDatas = this.localStorageService.get('userdata');
        }
    }

    ngOnInit() {
        this.studentListEditForm = this.formBuilder.group({
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
        this.userTypeIdList.push(INSTITUTE_TYPES.USER_TYPE_STUDENT);

        this.getAllDepartmentList();
    }


    // need to move common
    refresh():void {
        window.location.reload();
    }


    getAllDepartmentList():void {
        this.desData = 'No User Found'
        this.departmentList = [];
        this.courseList = [];
        this.userGetDataList = [];
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userDatas.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.selectedDepartmentData = null;
                    this.departmentList = data.data;
                    this.getAllCouseList( this.departmentList[0].departmentId);
                   /// console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.departmentList = [];
                    this.courseList = [];
                    this.userGetDataList = [];
                    this.desData = 'No User Found';
                    this.clearUserDatas();
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList(id):void {
        this.courseList = [];
        this.userGetDataList = [];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', id);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    this.selectedCourseData =  this.courseList[0];
                 ////   console.log("courseList========" + JSON.stringify(this.courseList));
                    this.assignStudentListParams(this.selectedDepartmentData.departmentId,this.courseList[0].courseId);
                    this.getAllStudnetList();
                } else {
                    this.clearUserDatas();
                    this.courseList = [];
                    this.userGetDataList = [];
                    this.desData = 'No User Found'
                    if( this.selectedDepartmentData!=null) {
                        this.toastr.error('', data.status.description);
                    }

                }
            },
                error => this.errorMessage = <any>error);
    }



    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name == data) {
                this.selectedDepartmentData = this.departmentList[i];
                console.log(" this.selectedDepartmentData ===================" + JSON.stringify(this.selectedDepartmentData));
                this.getAllCouseList(this.selectedDepartmentData.departmentId);
            }

        }
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.name == data) {
                this.selectedCourseData = this.courseList[i];
                console.log(" this.selectedCourseData ======================" + JSON.stringify(this.selectedCourseData));
                this.assignStudentListParams(this.selectedDepartmentData.departmentId,this.selectedCourseData.courseId);
                this.getAllStudnetList();

            }

        }
    }

    private assignStudentListParams(departmentId,courseId) {
        this.getUserListParamData.instituteId = 1;
        this.getUserListParamData.userTypeId = this.userTypeIdList;
        this.getUserListParamData.courseId = 0;
        this.getUserListParamData.departmentId=(this.selectedDepartmentData == null)?0:departmentId;
        this.getUserListParamData.courseId =(this.selectedCourseData == null)? 0 : courseId;
        this.getUserListParamData.subjectId = 0;

    }

    // all userlist getting
    getAllStudnetList():void {
        this.userGetDataList=[];
        this.desData = 'No User Found'
        console.log("params for studnet list----"+JSON.stringify(this.getUserListParamData));
        this.insmanagerService.getUserListWithPromise(this.getUserListParamData)
            .then(userListData=> {
                var data = JSON.parse(JSON.stringify(userListData));
                if (data.status.success) {
                    this.userGetDataList = this.getDecryptedDatas(data.data);
                    this.desData = '';
                } else {
                   this.clearUserDatas();
                    this.desData = data.status.description;
                    this.userGetDataList=[];
                }
            },
                error => this.errorMessage = <any>error);
    }

    clearUserDatas()
    {
        this.maleCount = 0;
        this.femaleCount = 0;
        this.malePercentage = '';
        this.femalePercentage = '';
        this.malePercentageVal = 0;
        this.femalePercentageVal = 0;
    }


    getDecryptedDatas(data) {

        this.maleCount = 0;
        this.femaleCount = 0;
        this.malePercentage = '';
        this.femalePercentage = '';
        this.malePercentageVal = 0;
        this.femalePercentageVal = 0;
        data.forEach((key:any, val:any) => {
            this.userData = key;
            this.userData.userName = (this.userData.userName != null || this.userData.userName != undefined || this.userData.userName != '') ? this.crypto.decryptByAES(this.userData.userName) : '';
            this.userData.profileImage = (this.userData.profileImage == null || this.userData.profileImage == undefined || this.userData.profileImage == '') ? '' : this.crypto.decryptByAES(this.userData.profileImage);
            this.userData.emailId = (this.userData.emailId == null || this.userData.emailId == undefined || this.userData.emailId == '') ? '' : this.crypto.decryptByAES(this.userData.emailId);
            this.userData.fName = (this.userData.fName == null || this.userData.fName == undefined || this.userData.fName == '') ? '' : this.crypto.decryptByAES(this.userData.fName);
            this.userData.lName = (this.userData.lName == null || this.userData.lName == undefined || this.userData.lName == '') ? '' : this.crypto.decryptByAES(this.userData.lName);
            this.userData.location = (this.userData.location == null || this.userData.location == undefined || this.userData.location == '') ? '' : this.crypto.decryptByAES(this.userData.location);
            this.userData.address = (this.userData.address == null || this.userData.address == undefined || this.userData.address == '') ? '' : this.crypto.decryptByAES(this.userData.address);
            this.userData.displayName = this.userData.userName;
            if (this.userData.lName == '') {
                if (this.userData.fName == '') {
                    if (this.userData.userName != '') {
                        this.userData.displayName = this.userData.userName;
                    }
                } else {
                    this.userData.displayName = this.userData.fName;
                }
            }
            if (this.userData.gender == 1) {
                this.maleCount++;
            }
            if (this.userData.gender == 2) {
                this.femaleCount++;
            }
            this.userGetDataList.push(this.userData);
        })

        this.malePercentageVal = (this.maleCount / (this.maleCount + this.femaleCount));
        this.femalePercentageVal = (this.femaleCount / (this.maleCount + this.femaleCount));

        this.malePercentage = Math.round((this.malePercentageVal * 100)) + "%";
        this.femalePercentage = Math.round(( this.femalePercentageVal * 100)) + "%";
        ///  console.log("======="+JSON.stringify(this.userGetDataList))
        // console.log("maleCount=======" + this.maleCount + "==" + this.malePercentage)
        // console.log("femaleCount=======" + this.femaleCount + "==" + this.femalePercentage);

        ///  console.log("userGetDataList-----============--------------"+JSON.stringify(this.userGetDataList));
        return this.userGetDataList;
    }
    getValue(data) {
        console.log("data====" + data.name)
        console.log("id====" + data.id);
        this.gender_value = data.id;
    }


    getWidhSizeInMale() {
        return this.malePercentage;
    }

    getWidhSizeInFeMale() {
        return this.femalePercentage;
    }
    goToEditUserNamePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editStudentDatas", data);
        this.router.navigate(['/student/edit-student']);
    }



    goToConFirmDelete():void {
        var popupStudentData = this.localStorageService.get("popupStudentData");
        console.log("popupStudentData=====" + popupStudentData);
        this.goToADeleteApiForStudent(popupStudentData.userId)
    }
    goToADeleteApiForStudent(id) {
        var student_delete_url = this.baseUrl + this.configFile.disable_staff;
        student_delete_url = student_delete_url.replace('{userId}', this.userDatas.userId.toString());
        student_delete_url = student_delete_url.replace('{staffId}', id);
        this.insmanagerService.deleteStaffStudentWithPromise(student_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllStudnetList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToDeleteStudentPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupStudentData", data);
        this.msgInPopup = 'Do you want to delete ' + data.fName + data.lName;
        this.childModal.show();

    }


    goToViewUserPopUp(data):void{
        this.userData= data;
        this.url=data.profileImage;
        this.viewModal.show();
    }

}


//need to move common
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


