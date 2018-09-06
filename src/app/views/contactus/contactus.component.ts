/**
 * Created by priya on 18/08/18.
 */
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
import { UploadFileService } from '../services/upload-file.service';
import { ConfigFile } from '../services/configfile';
import { environment } from '../../../environments/environment';
import { AddContact } from '../_models/AddContact';


@Component({
    selector: 'app-dashboard',
    templateUrl: 'contactus.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./contactus.component.scss']

})

export class ContactUsComponent implements OnInit {
    errorMessage:String;
    userData = new UserData();
    addContact = new AddContact();
    loginForm:FormGroup;
    submitted = false;
    public handleError;
    responseData = '';
    crypto = new BasicCrptoCredentials();
    timer:any;
    contactForm:FormGroup;
    isConnected:Observable<boolean>;
    isValidContact = false;
    isPage = 'Contact';

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
    }

    ngOnInit() {

        this.contactForm = this.formBuilder.group({
            cName: ['', [Validators.required]],
            cEmail: ['', [Validators.required, ValidationService.emailValidator]],
            cMessage: ['', [Validators.required]],

        });
    }


    get f() {
        return this.contactForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.contactForm.invalid) {
            return;
        }

        this.assignContactParams();

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    assignContactParams() {
        this.addContact.emailId = this.contactForm.value.cEmail;
        this.addContact.message = this.contactForm.value.cMessage;
        this.addContact.name = this.contactForm.value.cName;
        this.contactApICalls();
    }

    contactApICalls() {
        this.isValidContact = false;
        this.insmanagerService.addCoantactTypeWithPromise(this.addContact)
            .then(resData => {
                console.log("resData======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.isValidContact = true;
                    this.submitted = false;
                    this.contactForm.reset();
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);

    }
}


