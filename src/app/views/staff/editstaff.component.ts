/**
 * Created by priya on 17/07/18.
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
    MatTooltipModule,MatRadioModule
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
import { AddStaff } from '../_models/AddStaff';
import { StaffService } from './staff.service';
import {content_file_type_extension} from '../services/configfile';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { Designation } from '../_models/Designation';
import { Department } from '../_models/Department';
import { ConfigFile } from '../services/configfile';
import { UserGetData} from '../_models/usergetdata';
import { EditStaff} from '../_models/EditStaff';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { environment } from '../../../environments/environment';
import { InsManagerService } from '../services/insmanager.service';


@Component({
    templateUrl: 'editstaff.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./staff.component.scss']
})

export class EditStaffComponent {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    editStaff = new EditStaff();
    permissionData = new Permission();
    designationData = new Designation();
    departmentData = new Department();
    configFile=new ConfigFile();
    permissionList:Permission [];
    designationList:Designation [];
    departmentList:Department [];
    editStaffData=new UserGetData();
    editStaffForm:FormGroup
    selectedPermissionDataList:number[] = [];
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    examTypeList='';
    errorMessage:String;
    permission='';
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    gender_value:number;
    selectedMartialStatus = null;
    selectedPermissionData = null;
    selectedDesignationData = null;
    selectedDepartmentData = null;
    genderDatas = [{'id': '1', 'name': 'Male',"checked":true}, {'id': '2', 'name': 'Female',"checked":false}];
    martialDatas = [{'id': '1', 'name': 'Married'}, {'id': '2', 'name': 'UnMarried'}];
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    selectedItems1 = [];
    dropdownSettings1 = {};
    selectedPermissionLists=[];
    skills=[];
    stLastName='';
    staffContactPhone='';
    initialCountry='in';
    countryData=null;
    timer:any;
    onAllSelect=false;
    maleSelect=false;femaleSelect=false;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
                private insmanagerService:InsManagerService,
                private staffService:StaffService) {
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');


        }

    }

    ngOnInit() {

        this.editStaffForm = this.formBuilder.group({
            fName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            staffQualification: ['', [Validators.required]],
            staffAddress: ['', [Validators.required, Validators.minLength(5)]],
            staffEmailId: ['', [Validators.required, ValidationService.emailValidator]],
        });


        this.editStaffData= this.localStorageService.get("editStaffDatas");
        console.log("edit Staff Data---"+JSON.stringify(this.editStaffData))
        this.stLastName= this.editStaffData.lName;
        this.staffContactPhone= this.editStaffData.phone;
        this.gender_value=this.editStaffData.gender;
        if( this.gender_value==2)
        {
            this.femaleSelect=true;
        }else
        {
            this.maleSelect=true;
        }
       ///// this.editStaffForm.setValue(fName,this.editStaffData.fName);
        ///api calls checking purpose this code added
        //// this.getStaffList();
        this.getPermissionList();
        this.getAllDepartmentList();
        this.getAllDesignationList();
        this.dropdownList = [
            { item_id: 1, item_text: 'ADD_DEPARTMENT' },
            { item_id: 2, item_text: 'EDIT_DEPARTMENT' },
            { item_id: 3, item_text: 'VIEW_DEPARTMENT' },
            { item_id: 4, item_text: 'REMOVE_DEPARTMENT' },
            { item_id: 5, item_text: 'ADD_COURSE' },
            { item_id: 6, item_text: 'EDIT_COURSE' },
            { item_id: 7, item_text: 'VIEW_COURSE' },
            { item_id: 8, item_text: 'REMOVE_COURSE' },
            { item_id: 9, item_text: 'ADD_SUBJECT' },
            { item_id: 10, item_text: 'EDIT_SUBJECT' },
            { item_id: 11, item_text: 'VIEW_SUBJECT' },
            { item_id: 12, item_text: 'REMOVE_SUBJECT' },
            { item_id: 13, item_text: 'ADD_CHAPTER' },
            { item_id: 14, item_text: 'EDIT_CHAPTER' },
            { item_id: 15, item_text: 'VIEW_CHAPTER' },
            { item_id: 16, item_text: 'DELETE_CHAPTER' },
            { item_id: 17, item_text: ' ADD_STUDENT' },
            { item_id: 18, item_text: ' EDIT_STUDENT     ' },
            { item_id: 19, item_text: 'REMOVE_STUDENT ' },
            { item_id: 20, item_text: 'VIEW_STUDENT' },
            { item_id: 21, item_text: 'ADD_STAFF' },
            { item_id: 22, item_text: 'VIEW_STAFF' },
            { item_id: 23, item_text: 'EDIT_STAFF' },
            { item_id: 24, item_text: 'REMOVE_STAFF' },
            { item_id: 25, item_text: 'ADD_PERMISSION' },
            { item_id: 26, item_text: 'EDIT_PERMISSION' },
            { item_id: 27, item_text: 'VIEW_PERMISSION' },
            { item_id: 28, item_text: 'REMOVE_PERMISSION' },
            { item_id: 29, item_text: 'ADD_EVENT' },
            { item_id:30 , item_text: 'EDIT_EVENT' },
            { item_id: 31, item_text: 'VIEW_EVENT' },
            { item_id: 32, item_text: 'REMOVE_EVENT' },
            { item_id:33 , item_text: 'ADD_EXAM' },
            { item_id: 34, item_text: 'EDIT_EXAM' },
            { item_id: 35, item_text: 'VIEW_EXAM' },
            { item_id: 36, item_text: 'REMOVE_EXAM' },
            { item_id:37 , item_text: 'ADD_ATTENDANCE' },
            { item_id: 38, item_text: 'EDIT_ATTENDANCE' },
            { item_id:39 , item_text: 'VIEW_ATTENDANCE' },
            { item_id:40 , item_text: 'REMOVE_ATTENDANCE' },
            { item_id: 41, item_text: 'ADD_QUESTION' },
            { item_id: 42, item_text: 'EDIT_QUESTION' },
            { item_id: 43, item_text: 'VIEW_QUESTION' },
            { item_id: 44, item_text: 'REMOVE_QUESTION' },
            { item_id: 45, item_text: 'ADD_HOMEWORK' },
            { item_id:46 , item_text: 'EDIT_HOMEWORK' },
            { item_id: 47, item_text: 'VIEW_HOMEWORK' },
            { item_id: 48, item_text: 'REMOVE_HOMEWORK' },
            { item_id: 49, item_text: 'ADD_ASSIGNMENT' },
            { item_id: 50, item_text: 'EDIT_ASSIGNMENT' },
            { item_id: 51, item_text: 'VIEW_ASSIGNMENT' },
            { item_id: 52, item_text: 'REMOVE_ASSIGNMENT' },
            { item_id: 53, item_text: 'ADD_MARK' },
            { item_id: 54, item_text: 'EDIT_MARK' },
            { item_id: 55, item_text: 'VIEW_MARK' },
            { item_id: 56, item_text: 'REMOVE_MARK' },
            { item_id: 57, item_text: 'ADD_BOOK' },
            { item_id: 58, item_text: 'EDIT_BOOK' },
            { item_id:59 , item_text: 'VIEW_BOOK' },
            { item_id: 60, item_text: 'REMOVE_BOOK' },
            { item_id: 61, item_text: 'ADD_TIMETABLE' },
            { item_id: 62, item_text: 'EDIT_TIMETABLE' },
            { item_id: 63, item_text: 'REMOVE_TIMETABLE' },
            { item_id: 64, item_text: 'VIEW_TIMETABLE' },
            { item_id: 65, item_text: 'RESET_ALL_PASSWORD' },
            { item_id: 66, item_text: 'RESET_PASSWORD' },
            { item_id: 67, item_text: 'ADD_PARENT' },
            { item_id: 68, item_text: 'EDIT_PARENT' },
            { item_id: 69, item_text: 'VIEW_PARENT' },
            { item_id: 70, item_text: 'REMOVE_PARENT' }
        ];
        /*   this.selectedItems = [
         { item_id: 3, item_text: 'View Department' },
         { item_id: 4, item_text: 'Remove Department' }
         ];*/
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };


    }

    // convenience getter for easy access to form fields
    get f() {
        return this.editStaffForm.controls;
    }
    onItemSelect(item:any){
        this.onAllSelect=false;
        console.log(item);

        this.selectedItems.push(item);
        console.log("========"+this.selectedItems);
    }
    OnItemDeSelect(item:any){
        this.onAllSelect=false;
        var index;
        for (var i = 0; i < this.selectedItems.length; i++) {
            if(item.item_id==this.selectedItems[i].item_id){
                index=i;
                console.log("index==="+index);
            }
        }
        if (index > -1) {
            this.selectedItems.splice(index, 1);
        }
        console.log(item);
        console.log("========"+this.selectedItems);
        ///this.selectedItems.remove(item)
    }
    onSelectAll(items: any){
        // need to  be fix
        this.selectedPermissionLists=[];
        this.selectedItems=[];
        console.log(items);
        this.selectedItems.push(items);
        this.onAllSelect=true;
    }
    onDeSelectAll(items: any){
        this.selectedItems=[];
        console.log(items);
        this.onAllSelect=false;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.editStaffForm.invalid) {
            return;
        }
        console.log("this.selectedItems==="+JSON.stringify( this.selectedItems))
        if(this.staffContactPhone=='')
        {
            this.toastr.error('', "Enter Phone No");
            return;
        }

        if (this.userData.lgUserMappingEntity.lgInstituteEntity.currentAcademicYearStatus == 0) {
            this.toastr.error('', "Please set the Acadamic Year. Then Only You can able to add Department");
        } else {
            this.assignstaffEditParams();
            console.log("parms====" + JSON.stringify(this.editStaff));
        }

    }


    getPermissionIds(data) {
        this.selectedPermissionLists=[];
        for(let i=0; i<data.length; i++){
            this.selectedPermissionLists.push(data[i].item_id)
        }
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    getImageFileFolderName():string {
        return this.userData.instituteId+'/Department/'+this.selectedDepartmentData.departmentId+'/Staff/';
    }

    private assignstaffEditParams() {
      //  var url=this. getImageFileFolderName();
       // const file = this.selectedFiles.item(0);
       // this.uploadService.uploadfile(file,url);
      //  this.getUploadFileName();
        this.editStaff.userId = this.editStaffData.instituteId;
        this.editStaff.emailId = this.crypto.encryptByAES(this.editStaffForm.value.staffEmailId.trim());
        this.editStaff.fName = this.crypto.encryptByAES(this.editStaffForm.value.fName.trim());
        this.editStaff.lName  = (this.stLastName == null || this.stLastName == undefined || this.stLastName == '') ? '' : this.crypto.encryptByAES(this.stLastName.trim());
        this.editStaff.gender = this.gender_value;
        this.editStaff.birthDate = '';
        this.editStaff.phone = parseInt(this.staffContactPhone.trim());
        this.editStaff.profileImage = this.crypto.encryptByAES(this.editStaffData.profileImage);
        this.editStaff.location = '';
        this.editStaff.userType = INSTITUTE_TYPES.USER_TYPE_STAFF;
        this.editStaff.countryCode = 'in';
        this.editStaff.dialCode = '91';
        if(this.countryData!=null)
        {   this.editStaff.countryCode = this.countryData.iso2;
            this.editStaff.dialCode = this.countryData.dialCode;

        }
        this.editStaff.latitude = 0;
        this.editStaff.longitude = 0;
        this.editStaff.address = this.crypto.encryptByAES(this.editStaffForm.value.staffAddress);
        this.editStaff.addedBy = this.userData.userId;
        this.editStaff.desiginationId =this.editStaffData.lgUserMappingEntity.lgdesignationEntity.designationId/*.designationId*/;
        this.editStaff.departmentId = this.editStaffData.lgUserMappingEntity.lgdepartmentinfoEntity.departmentId;
        this.editStaff.courseId = 0;
     ///   this.editStaff.permissionList = this.editStaffData.;
        this.editStaff.qualifications =this.crypto.encryptByAES(this.editStaffForm.value.staffQualification);
        this.editStaff.martialStatus = parseInt(this.editStaffData.martialStatus);

        console.log("editstaff params======>"+JSON.stringify(this.editStaff))
        this.editStaffApi();

    }

    getUploadFileName() {
        var FOLDER = this.getImageFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
    }



    getPermissionList():void {
        this.staffService.getAllPermissionWithPromise(this.userData.instituteId)
            .then(permissionData=> {
                var data = JSON.parse(JSON.stringify(permissionData));
                if (data.status.success) {
                    this.permissionList = data.data;
                    /////// console.log("permissionList====" + JSON.stringify(this.permissionList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllDesignationList():void {
        this.staffService.getAllDesignationWithPromise(this.userData.instituteId)
            .then(designationtData=> {
                var data = JSON.parse(JSON.stringify(designationtData));
                if (data.status.success) {
                    this.designationList = data.data;
                    //   console.log("designationList========" + JSON.stringify(this.designationList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                   //// console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    editStaffApi():void {
        var edit_user_url = this.baseUrl + this.configFile.edit_user_url;
        this.insmanagerService.editStaffWithPromise(this.editStaff,edit_user_url)
            .then(resData => {
                console.log("resdata======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.toastr.success('', "Edit Staff successfully!. ");
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.router.navigate(['staff/staff-list']);
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
    getValue(data) {
        console.log("data====" +data)
        this.gender_value = data;
    }

    getValueInMartialStatus(data) {
        this.selectedMartialStatus = null;
        for (var i = 0; i < this.martialDatas.length; i++) {
            if (this.martialDatas[i].name == data) {
                this.selectedMartialStatus = this.martialDatas[i];
            }
        }

    }

    getValueInPermission(data) {
        this.selectedPermissionData = null;
        for (var i = 0; i < this.permissionList.length; i++) {
            this.permissionData = this.permissionList[i];
            if (this.permissionData.permissionName == data) {
                this.selectedPermissionData = this.permissionList[i];
                this.selectedPermissionDataList.push( this.selectedPermissionData.permissionId)
                console.log(" this.selectedPermissionData=====" + JSON.stringify(this.selectedPermissionDataList));
            }

        }
    }

    getValueInDesignation(data) {
        this.selectedDesignationData = null;
        for (var i = 0; i < this.designationList.length; i++) {
            this.designationData = this.designationList[i];
            if (this.designationData.designation == data) {
                this.selectedDesignationData = this.designationList[i];
                console.log(" this.selectedDesignationData=====" + JSON.stringify(this.selectedDesignationData));
            }

        }
    }

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name.trim() == data.trim()) {
                this.selectedDepartmentData = this.departmentList[i];
                this.localStorageService.set('deparmentInStaff', this.selectedDepartmentData)
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
            }

        }
    }

    goToReset()
    {
        this.chosenFileName="";
        this.chosenFileType="";
        this.chosenFileSize='';
        this.url = 'assets/img/no_image.png';
        this.onAllSelect=false
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