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
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { Department } from '../_models/Department';
import { GetEventType } from '../_models/GetEventType';
import { ConfigFile } from '../services/configfile';
import { AddEvent } from '../_models/AddEvent';
import { GetEventVenue } from '../_models/GetEventVenue';
import {AngularGooglePlaceModule,Address} from 'angular-google-place';

@Component({
    templateUrl: 'addevent.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./event.component.scss']
})
export class AddEventComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    departmentData = new Department();
    getEventTypeData = new GetEventType();
    addEvent = new AddEvent();
    departmentList:Department [];
    crypto = new BasicCrptoCredentials();
    eventTypeList:GetEventType [];
    eventVenueList:GetEventVenue [];
    public address:Object;
    errorMessage:String;
    eventShowTypes = [{'id': '1', 'name': 'Institute'}, {'id': '2', 'name': 'Department'}, {
        'id': '3',
        'name': 'Public'
    }];
    isLinear = false;
    selectedEventShowType = null;
    selectedDepartmentData = null;
    selectedEventTypeData = null;
    selectedEventVenueData = null;
    firstFormGroup:FormGroup;
    secondFormGroup:FormGroup;
    thirdFormGroup:FormGroup;
    fourthFormGroup:FormGroup;
    eventName = '';
    firstFormsubmitted = false;
    secondFormsubmitted = false;
    thirdFormsubmitted = false;
    fourthFormsubmitted = false;
    url = 'assets/img/no_image.png';
    uploadFileName = '';
    selectedFiles:FileList;
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    contactLName = '';
    @ViewChild('stepper') stepper:MatStepper;
    //ck editor initalization
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;
    eventDescription = '';
    public options = {type: 'address', componentRestrictions: {country: 'IN'}};
    timer:any;
    showMultipleChoice=true;
    isConnected: Observable<boolean>;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
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
        this.ckeConfig = {
            height: 200,
            language: "en",
            allowedContent: true,
            toolbar: [
                {name: "editing", items: ["Scayt", "Find", "Replace", "SelectAll"]},
                {name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"]},
                {name: "links", items: ["Link", "Unlink", "Anchor"]},
                {name: "tools", items: ["Maximize", "ShowBlocks", "Preview", "Print", "Templates"]},
                {name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar", "Iframe", "imageExplorer"]},
                "/",
                {
                    name: "basicstyles",
                    items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"]
                },
                {
                    name: "paragraph",
                    items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "CreateDiv", "-", "Blockquote"]
                },
                {name: "justify", items: ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"]},
                {name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor"]}
            ]
        };

        this.firstFormGroup = this.formBuilder.group({
            eventName: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(30)]],
            eventDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            options: ['', Validators.required],
            /*  address: ['', Validators.required],*/
        });
        this.secondFormGroup = this.formBuilder.group({
            eventStartDateTime: ['', Validators.required],
            eventEndDateTime: ['', Validators.required],

        });
        this.thirdFormGroup = this.formBuilder.group({
            chosenFileName: ['', Validators.required],
            chosenFileType: ['', Validators.required],
            chosenFileSize: ['', Validators.required],
        });
        this.fourthFormGroup = this.formBuilder.group({
            contactFName: ['', Validators.required],
            stAddress: ['', Validators.required],
            stContactPhone: ['', Validators.required],

        });
        this.getAllDepartmentList();
        this.getAllEventTypeLists();
        this.getAllEventVenueLists();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.firstFormGroup.controls;
    }

    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    /// console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllEventVenueLists():void {
        var eventvenue_get_url = this.baseUrl + this.configFile.event_venue_list;
        eventvenue_get_url = eventvenue_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getEventTypesWithPromise(eventvenue_get_url)
            .then(eventVenueData=> {
                var data = JSON.parse(JSON.stringify(eventVenueData));
                if (data.status.success) {
                    this.eventVenueList = data.data;
                    ///  console.log("eventVenueList========" + JSON.stringify(this.eventVenueList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllEventTypeLists():void {
        var eventtype_get_url = this.baseUrl + this.configFile.event_venuetype_list;
        eventtype_get_url = eventtype_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getEventTypesWithPromise(eventtype_get_url)
            .then(eventTypeData=> {
                var data = JSON.parse(JSON.stringify(eventTypeData));
                if (data.status.success) {
                    this.eventTypeList = data.data;
                    ///  console.log("eventTypeList========" + JSON.stringify(this.eventTypeList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getValueInEventShowType(data) {

        this.selectedEventShowType = null;
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.eventShowTypes.length; i++) {
            var getEventShowTypeData = this.eventShowTypes[i];
            if (getEventShowTypeData.id == data) {
                this.selectedEventShowType = this.eventShowTypes[i];
                console.log(" this.selectedEventShowType=====" + JSON.stringify(this.selectedEventShowType));
            }

        }
    }

    getValueInEventType(data) {
        this.selectedEventTypeData = null;
        for (var i = 0; i < this.eventTypeList.length; i++) {
            this.getEventTypeData = this.eventTypeList[i];
            if (this.getEventTypeData.eventType == data) {
                this.selectedEventTypeData = this.eventTypeList[i];
                console.log(" this.selectedEventTypeData=====" + JSON.stringify(this.selectedEventTypeData));
            }

        }
    }

    getValueInEventVenue(data) {
        this.selectedEventVenueData = null;
        for (var i = 0; i < this.eventVenueList.length; i++) {
            var getEventVenueData = this.eventVenueList[i];
            if (getEventVenueData.eventVenue == data) {
                this.selectedEventVenueData = this.eventVenueList[i];
                console.log(" this.selectedEventVenueData=====" + JSON.stringify(this.selectedEventVenueData));
            }

        }
    }

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name == data) {
                this.selectedDepartmentData = this.departmentList[i];
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
            }

        }
    }


    move(index:number) {
        this.stepper.selectedIndex = index;
        console.log("index======" + index)
    }

    goBack(stepper:MatStepper) {
        console.log("index======" + stepper.selectedIndex)
        stepper.previous();
    }

    goForward(f:NgForm, stepper:MatStepper) {
        console.log("index======" + stepper.selectedIndex);
        // stop here if form is invalid

        if (stepper.selectedIndex == 0) {
            console.log("this.address===" + this.address)
            this.firstFormsubmitted = true;
            if (this.firstFormGroup.invalid) {
                return;
            }

            console.log(this.firstFormGroup.value);
            if (this.selectedEventTypeData == null) {
                this.toastr.error('', "Choose Event Type ");
                return;
            }
            if (this.selectedEventShowType.id == 2) {
                if (this.selectedDepartmentData == null) {
                    this.toastr.error('', "Choose Department ");
                    return;
                }
            }
            console.log("this.selectedEventTypeData======" + this.selectedEventTypeData.eventTypeId);
            stepper.next();
        }
        if (stepper.selectedIndex == 1) {
            this.secondFormsubmitted = true;
            if (this.secondFormGroup.invalid) {
                return;
            }
            // console.log(this.secondFormGroup.value);
            console.log("Start date and Time====" + this.secondFormGroup.value.eventStartDateTime.getTime());
            console.log("End date and Time====" + this.secondFormGroup.value.eventEndDateTime.getTime());
            if (this.secondFormGroup.value.eventEndDateTime.getTime() < this.secondFormGroup.value.eventStartDateTime.getTime()) {
                this.toastr.error('', "End Date/Time is less than Start Date/Time ");
                return;
            } else if (this.secondFormGroup.value.eventEndDateTime.getTime() < this.secondFormGroup.value.eventStartDateTime.getTime()) {
                this.toastr.error('', "Start Date/Time and End Date/Time same  ");
                return;
            } else {
                stepper.next();
            }
        }
        if (stepper.selectedIndex == 2) {
            this.thirdFormsubmitted = true;
            if (this.thirdFormGroup.invalid) {
                return;
            }
            console.log(this.thirdFormGroup.value);
            stepper.next();
        }
        if (stepper.selectedIndex == 3) {
            this.fourthFormsubmitted = true;
            if (this.fourthFormGroup.invalid) {
                return;
            }
            console.log(this.fourthFormGroup.value);
            this.addEventAssignParams();
            this.goToAddEvent();
        }
    }

    resetStepper(stepper:MatStepper) {
        stepper.selectedIndex = 0;
    }

    getUploadFileName() {
        var FOLDER = this.getImageFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
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

    getFileType() {
        /* var extensionIndex = this.chosenFileName.lastIndexOf('.');
         this.chosenExtension = this.chosenFileName.substring(extensionIndex).toUpperCase();
         if (content_file_type_extension_name[content_file_type_extension.PNG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.PNG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.JPG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPEG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.JPEG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.GIF - 1].toUpperCase() === this.chosenExtension) {
         this.chosenFileType = content_file_type_name[content_file_type.GIF - 1];
         } else {
         this.chosenFileType = 'Unknown File Type';
         }*/

    }

    getFileSize() {
        var fileSizeInBytes = 0;
        fileSizeInBytes = parseInt(this.chosenFileSize);
        var tempSize = 0;
        if (fileSizeInBytes > 1024 * 1024) {
            var fileSizeInMB = fileSizeInBytes / 1024 / 1024;
            tempSize = Math.round(fileSizeInMB * 100) / 100 ////+ ' MB';
            this.chosenFileSize = tempSize.toString() + 'MB';
        } else if (fileSizeInBytes > 1024) {
            var fileSizeInKB = fileSizeInBytes / 1024;
            tempSize = Math.round(fileSizeInKB * 100) / 100 /////+ ' KB';
            this.chosenFileSize = tempSize.toString() + 'KB';
        } else {
            tempSize = fileSizeInBytes //; + ' Bytes';
            this.chosenFileSize = tempSize.toString() + 'Bytes';
        }
    }
    getImageFileFolderName():string {
        return this.userData.instituteId+'/Event/';
    }
    addEventAssignParams() {
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        this.addEvent.userId = this.userData.userId;
        this.addEvent.instituteId = this.userData.instituteId;
        this.addEvent.eventName = this.firstFormGroup.value.eventName;
        this.addEvent.eventDescription = this.firstFormGroup.value.eventDescription;
        this.addEvent.eventTypeId = this.selectedEventTypeData.eventTypeId;
        this.addEvent.startDate = this.secondFormGroup.value.eventStartDateTime.getTime();
        this.addEvent.endDate = this.secondFormGroup.value.eventEndDateTime.getTime();
        this.addEvent.eventBanner = this.uploadFileName;
        this.addEvent.eventVenueId = 0;
        this.addEvent.contactFName = this.fourthFormGroup.value.contactFName;
        this.addEvent.contactLName = (this.contactLName == null || this.contactLName == undefined || this.contactLName == '') ? '' : this.contactLName;
        this.addEvent.contactNumber = this.fourthFormGroup.value.stContactPhone;
        this.addEvent.contactImage = '';
        this.addEvent.showId = this.selectedEventShowType.id;
        this.addEvent.showTypeId = 0;
        if (this.selectedEventShowType.id == 2) {
            this.addEvent.showTypeId = this.selectedDepartmentData.departmentId;
        }

        console.log("add event param====" + JSON.stringify(this.addEvent))
    }

    goToAddEvent():void {
        this.insmanagerService.addEventWithPromise(this.addEvent)
            .then(addEventData => {
                console.log("addEventData======================" + JSON.stringify(addEventData));
                var data = JSON.parse(JSON.stringify(addEventData));
                if (data.status.success) {
                    this.toastr.success('', "Event added successfully! ");
                    this.timer = setTimeout(() => {
                        this.router.navigate(['event/event-list']);
                    }, 1500);

                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAddress(place:Object) {
        this.address = place['formatted_address'];
        var location = place['geometry']['location'];
        var lat = location.lat();
        var lng = location.lng();
        console.log("Address Object======", this.address);
        console.log("lat=====", lat);
        console.log("lng=====", lng);
    }

    //getAddress(place: Address) {
    // console.log('Address', place);
    // }
    getFormattedAddress(event:any) {
        console.log(event);
    }


    onSubmit(f:NgForm, stepper:MatStepper) {
        /*
         this.submitted = true;
         // stop here if form is invalid
         if (this.firstFormGroup.invalid) {
         return;
         }
         console.log(this.firstFormGroup.value);*/


    }

    onSecondSubmit(f:NgForm, stepper:MatStepper) {

    }
}