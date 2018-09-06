/**
 * Created by priya on 02/08/18.
 */
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
import {content_file_type_extension} from '../services/configfile';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { Designation } from '../_models/Designation';
import { Department } from '../_models/Department';
import { ConfigFile } from '../services/configfile';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { environment } from '../../../environments/environment';
import { InsManagerService } from '../services/insmanager.service';


@Component({
    templateUrl: 'addclub.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./clubs.component.scss']
})

export class AddClubComponent {
    clubForm:FormGroup;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    departmentData = new Department();
    configFile=new ConfigFile();
    departmentList:Department [];
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    examTypeList:'';
    errorMessage:String;
    permission:'';
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    selectedPermissionData = null;
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    dropdownList1 = [];
    selectedItems1 = [];
    dropdownSettings1 = {};
    baseUrl = environment.baseUrl;
    isConnected: Observable<boolean>;


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
                private insmanagerService:InsManagerService)
        {
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

        this.clubForm = this.formBuilder.group({
            clubName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(30)]],
            clubDescription: ['', [Validators.required, Validators.minLength(5)]],
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],

        });


    }

    // convenience getter for easy access to form fields
    get f() {
        return this.clubForm.controls;
    }
    //code  for checkbox in dropdownlist
    onItemSelect (item:any) {
        console.log(item);
    }
    onSelectAll (items: any) {
        console.log(items);
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.clubForm.invalid) {
            return;
        }



    }

    // need to move common
    refresh():void {
        window.location.reload();
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
    goToReset()
    {

        this.chosenFileName="";
        this.chosenFileType="";
        this.chosenFileSize='';
        this.url = 'assets/img/no_image.png';
    }
    getUploadFileName() {
        var FOLDER = this.userData.instituteId + '/Department/';
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



}

