/**
 * Created by priya on 30/08/18.
 */
import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild} from '@angular/core';
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

import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { AddCourse } from '../_models/AddCourse';
import { Department } from '../_models/Department';
import { AddVocabulary } from '../_models/AddVocabulary';
import { GetVocabulary } from '../_models/GetVocabulary';
import { GetCourse } from '../_models/GetCourse';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';
import { DatePipe } from '@angular/common';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataTableResource } from 'angular4-smart-table';
import { DomSanitizer } from '@angular/platform-browser'
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
    templateUrl: 'vocabulary.component.html',
    styleUrls: ['./vocabulary.component.scss'],
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
})
export class VocabularyComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    addVocabulary = new AddVocabulary();
    departmentData = new Department();
    courseData = new GetCourse();
    departmentList:Department [];
    vocabularyList:AddVocabulary [];
    courseList:GetCourse [];
    vocabularyForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    timer:any;
    isConnected:Observable<boolean>;
    vocabularyStartDate = '';
    minDate = new Date();
    maxDate = new Date(2020, 0, 1);
    // Initialized to specific date (09.10.2018).
    public model:any = {date: {year: 2018, month: 10, day: 9}};
    msgInPopup='';
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;

    selectedDepartmentData = null;
    selectedCourseData = null;

    chosenFileName = '';
    chosenFileType = '';
    chosenFileSize = '';
    chosenVideoFileName = '';
    chosenVideoFileType = '';
    chosenVideoFileSize = 0;
    uploadFileName = '';

    desData="No Vocabulary Found"

    selectedFiles:FileList;
    imageUrl = 'assets/img/no_image.png';
    file:File;

    uploadVideoFileName = '';
    selectedVideoFiles:FileList;
    videoUrl = 'assets/img/no_image.png';
    videoFile:File;


    itemResource = new DataTableResource(this.departmentList);
    items = [];
    itemCount = 0;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private _sanitizer:DomSanitizer,
                private toastr:ToastrService,
                private spinnerService:Ng4LoadingSpinnerService,
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

        this.vocabularyForm = this.formBuilder.group({
            vocabularyName: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            vocabularyType: ['', [Validators.required]],
            publishDate: ['', [Validators.required]],
            synonyms: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            antonyms: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            orgin: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
            usageInSentence: ['', [Validators.required, Validators.minLength(3), , Validators.maxLength(100)]],
        });
        this.ckeConfig = {
            height: 130,
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
        this.getAllDepartmentList();
    }


    // convenience getter for easy access to form fields
    get f() {
        return this.vocabularyForm.controls;
    }



    onSubmit() {
        this.submitted = true;

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }
    // need to move pipe
    assembleHTMLItem(data) {
        return this._sanitizer.bypassSecurityTrustHtml(data);
    }



    apiForGettingAllVocabularyList(pageno) {
        this.spinnerService.show();
        var vocabulary_all_get_url = this.baseUrl + this.configFile.getall_vocabulary_url;
        vocabulary_all_get_url = vocabulary_all_get_url.replace('{courseId}', this.selectedCourseData.courseId);
        vocabulary_all_get_url = vocabulary_all_get_url.replace('{pageNumber}', pageno);
        console.log("voca url===="+vocabulary_all_get_url)
        this.insmanagerService.getAllVocabularyWithPromise(vocabulary_all_get_url)
            .then(resData=> {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    if(data.data.content!=null) {
                        this.vocabularyList = data.data.content;
                        console.log("vocabularyList========" + JSON.stringify(this.vocabularyList));
                        this.desData = '';
                        this.setDataSourceInList(this.vocabularyList);
                    }else
                    {
                        this.vocabularyList=[];
                        this.setDataSourceInList(this.vocabularyList);
                    }

                } else {
                    this.spinnerService.hide();
                    this.vocabularyList=[];
                    this.setDataSourceInList(this.vocabularyList);
                    this.desData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    setDataSourceInList(data) {
        this.itemResource = new DataTableResource(data);
        this.itemResource.count().then(count => this.itemCount = count);
        this.reloadItems(this.itemResource);
        if (data.length < 10) {
            this.itemCount = data.length;
        }
    }


    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) {
        return item.jobTitle;
    }

    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList():void {
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    this.selectedCourseData = this.courseList[0];
                    this.apiForGettingAllVocabularyList(0);
                    console.log("selectedCourseData========" + JSON.stringify(this.selectedCourseData));
                } else {
                    this.courseList = [];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name == data) {
                this.selectedDepartmentData = this.departmentList[i];
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                this.getAllCouseList();
            }

        }
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.name == data) {
                this.selectedCourseData = this.courseList[i];
                this.apiForGettingAllVocabularyList(0);
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

            }

        }
    }





    goToAddVocabulary()
    {
        this.router.navigate(['/vocabulary/add-vocabulary'])
    }
    goToDeleteVocabularyPopUp(data):void {
        console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupvocabulary",data);
        this.childModal.show();
        this.msgInPopup='Do you want to delete '+data.word;

    }
}