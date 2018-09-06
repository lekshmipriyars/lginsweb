/**
 * Created by priya on 10/07/18.
 */
import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild,Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { ModalDirective } from 'ngx-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';

import { PermissionService } from './../permission.service';
import { Permission } from './../permission';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { StaffService } from './staff.service';
import {content_file_type_extension} from '../services/configfile';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { Department } from '../_models/Department';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
import { UserGetData } from '../_models/usergetdata';
import { EditStaffComponent } from './editstaff.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FilterPipe} from '../services/FilterPipe';
import { GetAcadamicYearData } from '../_models/GetAcadamicYearData';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { ConfigFile } from '../services/configfile';
import { AddStaff } from '../_models/AddStaff';
import { DataTableResource } from 'angular4-smart-table';

@Component({
    templateUrl: 'stafflist.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./staff.component.scss']
})
@NgModule({
    declarations: [FilterPipe],
    exports: [FilterPipe]
})

export class StaffListComponent {
    baseUrl = environment.baseUrl;
    crypto = new BasicCrptoCredentials();
    configFile = new ConfigFile();
    staffAdd = new AddStaff();
    departmentData = new Department();
    getUserListParamData = new GetUserListParamData();
    departmentList:Department [];
    userTypeIdList:number[] = [];
    userGetDataList:UserGetData [] = [];
    userData = new UserGetData();
    errorMessage = String;
    desData = '';
    selectedDepartmentData = null;
    selectedDepartmentId = 0;
    maleCount = 0;
    femaleCount = 0;
    malePercentage = '';
    femalePercentage = '';
    malePercentageVal = 0;
    femalePercentageVal = 0;
    selectedPermissionDataList:number[] = [];
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    examTypeList = '';
    permission = '';
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    gender_value = '';
    backgroundImage = '../assets/img/search-icon.png';
    staffListEditForm:FormGroup;
    searchText = '';
    msgInPopup = '';
    userDatas = new UserGetData();
    genderDatas = [{'id': '1', 'name': 'Male'}, {'id': '2', 'name': 'FeMale'}, {'id': '3', 'name': 'Other'}];
    itemResource = new DataTableResource(this.userGetDataList);
    items = [];
    itemCount = 0;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;
    isConnected:Observable<boolean>;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
                private spinnerService:Ng4LoadingSpinnerService,
                private staffService:StaffService,
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
        this.staffListEditForm = this.formBuilder.group({
            stFirstName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            staffQualification: ['', [Validators.required]],
            staffAddress: ['', [Validators.required, Validators.minLength(5)]],
            staffEmailId: ['', [Validators.required, ValidationService.emailValidator]],
            staffContactPhone: ['', [Validators.required, Validators.minLength(10), , Validators.maxLength(15)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    // all department getting
    getAllDepartmentList():void {
        this.departmentList = [];
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userDatas.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    if (this.localStorageService.get('deparmentInStaff') == '' || this.localStorageService.get('deparmentInStaff') == null) {
                        this.selectedDepartmentData = this.departmentList[0];
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    } else {
                        this.selectedDepartmentData = this.localStorageService.get('deparmentInStaff');
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    }
                    this.assignUserListParams(this.selectedDepartmentId);
                    this.getAllIUsersList();
                    ////    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    //department selection code
    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.departmentId == data) {
                this.selectedDepartmentData = this.departmentList[i];
                this.localStorageService.set('deparmentInStaff', this.selectedDepartmentData)
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
            }

        }
        this.assignUserListParams(this.selectedDepartmentData.departmentId);
        this.getAllIUsersList();
    }

    private assignUserListParams(departmentId) {
        this.userTypeIdList = [];
        this.userTypeIdList.push(INSTITUTE_TYPES.USER_TYPE_STAFF);
        this.getUserListParamData.instituteId = this.userData.instituteId;
        this.getUserListParamData.userTypeId = this.userTypeIdList;
        this.getUserListParamData.courseId = 0;
        this.getUserListParamData.departmentId = (this.selectedDepartmentData == null) ? 0 : departmentId
        this.getUserListParamData.subjectId = 0;
        console.log("getUserListParamData=====" + JSON.stringify(this.getUserListParamData))
    }


    // all userlist getting
    getAllIUsersList():void {
        this.userGetDataList = [];  // for array clear
        this.insmanagerService.getUserListWithPromise(this.getUserListParamData)
            .then(userListData=> {
                var data = JSON.parse(JSON.stringify(userListData));
                if (data.status.success) {
                    console.log("userGetDataList========" + JSON.stringify(data.data));
                    this.userGetDataList = this.getDecryptedDatas(data.data);
                    this.desData = '';
                    this.setDataSourceInList(this.userGetDataList);
                } else {
                    this.maleCount = 0;
                    this.femaleCount = 0;
                    this.malePercentage = '';
                    this.femalePercentage = '';
                    this.malePercentageVal = 0;
                    this.femalePercentageVal = 0;
                    this.desData = data.status.description;
                    this.setDataSourceInList(this.userGetDataList);
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
            this.userData.qualification = (this.userData.qualification == null || this.userData.qualification == undefined || this.userData.qualification == '') ? '' : this.crypto.decryptByAES(this.userData.qualification);
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
        this.localStorageService.set("editUserName", data);

        this.editModal.show();

    }

    goToConFirmDelete():void {
        var popupStaffData = this.localStorageService.get("popupStaffData");
        console.log("drwnDepartment=====" + JSON.stringify("popupStaffData"));
        this.goToADeleteApiForStaff(popupStaffData.userId)
    }

    goToADeleteApiForStaff(id) {
        var staff_delete_url = this.baseUrl + this.configFile.disable_staff;
        staff_delete_url = staff_delete_url.replace('{userId}', this.userDatas.userId.toString());
        staff_delete_url = staff_delete_url.replace('{staffId}', id);
        this.insmanagerService.deleteStaffStudentWithPromise(staff_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllIUsersList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToDeleteStaffPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupStaffData", data);
        this.msgInPopup = 'Do you want to delete ' + data.fName + data.lName;
        this.childModal.show();

    }

    goToViewUserPopUp(data):void {
        this.userData = data;
        this.url = data.profileImage;
        this.viewModal.show();
    }

    goToEditStaff(data) {
        this.localStorageService.set("editStaffDatas", data);
        this.router.navigate(['/staff/edit-staff']);
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