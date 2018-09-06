/**
 * Created by priya on 09/08/18.
 */
/**
 * Created by priya on 10/07/18.
 */

import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule,NgForm} from '@angular/forms';
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
import {MatStepper} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

import { PermissionService } from './../permission.service';
import { Permission } from './../permission';
import { ValidationService } from '../services/validation.service';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';

import { ConfigFile } from '../services/configfile';
import { AddEventVenue } from '../_models/AddEventVenue';
import { GetEventVenue } from '../_models/GetEventVenue';
import {AngularGooglePlaceModule,Address} from 'angular-google-place';
import { FilterPipe} from '../services/FilterPipe';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'

@Component({
    templateUrl: 'addeventvenue.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./event.component.scss']
})
@NgModule({
    declarations:[FilterPipe],
    exports:[FilterPipe]
})
export class AddEventVenueComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    addEventVenue = new AddEventVenue();
    crypto = new BasicCrptoCredentials();
    eventVenueList:GetEventVenue [];
    public address:Object;
    errorMessage:String;

    firstFormGroup:FormGroup;
    firstFormsubmitted = false;
    searchText='';
    backgroundImage='../assets/img/search-icon.png';
    isConnected: Observable<boolean>;
    url = 'assets/img/no_image.png';
    @ViewChild('stepper') stepper: MatStepper;
    public options = {type : 'address', componentRestrictions: { country: 'IN' }};


    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private spinnerService:Ng4LoadingSpinnerService,
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
        this.firstFormGroup = this.formBuilder.group({
            options: ['1']
        })
    }

    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
            eventName: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(30)]],
            eventDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            options: ['', Validators.required],
        });
        this.getAllEventVenueLists();
    }
    // need to move common
    refresh():void {
        window.location.reload();
    }
    getAllEventVenueLists():void{
        this.spinnerService.show();
        var eventvenue_get_url = this.baseUrl + this.configFile.event_venue_list;
        eventvenue_get_url = eventvenue_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getEventTypesWithPromise(eventvenue_get_url)
            .then(eventVenueData=> {
                var data = JSON.parse(JSON.stringify(eventVenueData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.eventVenueList = data.data;
                    console.log("eventVenueList========" + JSON.stringify(this.eventVenueList));
                } else {
                    this.spinnerService.hide();
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    move(index: number) {
        this.stepper.selectedIndex = index;
        console.log("index======"+index)
    }
    goBack(stepper: MatStepper){
        console.log("index======"+stepper.selectedIndex)
        stepper.previous();
    }

}