/**
 * Created by priya on 03/09/18.
 */
import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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
import { AddProject } from '../_models/AddProject';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';

import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';

import { environment } from '../../../environments/environment';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { InsManagerService } from '../services/insmanager.service';
import { GetSubject } from '../_models/GetSubject';
import {CKEditorModule} from 'ng2-ckeditor';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';
import { DatePipe } from '@angular/common';
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
    templateUrl: 'addpersonality.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./personality.component.scss']
})
export class AddPersonalityComponent implements OnInit {
    configFile = new ConfigFile();
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    departmentData = new Department();
    courseData = new GetCourse();
    PersonalityForm:FormGroup;
    uploadFileName = '';
    courseList:GetCourse [];
    selectedItems = [];
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = 0;
    selectedDepartmentData = null;
    selectedCourseData = null;
    baseUrl = environment.baseUrl;
    selectedAcadamicYearData = null;
    departmentList:Department [];
    selectedSubjectData = null;
    subjectList:GetSubject [];
    subjectData = new GetSubject();
    desSubjectData = '';
    selectedDepartmentId:number;
    selectedCourseId:number;
    // pic choosing variables
    addProject = new AddProject();
    timer:any;
    isConnected:Observable<boolean>;
    StartDate = '';
    YearAdd = '';
    minDate = new Date();
    maxDate = new Date(2020, 0, 1);
    // Initialized to specific date (09.10.2018).
    public model:any = {date: {year: 2018, month: 10, day: 9}};
    onAllSelect = false;
    string = '';
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;

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
    }

    ngOnInit() {
        this.ckeConfig = {
            height: 200,
            language: "en",
            allowedContent: true,
            mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',
            extraPlugins: 'widget,widgetselection,lineutils,dialog,clipboard,mathjax,table,image2,font,scayt',
            toolbar: [
                {
                    name: 'clipboard',
                    items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
                },
                {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker']},
                {name: 'styles', items: ['Format', 'Font', 'FontSize']},
                {name: 'colors', items: ['TextColor', 'BGColor']},
                {name: 'insert', items: ['Table', 'Mathjax', 'Image']},
                {
                    name: 'basicstyles',
                    items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat']
                },
                {
                    name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
                },
                {name: 'scayt', items: ['Scayt']}
            ],
            removePlugins: 'elementspath',
            resize_enabled: false,
            wordcount: {
                // Whether or not you want to show the Paragraphs Count
                showParagraphs: false,
                // Whether or not you want to show the Word Count
                showWordCount: false,
                // Whether or not you want to show the Char Count
                showCharCount: true,
                // Whether or not you want to count Spaces as Chars
                countSpacesAsChars: true,
                // Whether or not to include Html chars in the Char Count
                countHTML: false,
                // Maximum allowed Word Count, -1 is default for unlimited
                maxWordCount: -1,
                // Maximum allowed Char Count, -1 is default for unlimited
                ///   maxCharCount: this.element.getAttribute('maxlength'),
                // Add filter to add or remove element before counting (see CKEDITOR.htmlParser.filter), Default value : null (no filter)

            }
        };
        this.PersonalityForm = this.formBuilder.group({
            personalityName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            personalityType: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            ProjectDescription: ['', [Validators.required, Validators.minLength(5), , Validators.maxLength(500)]],
            YearAdd: ['', [Validators.required]],
            StartDate: ['', [Validators.required]],
        });


    }

    get f() {
        return this.PersonalityForm.controls;
    }

    getNumber(data) {
        console.log("getNumber----" + data)
    }

    getFileType() {
    }

    getImageFileFolderName():string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Staff/';
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
        /*   this.getFileSize();*/
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    /*getFileSize() {
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
     }*/
    goToReset() {
        this.chosenFileName = "";
        this.chosenFileType = "";
        /*this.chosenFileSize='';*/
        this.url = 'assets/img/no_image.png';
        this.onAllSelect = false
    }


    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.PersonalityForm.invalid) {
            return;
        }
        console.log("this.selectedItems===" + JSON.stringify(this.selectedItems))
        if (this.StartDate != '') {
            var startDate = new Date(this.StartDate);
            this.YearAdd = (startDate.getFullYear().toString());
        }


    }

    updateMyDate(newDate) {
        console.log("newDate======" + newDate)
    }


    // need to move common
    refresh():void {
        window.location.reload();
    }

    private assignpersonalityParams() {
        var url = this.getImageFileFolderName();
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
    }

}