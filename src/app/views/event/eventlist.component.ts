/**
 * Created by priya on 09/08/18.
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
import { GetEvent } from '../_models/GetEvent';
import {AngularGooglePlaceModule,Address} from 'angular-google-place';
import { FilterPipe} from '../services/FilterPipe';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'eventlist.component.html',
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
export class EventListComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    eventList:GetEvent[];
    public address:Object;
    errorMessage:String;
    searchText='';
    msgInPopup = "";
    backgroundImage='../assets/img/search-icon.png';
   desData='No Event Found'
    url = 'assets/img/no_image.png';
    public options = {type : 'address', componentRestrictions: { country: 'IN' }};
    isConnected: Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;


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

    }

    ngOnInit() {

        this.getAllEvents();
    }
    // need to move common
    refresh():void {
        window.location.reload();
    }
    getAllEvents():void{

        var eventvenue_get_url = this.baseUrl + this.configFile.all_events_get_url;
        eventvenue_get_url = eventvenue_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getEventTypesWithPromise(eventvenue_get_url)
            .then(eventsData=> {
                var data = JSON.parse(JSON.stringify(eventsData));
                if (data.status.success) {
                    this.desData='';
                    this.eventList = data.data;
                    console.log("eventVenueList========" + JSON.stringify(this.eventList));
                } else {
                    this.desData='No Event Found'
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }
    goToConFirmDelete():void {
        var popupevent = this.localStorageService.get("popupevent");
        console.log("popupevent=====" + JSON.stringify("popupevent"));
        //this.goToADeleteApiForDepartment(popupdepartment.departmentId);
    }
    goToDeleteEventPopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupevent", data);
        this.msgInPopup = 'Do you want to delete ' + data.eventName;
        this.childModal.show();
    }


}