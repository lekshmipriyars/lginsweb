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
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { UserData } from '../../views/login/userdata';
import { AddSubjectType } from '../_models/AddSubjectType';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { ConfigFile } from '../services/configfile';
import  {GetSubjectType} from '../_models/GetSubjectType';
import  {EditSubjectType} from '../_models/EditSubjectType';
@Component({
    templateUrl: 'subjecttypeadd.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class SubjectTypeAddComponent {
    userData = new UserData();
    subjectTypeForm:FormGroup;
    editSubjectTypeForm:FormGroup;
    configFile = new ConfigFile();
    baseUrl = environment.baseUrl;
    getSubjectTypeData= new GetSubjectType();
    editSubjectType= new EditSubjectType();
    submitted = false;
    editSubmitted = false;
    data = '';
    public handleError;
    subjectTypeList = '';
    errorMessage:String;
    crypto = new BasicCrptoCredentials();
    subjectTypeAdd = new AddSubjectType();
    desData = '';
    msgInPopup = '';
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private insmanagerService:InsManagerService,
                public localStorageService:LocalStorageService) {
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

        this.subjectTypeForm = this.formBuilder.group({
            subjectType: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.editSubjectTypeForm=this.formBuilder.group({
            editSubjectType: ['', [Validators.required, Validators.minLength(3)]]
        });
        ///api calls checking purpose this code added
        this.getSubjectTypeList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.subjectTypeForm.controls;
    }
    get e() {
        return this.editSubjectTypeForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.subjectTypeForm.invalid) {
            return;
        }
        this.assignSubjectTypeAddParams();
        this.addSubjectType();
    }

    onEditSubmit() {
        this.editSubmitted = true;
        // stop here if form is invalid
        if (this.editSubjectTypeForm.invalid) {
            return;
        }
        this.assignSubjectTypeEditParams();
        this.editSubjectTypeApi();
    }

    refresh():void {
        window.location.reload();
    }

    private assignSubjectTypeAddParams() {
        this.subjectTypeAdd.instituteId = this.userData.instituteId;
        this.subjectTypeAdd.subjectType = this.subjectTypeForm.value.subjectType;
        console.log("subjectTypeAdd params=====" + JSON.stringify(this.subjectTypeAdd))
    }

    private assignSubjectTypeEditParams() {
        this.editSubjectType.instituteId = this.userData.instituteId;
        this.editSubjectType.subjectType = this.editSubjectTypeForm.value.editSubjectType;
        console.log("subjectTypeEdit params=====" + JSON.stringify(this.editSubjectType))
    }
    getSubjectTypeList():void {
        this.insmanagerService.getSubjectTypesWithPromise(this.userData.instituteId)
            .then(subjectTypeAddData => {
                var data = JSON.parse(JSON.stringify(subjectTypeAddData));
                if (data.status.success) {
                    this.subjectTypeList = data.data;
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    editSubjectTypeApi():void {
        this.insmanagerService.editSubjectTypeAddWithPromise(this.editSubjectType)
            .then(subjectTypeEditData => {
                console.log("subjectTypeEditData======================" + JSON.stringify(subjectTypeEditData));
                var data = JSON.parse(JSON.stringify(subjectTypeEditData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.getSubjectTypeList();
                    this.toastr.success('', "Subject type edited successfully!. ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    addSubjectType():void {
        this.insmanagerService.addSubjectTypeAddWithPromise(this.subjectTypeAdd)
            .then(subjectTypeAddData => {
                console.log("subjectTypeAddData======================" + JSON.stringify(subjectTypeAddData));
                var data = JSON.parse(JSON.stringify(subjectTypeAddData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.getSubjectTypeList();
                    this.toastr.success('', "Subject type successfully created ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToEditSubjectTypePopUp(data):void {
        console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editSubjectType", data);
        this.getSubjectTypeData=data;
        this.editModal.show();

    }

    goToConFirmDelete():void {
        var subjectTypeAddData = this.localStorageService.get("subjectTypeAddData");
        console.log("subjectTypeAddData=====" + JSON.stringify("subjectTypeAdd"));
        this.goToADeleteApiForSubjectType(subjectTypeAddData.subjectTypeId)

    }

    goToDeleteSubjectTypePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("subjectTypeAddData", data);
        this.msgInPopup = 'Do you want to delete ' + data.subjectType;
        this.childModal.show();

    }
    goToADeleteApiForSubjectType(id) {
        var subjecttype_delete_url = this.baseUrl + this.configFile.disable_subjecttype;
        subjecttype_delete_url = subjecttype_delete_url.replace('{userId}', this.userData.userId.toString());
        subjecttype_delete_url = subjecttype_delete_url.replace('{subjectTypeId}', id);
        console.log("subjecttype_delete_url--"+subjecttype_delete_url)
        this.insmanagerService.deleteSubjectTypeWithPromise(subjecttype_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getSubjectTypeList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

}

