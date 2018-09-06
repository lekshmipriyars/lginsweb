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
import { environment } from '../../../environments/environment';
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
import { AddEventType } from '../_models/AddEventType';
import { InsManagerService } from '../services/insmanager.service';
import { ConfigFile } from '../services/configfile';
@Component({
    templateUrl: 'eventtypeadd.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])]
})
export class EventTypeAddComponent {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    eventTypeForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    eventTypeList='';
    errorMessage:String;
    crypto = new BasicCrptoCredentials();
    addEventType = new AddEventType();
    desData = '';
    msgInPopup = '';
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    configFile = new ConfigFile();
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private ingManagerService:InsManagerService) {
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

        this.eventTypeForm = this.formBuilder.group({
            eventType: ['', [Validators.required, Validators.minLength(3)]]
        });
        ///api calls checking purpose this code added
        this.getEventTypeList();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.eventTypeForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.eventTypeForm.invalid) {
            return;
        }
        this.assignEventTypeAddParams();
        this.addEvenType();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignEventTypeAddParams() {
       this.addEventType.instituteId = this.userData.instituteId;
       this.addEventType.eventType = this.eventTypeForm.value.eventType;
        console.log("addEvent type params---"+JSON.stringify(this.addEventType))
    }

    getEventTypeList():void {
        var url=this.baseUrl+this.configFile.all_eventtypes_get_url;
        url= url.replace('{instituteId}',this.userData.instituteId.toString());
        this.ingManagerService.getEventTypesWithPromise(url)
            .then(addEventType => {
                var data = JSON.parse(JSON.stringify(addEventType));
                if (data.status.success) {
                    this.eventTypeList = data.data;
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    addEvenType():void {
        this.ingManagerService.addEventTypeAddWithPromise(this.addEventType)
            .then(eventTypeAddData => {
                console.log("eventTypeAddData======================" + JSON.stringify(eventTypeAddData));
                var data = JSON.parse(JSON.stringify(eventTypeAddData));

                console.log("sucess======================" + JSON.stringify(data.status.success));
                if (data.status.success) {
                    this.getEventTypeList();
                    this.toastr.success('', "Event type successfully created ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    goToEditEventTypePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editEventType", data);

        this.editModal.show();

    }

    goToConFirmDelete():void {
        /*var examTypeAddData = this.localStorageService.get("examTypeAddData");
        console.log("examTypeAddData=====" + JSON.stringify("examTypeAddData"));*/

    }

    goToDeleteEventTypePopUp(data):void {
        //console.log("data=====" + JSON.stringify(data));
        this.localStorageService.set("examTypeAddData", data);
        this.msgInPopup = 'Do you want to delete ' + data.eventType;
        this.childModal.show();

    }

}