/**
 * Created by priya on 31/08/18.
 */
/**
 * Created by priya on 10/07/18.
 */
import {  NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { ModalDirective } from 'ngx-bootstrap';
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
import { ConfigFile } from '../services/configfile';
import { AddFeesType } from '../_models/AddFeesType';
import { GetFeesType } from '../_models/GetFeesType';
import { AddDepartment } from '../_models/AddDepartment';
import { Department } from '../_models/Department';
import {
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatStepperModule,
    MatNativeDateModule,
    MAT_DATE_FORMATS,

} from '@angular/material';

@Component({
    selector: 'app-fees',
    templateUrl: 'feetype.component.html',
    styleUrls: ['./fees.component.scss']

})
export class FeeTypeComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    configFile = new ConfigFile();
    addFeesType= new AddFeesType();
    feesTypeList :GetFeesType [] = [];
    feeTypeForm:FormGroup;

    uploadFileName = '';
    submitted = false;
    editSubmitted=false;
    desData = 'No Fees Type Found';
    public handleError;
    errorMessage:String;
    timer:any;
    msgInPopup='';
    departmentData = new Department();
    departmentEdit = new AddDepartment();
    editDepartmentData = new Department();
    selectedDepartmentData = null;
    desDepartmentData = 'No Department Found';
    departmentList:Department [];
    editDepartmentForm:FormGroup;
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
        this.feeTypeForm = this.formBuilder.group({
            feesType: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            feesAmount: ['', [Validators.required]]


        });

        this.getFeesTypeList();
        this.getAllDepartmentList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.feeTypeForm.controls;
    }
    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {

                    this.departmentList = data.data;
                    this.desDepartmentData = '';
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {

                    this.departmentList.length = 0;
                    this.desDepartmentData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.feeTypeForm.invalid) {
            return;
        }
        this.assignFeesTypeParams();

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }



  assignFeesTypeParams()
  {
      this.addFeesType.instituteId= this.userData.instituteId;
      this.addFeesType.amount=this.feeTypeForm.value.feesAmount;
      this.addFeesType.feeType=this.feeTypeForm.value.feesType;
      this.addFeesTypeApi();
  }

    addFeesTypeApi():void {
        this.insmanagerService.addFeesTypeWithPromise(this.addFeesType)
            .then(studentAddData => {
                console.log("studentAddData======================" + JSON.stringify(studentAddData));
                var data = JSON.parse(JSON.stringify(studentAddData));
                if (data.status.success) {
                    this.toastr.success('', "SuccessFully added");
                    this.getFeesTypeList();
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getFeesTypeList():void{
        this.feesTypeList=[];
        var feesType_get_url = this.baseUrl +this.configFile.getall_feestype_url;
        feesType_get_url = feesType_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getFeesListWithPromise(feesType_get_url)
            .then(diaryData=> {
                var data = JSON.parse(JSON.stringify(diaryData));
                if (data.status.success) {
                   this.desData='';
                   this.feesTypeList= data.data;
                  /////  console.log("Fees Type List----"+JSON.stringify(this.feesTypeList))
                } else {
                    this.desData='No Fees Type Found';
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToDeleteFeesType(data):void{
        console.log("data=====" + JSON.stringify(data));
        this.localStorageService.set("feesTypeDeleteData", data);
        this.msgInPopup = 'Do you want to delete ' + data.feeType;
        this.childModal.show();
}

    goToConFirmDelete():void {
        var feesTypeDeleteData = this.localStorageService.get("feesTypeDeleteData");
        console.log("feesTypeDeleteData=====" + JSON.stringify("feesTypeDeleteData"));
        this.goToADeleteApiForFeesType(feesTypeDeleteData.feeTypeId);
    }


    goToADeleteApiForFeesType(id) {
        var feesType_delete_url = this.baseUrl + this.configFile.disable_feetype;
        feesType_delete_url = feesType_delete_url.replace('{userId}', this.userData.userId.toString());
        feesType_delete_url = feesType_delete_url.replace('{feeTypeId}', id);
        console.log("feesType_delete_url--"+feesType_delete_url)
        this.insmanagerService.deleteFeesTypeWithPromise(feesType_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getFeesTypeList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToEditFeesTypePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editFeesType", data);

        this.editModal.show();

    }




    // convenience getter for easy access to form fields
    get e() {
        return this.feeTypeForm.controls;
    }

    onEditSubmit() {
        this.editSubmitted = true;
        // stop here if form is invalid
        if (this.feeTypeForm.invalid) {
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
    goToDeleteFeesTypePopUp(data):void {
        //console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("feesType", data);
        this.msgInPopup = 'Do you want to delete ' + data.amount;
        this.childModal.show();

    }

}


