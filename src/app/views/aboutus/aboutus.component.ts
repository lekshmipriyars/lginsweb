/**
 * Created by agaram on 31/08/18.
 */
import {NgModule,Component, OnInit,Injectable} from '@angular/core';
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
import { UserData } from '../login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
@Component({
    selector: 'app-dashboard',
    templateUrl: 'aboutus.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./aboutus.component.scss']

})

export class AboutUsComponent implements OnInit {
    errorMessage:String;
    userData = new UserData();
    loginForm:FormGroup;
    submitted = false;
    public handleError;
    responseData = '';
    crypto = new BasicCrptoCredentials();
    isPage='AboutUs';

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService) {
    }

    ngOnInit() {

        ///api calls checking purpose this code added
        ///   this.getPermissions();
        ///  alert(this.crypto.decryptByAES("LQLKjwoz/M7J101EibwWKQ=="))
    }



    onSubmit() {
        this.submitted = true;



    }







}



