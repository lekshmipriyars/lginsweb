import { NgModule,Component, OnInit,Injectable,ChangeDetectionStrategy} from '@angular/core';
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
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { RegisterService } from './register.service';
import { Register } from './register';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { UserData } from '../login/userdata';
import { LocalStorageService, NgxResource } from 'ngx-store';
import {AngularGooglePlaceModule,Address} from 'angular-google-place';
@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: 'register.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class RegisterComponent {
    errorMessage:String;
    regData = new Register();
    registerForm:FormGroup;
    submitted = false;
    public handleError;
    instituteCategoryList=[];
    crypto = new BasicCrptoCredentials();
    simpleItems = [];
    isConnected: Observable<boolean>;
    userData = new UserData();
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private regService:RegisterService) {
        this.isConnected = Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));
    }

    ngOnInit() {
        this.simpleItems = [true, 'Two', 3];
        this.registerForm = this.formBuilder.group({
            insEmailId: ['', [Validators.required, ValidationService.emailValidator]],
            instituteName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            instituteCategory: ['', [Validators.required]],
            instituteLocation: ['', [Validators.required]],
            userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            insPassword: ['', [Validators.required,, Validators.minLength(6), ValidationService.passwordValidator]],
            insRetypePassword: ['', [Validators.required,, Validators.minLength(6), ValidationService.passwordValidator]],
            acceptTermsAndCon: ['', [Validators.required]],
            instituteType: ['', [Validators.required]],
        });


    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        var data = JSON.parse(JSON.stringify(this.registerForm.value))
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            if (data.instituteCategory == '' || data.instituteCategory == undefined) {
                this.toastr.error('', "Select Category School / College");
            } else if (data.instituteType == '' || data.instituteType == undefined) {
                this.toastr.error('', "Select Institute Type");

            } else if (data.acceptTermsAndCon == '' || data.acceptTermsAndCon == undefined) {
                this.toastr.error('', "Accept Terms and Condition");
            }
            return;
        }
        // reg api checking here
        if(data.instituteCategory==='1'){
            this.instituteCategoryList=[
                {'id':'1','name':'CBSE'},
                {'id':'2','name':'ICSE'},
                {'id':'3','name':'Matriculation'},
                {'id':'4','name':'Government'}
            ];
        }else {
            this.instituteCategoryList=[
                {'id':'5','name':'Arts & Science'},
                {'id':'6','name':'Engineering'},
                {'id':'7','name':'Medical'}
            ];
        }


        this.setRegisterParams();


    }



    filterInstitute(filterVal:any) {
        console.log('filter val----' + filterVal)
        this.registerForm.value.instituteType=filterVal;

    }
    instituteCategoryChange(filterVal:any) {
        console.log('filter val radui----' + filterVal)
        if(filterVal==='1'){
            this.instituteCategoryList=[
                {'id':'1','name':'CBSE'},
                {'id':'2','name':'ICSE'},
                {'id':'3','name':'Matriculation'},
                {'id':'4','name':'Government'}
            ];
        }else {
            this.instituteCategoryList=[
                {'id':'5','name':'Arts & Science'},
                {'id':'6','name':'Engineering'},
                {'id':'7','name':'Medical'}
            ];
        }

    }

    private setRegisterParams() {
        this.regData.insEmailId = this.crypto.encryptByAES(this.registerForm.value.insEmailId);
        this.regData.insName = this.crypto.encryptByAES(this.registerForm.value.instituteName);
        this.regData.userName = this.crypto.encryptByAES(this.registerForm.value.userName);
        this.regData.password = this.crypto.encryptByAES(this.registerForm.value.insPassword);
        this.regData.location = this.crypto.encryptByAES(this.registerForm.value.instituteLocation);
        /// need to be fix below parts
        this.regData.instituteType = 1;
        this.regData.instituteCategory = 1;
        this.regData.latitude = 0;
        this.regData.longitude = 0;
        console.log("register params---"+JSON.stringify(this.regData));
        this.checkValidUser();

    }

    checkValidUser():void {
        console.log("reg====="+JSON.stringify(this.regData))
        this.regService.addRegWithPromise(this.regData)
            .then(regData => {
                // console.log("loginData======================"+JSON.stringify(loginData));
                var data = JSON.parse(JSON.stringify(regData));

                if (data.status.success) {
                    console.log("data======================" + JSON.stringify(data.data));
                    this.localStorageService.set("userdata", this.getDecryptedDatas(data.data));
                    console.log("loggedUserData======================" + JSON.stringify(this.localStorageService.get("userdata")));
                    this.router.navigate(['/', 'dashboard']);
                } else {
                    this.toastr.error('', data.status.description);

                }

            },
                error => this.errorMessage = <any>error);
    }

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
