import {  NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { InsManagerService } from '../services/insmanager.service';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { ExamTypeAdd } from './examtypeadd';
import { ExamService } from './exam.service';
import { ConfigFile } from '../services/configfile';
import { environment } from '../../../environments/environment';
@Component({
    templateUrl: 'examtypeadd.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class ExamTypeAddComponent {
    userData = new UserData();
    baseUrl = environment.baseUrl;
    configFile = new ConfigFile();
    examTypeForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    examTypeList:'';
    errorMessage:String;
    crypto = new BasicCrptoCredentials();
    examTypeAdd = new ExamTypeAdd();
    desData = '';
    msgInPopup = '';
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private insmanagerService:InsManagerService,
                private examService:ExamService) {
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

        this.examTypeForm = this.formBuilder.group({
            examType: ['', [Validators.required, Validators.minLength(3)]]
        });
        ///api calls checking purpose this code added
        this.getExamTypeList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.examTypeForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.examTypeForm.invalid) {
            return;
        }
        this.assignExamTypeAddParams();
        this.addExamType();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignExamTypeAddParams() {
        this.examTypeAdd.instituteId = this.userData.instituteId;
        this.examTypeAdd.examType = this.examTypeForm.value.examType;
    }

    getExamTypeList():void {
        this.examService.getExamTypesWithPromise(this.userData.instituteId)
            .then(examTypeAdd => {
                var data = JSON.parse(JSON.stringify(examTypeAdd));
                if (data.status.success) {
                    this.examTypeList = data.data;
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    addExamType():void {
        this.examService.addExamTypeAddWithPromise(this.examTypeAdd)
            .then(examTypeAddData => {
                console.log("subjectTypeAddData======================" + JSON.stringify(examTypeAddData));
                var data = JSON.parse(JSON.stringify(examTypeAddData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.getExamTypeList();
                    this.toastr.success('', "Exam type successfully created ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToEditExamTypePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editExamType", data);

        this.editModal.show();

    }

    goToConFirmDelete():void {
        var examTypeAddData = this.localStorageService.get("examTypeAddData");
        console.log("examTypeAddData=====" + JSON.stringify("examTypeAddData"));
        this.goToADeleteApiForExamType(examTypeAddData.examTypeId);
    }


    goToADeleteApiForExamType(id) {
        var examtype_delete_url = this.baseUrl + this.configFile.disable_examtype;
        examtype_delete_url = examtype_delete_url.replace('{userId}', this.userData.userId.toString());
        examtype_delete_url = examtype_delete_url.replace('{examTypeId}', id);
        console.log("examtype_delete_url--"+examtype_delete_url)
        this.insmanagerService.deleteExamTypeWithPromise(examtype_delete_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getExamTypeList();
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    goToDeleteExamTypePopUp(data):void {
        console.log("data=====" + JSON.stringify(data));
        this.localStorageService.set("examTypeAddData", data);
        this.msgInPopup = 'Do you want to delete ' + data.examType;
        this.childModal.show();

    }

}