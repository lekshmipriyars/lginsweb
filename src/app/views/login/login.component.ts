import { NgModule,Component, OnInit,Injectable} from '@angular/core';
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

import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';

import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { InsManagerService } from '../services/insmanager.service';
import { Login } from './../_models/login';
import { UserData } from './userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ConfigFile,INSTITUTE_TYPES} from '../services/configfile';
@Component({
    selector: 'app-dashboard',
    templateUrl: 'login.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]


})

export class LoginComponent implements OnInit {
    errorMessage:String;
    loginData = new Login();
    userData = new UserData();
    configFile= new ConfigFile();
    loginForm:FormGroup;
    submitted = false;
    public handleError;
    public permisisonUrl:'https://betarest.learnerguru.com/inslearnerguru/permission/get/all'
    public permissionDatas='';
    responseData = '';
    crypto = new BasicCrptoCredentials();
    isConnected: Observable<boolean>;

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
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            insCode: ['', Validators.required],
            userName: ['', Validators.required],
            userPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
        ///api calls checking purpose this code added
        ///   this.getPermissions();
      /// alert(this.crypto.decryptByAES("XO5nJhDOCFEsTbcbnVGgFw=="))
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        /// alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))

        // login api checking here
        this.assignUserParams();
        this.checkUser();

    }

    private assignUserParams() {
        this.loginData.instituteCode = this.loginForm.value.insCode;
        this.loginData.userName = this.crypto.encryptByAES(this.loginForm.value.userName);
        this.loginData.password = this.crypto.encryptByAES(this.loginForm.value.userPassword);

    }

    checkUser():void {
        this.insmanagerService.addLoginWithPromise(this.loginData)
            .then(loginData => {
                var data = JSON.parse(JSON.stringify(loginData));
                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.localStorageService.set("userdata", this.getDecryptedDatas(data.data[0]));
                    console.log("loggedUserData======================" + JSON.stringify(this.localStorageService.get("userdata")));
                    if(data.data[0].userType==INSTITUTE_TYPES.USER_TYPE_STAFF) {
                        this.router.navigate(['/', 'staff-dashboard']);
                    }
                    else
                    {
                        this.router.navigate(['/', 'dashboard']);
                    }
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    /*  getPermissions():void {
     this._http.get('https://betarest.learnerguru.com/inslearnerguru/permission/get/all')
     .subscribe(data => {
     this.permissionDatas = data.json();
     console.log("permissionDatas===========" + JSON.stringify(this.permissionDatas))
     }, error => console.error("api error==" + error));

     }*/

    /**
     * @param any
     */
    getDecryptedDatas(data) {
        this.userData = data;
        this.userData.userName = (this.userData.userName != null || this.userData.userName != undefined || this.userData.userName != '') ? this.crypto.decryptByAES(this.userData.userName) : '';
        this.userData.profileImage = (this.userData.profileImage == null || this.userData.profileImage == undefined || this.userData.profileImage == '') ? '' : this.crypto.decryptByAES(this.userData.profileImage);
        this.userData.emailId = (this.userData.emailId == null || this.userData.emailId == undefined || this.userData.emailId == '') ? '' : this.crypto.decryptByAES(this.userData.emailId);
        this.userData.fName = (this.userData.fName == null || this.userData.fName == undefined || this.userData.fName == '') ? '' : this.crypto.decryptByAES(this.userData.fName);
        this.userData.lName = (this.userData.lName == null || this.userData.lName == undefined || this.userData.lName == '') ? '' : this.crypto.decryptByAES(this.userData.lName);
        this.userData.location = (this.userData.location == null || this.userData.location == undefined || this.userData.location == '') ? '' : this.crypto.decryptByAES(this.userData.location);
        this.userData.address = (this.userData.address == null || this.userData.address == undefined || this.userData.address == '') ? '' : this.crypto.decryptByAES(this.userData.address);
        if (this.userData.lName == '') {
            if (this.userData.fName == '') {
                if (this.userData.userName != '') {
                    this.userData.displayName = this.userData.userName;
                }
            } else {
                this.userData.displayName = this.userData.fName;
            }
        }
        return this.userData;
    }

}


