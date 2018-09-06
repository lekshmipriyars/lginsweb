/**
 * Created by priya on 10/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
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
import { InsManagerService } from '../services/insmanager.service';
import { AddAcadamicYear } from '../_models/AddAcadamicYear';
import { GetAcadamicYearData } from '../_models/GetAcadamicYearData';
import { environment } from '../../../environments/environment';
import { ConfigFile } from '../services/configfile';
import { DataTableResource } from 'angular4-smart-table';

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
    templateUrl: 'add.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./acadamicyear.component.scss']
})


export class AddComponent {
    baseUrl = environment.baseUrl;
    acadamicYearAddForm:FormGroup;
    configFile=new ConfigFile();
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    acadamicYearList:GetAcadamicYearData [];
    acdamicYearData = new GetAcadamicYearData();
    addAcadamicYearData = new AddAcadamicYear();
    submitted = false;
    public handleError;
    errorMessage:String;
    selectedAcadamicYearData = null;
    set_acadamicyear_url = '';
    desData = '';
    msgInPopup = '';
    data = '';
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('acdamicModal') public acdamicModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;

    acadamicStartDate = '';
    acadamicEndDate = '';
    acadamicYearAdd = '';
    minDate = new Date();
    maxDate = new Date(2020, 0, 1);
    // Initialized to specific date (09.10.2018).
    public model:any = {date: {year: 2018, month: 10, day: 9}};


    items = [];
    itemCount = 0;



    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private datePipe:DatePipe,
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
        //this.itemResource.count().then(count => this.itemCount = count);


    }

    ngOnInit() {
        this.acadamicYearAddForm = this.formBuilder.group({
            acadamicYearAdd: ['', [Validators.required]],
            acadamicStartDate: ['', [Validators.required]],
            acadamicEndDate: ['', [Validators.required]],
        });
        ///api calls checking purpose this code added
        this.getAllAcadamicYearList();
    }

    reloadItems(params) {
       // this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) { return item.jobTitle; }

    // convenience getter for easy access to form fields
    get f() {
        return this.acadamicYearAddForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.acadamicStartDate != '' && this.acadamicEndDate != '') {
            var endDate = new Date(this.acadamicEndDate);
            var startDate = new Date(this.acadamicStartDate);
            this.acadamicYearAdd = (startDate.getFullYear().toString() + "-" + endDate.getFullYear().toString()).toString();
        }

        // stop here if form is invalid
        if (this.acadamicYearAddForm.invalid) {
            return;
        }


        this.assignAcadamicYearParams();
        this.addAcadamicYear();


    }

    // need to move common
    refresh():void {
        window.location.reload();
    }


    private assignAcadamicYearParams() {
        var endDate = new Date(this.acadamicEndDate);
        var startDate = new Date(this.acadamicStartDate);
        this.addAcadamicYearData.instituteId = this.userData.instituteId;
        this.addAcadamicYearData.academicYear = this.acadamicYearAdd;
        this.addAcadamicYearData.endDate = endDate.getFullYear();
        this.addAcadamicYearData.startDate = startDate.getFullYear();
        console.log("addAcadamicYearData params=====" + JSON.stringify(this.addAcadamicYearData))


    }

    addAcadamicYear():void {
        this.insmanagerService.addAcadamicWithWithPromise(this.addAcadamicYearData)
            .then(acadamciYearAddData => {
                var data = JSON.parse(JSON.stringify(acadamciYearAddData));
                if (data.status.success) {
                    this.toastr.success('', "AcadamicYear added successfully! ");
                    this.getAllAcadamicYearList();
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    // all acadamicyear getting
    getAllAcadamicYearList():void {
        var acadamciyear_all_get_url = this.baseUrl + this.configFile.getall_acadamicyear;
        acadamciyear_all_get_url = acadamciyear_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAcadamicYearWithPromise(acadamciyear_all_get_url)
            .then(acadamciyearData=> {
                var data = JSON.parse(JSON.stringify(acadamciyearData));
                if (data.status.success) {
                    this.acadamicYearList = data.data;
                    this.desData = '';
                    console.log("acadamicYearList========" + JSON.stringify(this.acadamicYearList));
                } else {
                    this.desData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToConFirmDelete():void {
        var selectedAcadamicData = this.localStorageService.get("selectedAcadamicData");
        console.log("selectedAcadamicData=====" + JSON.stringify(selectedAcadamicData));
        /*  var acadamciyear_delete_url = this.baseUrl + 'academicYear/list/{instituteId}';
         acadamciyear_delete_url = acadamciyear_delete_url.replace('{instituteId}', this.userData.instituteId.toString());
         this.insmanagerService.goToDeleteAcadamicYearWithPromise(acadamciyear_delete_url)
         .then(acadamciyearData=> {
         var data = JSON.parse(JSON.stringify(acadamciyearData));
         if (data.status.success) {

         console.log("delete year========" + JSON.stringify(data.data));
         } else {
         this.desData = data.status.description;
         this.toastr.error('', data.status.description);

         }
         },
         error => this.errorMessage = <any>error);*/
    }

    goToDeleteAcadamicYearPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("selectedAcadamicData", data);
        this.msgInPopup = 'Do you want to delete ' + data.academicYear;
        this.childModal.show();

    }

    goToEditAcadamicYearPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editAcadamicData", data);

        this.editModal.show();

    }

    goToSetAcadamicYear(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        // this.localStorageService.set("editAcadamicData", data);
        this.acdamicModal.show();

    }

    updateMyDate(newDate) {
        console.log("newDate======" + newDate)
    }


    getValueInAcadamicYear(data) {
        console.log(" data=====" + JSON.stringify(data));
        this.selectedAcadamicYearData = null;
        for (var i = 0; i < this.acadamicYearList.length; i++) {
            this.selectedAcadamicYearData = this.acadamicYearList[i];
            if (this.selectedAcadamicYearData.academicYear == data) {
                this.selectedAcadamicYearData = null;
                this.selectedAcadamicYearData = this.acadamicYearList[i];
                this.set_acadamicyear_url = this.baseUrl + 'academicYear/set/current/{academicYearId}';
                this.set_acadamicyear_url = this.set_acadamicyear_url.replace('{academicYearId}', this.selectedAcadamicYearData.academicYearId);
                return;
            }

        }
        console.log(" this.selectedAcadamicYearData=====" + JSON.stringify(this.selectedAcadamicYearData));
    }

    goToConFirmSetAcadamicYear() {
        this.insmanagerService.setAcadamicYearWithPromise(this.set_acadamicyear_url)
            .then(acadamciyearData=> {
                var data = JSON.parse(JSON.stringify(acadamciyearData));
                if (data.status.success) {
                    this.toastr.success('', "successfully set acadamic year");
                    console.log("acadamicYearList========" + JSON.stringify(data));
                    this.getUser();
                    this.acdamicModal.hide();
                } else {
                    this.desData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);

    }
    goToViewAcadamicYearPopUp(data):void{
        this. acdamicYearData= data;
        this.localStorageService.set("selectedAcadamicData", data);
        this.viewModal.show();
    }

    getUser()
    {

        var user_get_url = this.baseUrl+this.configFile.user_get_by_userid;
        user_get_url = user_get_url.replace('{userId}', this.userData.userId.toString());
        this.insmanagerService.goToGetUserWithPromise(user_get_url)
            .then(userData=> {
                var data = JSON.parse(JSON.stringify(userData));
                if (data.status.success) {
                    console.log("acadamicYearList========" + JSON.stringify(data));
                } else {
                    this.desData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

}
