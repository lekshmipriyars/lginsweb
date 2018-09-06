/**
 * Created by priya on 11/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { PermissionService } from './../permission.service';
import { Permission } from './../permission';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { LoggerService } from '../services/logger.service';
import { Department } from '../_models/Department';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { GetAcadamicYearData } from '../_models/GetAcadamicYearData';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FilterPipe} from '../services/FilterPipe';
import { AddDepartment } from '../_models/AddDepartment';
import { DataTableResource } from 'angular4-smart-table';

@Component({
    templateUrl: 'departmentlist.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./department.component.scss']
})
@NgModule({
    declarations: [FilterPipe],
    exports: [FilterPipe]
})

export class DepartmentListComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    departmentList:Department [];
    departmentData = new Department();
    departmentEdit = new AddDepartment();
    editDepartmentData = new Department();
    editDepartmentForm:FormGroup;
    editSubmitted = false;
    public handleError;
    errorMessage:String;
    desData = '';
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    uploadFileName = '';
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    desDepartmentData = 'No Department Found';
    msgInPopup = "";
    msgInDeletePopup = '';
    backgroundImage = '../assets/img/search-icon.png';
    isConnected:Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;





    itemResource = new DataTableResource(this.departmentList);
    items = [];
    itemCount = 0;


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private spinnerService:Ng4LoadingSpinnerService,
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
        this.editDepartmentForm = this.formBuilder.group({
            editDepartmentName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            editDepartmentDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],

        });

        this.getAllDepartmentList();

    }

    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) {
        return item.jobTitle;
    }


    // need to move common
    refresh():void {
        window.location.reload();
    }

    // convenience getter for easy access to form fields
    get e() {
        return this.editDepartmentForm.controls;
    }

    onEditSubmit() {
        this.editSubmitted = true;
        // stop here if form is invalid
        if (this.editDepartmentForm.invalid) {
            return;
        }
        this.assignDepartmentEditParams();

    }

    private assignDepartmentEditParams() {
        // var url = this.userData.instituteId + '/Department/';
        //const file = this.selectedFiles.item(0);
        //  this.uploadService.uploadfile(file, url);
        //this.getUploadFileName();
        this.departmentEdit.instituteId = this.userData.instituteId;
        this.departmentEdit.name = this.editDepartmentForm.value.editDepartmentName;
        this.departmentEdit.departmentImage = this.editDepartmentData.departmentImage;
        this.departmentEdit.departmentDescription = this.editDepartmentForm.value.editDepartmentDescription;
        this.departmentEdit.userId = this.userData.userId;
        this.departmentEdit.userType = this.userData.userType;
        console.log("department params=====" + JSON.stringify(this.departmentEdit));
        this.editDepartmentApi();
    }

    editDepartmentApi():void {
        var edit_dept_url = this.baseUrl + this.configFile.edit_dept_url;
        edit_dept_url = edit_dept_url.replace('{departmentId}', this.editDepartmentData.departmentId.toString());
        this.insmanagerService.editDepartmentWithPromise(this.departmentEdit, edit_dept_url)
            .then(resData => {
                console.log("departmentEdit======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.editModal.hide();
                    this.getAllDepartmentList();
                    this.toastr.success('', "Department type edited successfully!. ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getUploadFileName() {
        var FOLDER = this.userData.instituteId + '/Department/'
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


    // all department getting
    getAllDepartmentList():void {
        this.spinnerService.show();
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.departmentList = data.data;
                    this.desDepartmentData = '';
                    this.setDataSourceInList(this.departmentList);
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.spinnerService.hide();
                    this.departmentList=[];
                    this.setDataSourceInList(this.departmentList);
                    this.desDepartmentData = data.status.description;
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


    goToEditNamePopUp(data):void {
        console.log("data=====" + JSON.stringify(data));
        this.localStorageService.set("editName", data);
        this.editDepartmentData = data;
        this.editModal.show();

    }

    goToConFirmDelete():void {
        var popupdepartment = this.localStorageService.get("popupdepartment");
        console.log("popupdepartment=====" + JSON.stringify("popupdepartment"));
        this.goToADeleteApiForDepartment(popupdepartment.departmentId);
    }

    goToADeleteApiForDepartment(id) {
        var department_delete_url = this.baseUrl + this.configFile.disable_dept;
        department_delete_url = department_delete_url.replace('{userId}', this.userData.userId.toString());
        department_delete_url = department_delete_url.replace('{departmentId}', id);
        this.insmanagerService.deleteDepartmentWithPromise(department_delete_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllDepartmentList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToDeleteDepartmentPopUp(data):void {
        console.log("deltePopup data=====" + JSON.stringify(data));
        this.localStorageService.set("popupdepartment", data);
        this.msgInDeletePopup = 'Do you want to delete ' + data.name;
        this.childModal.show();
    }

    goToViewDepartmentPopUp(data):void {
        this.departmentData = data;
        this.url = data.departmentImage;
        this.viewModal.show();
    }
}