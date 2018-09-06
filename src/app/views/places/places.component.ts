/**
 * Created by priya on 03/09/18.
 */
/**
 * Created by priya on 30/08/18.
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

import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
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

@Component({templateUrl: 'places.component.html',
    styleUrls: ['./places.component.scss'],
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
})
export class PlacesComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    addVocabulary= new AddVocabulary();
    palcesForm:FormGroup;
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    timer:any;
    isConnected: Observable<boolean>;
    vocabularyStartDate = '';
    minDate = new Date();
    maxDate = new Date(2020, 0, 1);
    // Initialized to specific date (09.10.2018).
    public model:any = {date: {year: 2018, month: 10, day: 9}};
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;
    videoUrl:string;
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

        this.palcesForm = this.formBuilder.group({
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
            mathJaxLib : '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML',
            extraPlugins : 'widget,widgetselection,lineutils,dialog,clipboard,mathjax,table,image2,font,scayt',
            toolbar:  [
                {
                    name: 'clipboard',
                    items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
                },
                {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker']},
                {name: 'styles', items: ['Format', 'Font', 'FontSize']},
                {name: 'colors', items: ['TextColor', 'BGColor']},
                {name: 'insert', items: ['Table', 'Mathjax','Image']},
                {
                    name: 'basicstyles',
                    items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
                },
                {
                    name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
                },
                {name: 'scayt', items: ['Scayt']}
            ],
            removePlugins: 'elementspath',
            resize_enabled : false,
            wordcount : {
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

    }



    // convenience getter for easy access to form fields
    get f() {
        return this.palcesForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.palcesForm.invalid) {
            return;
        }
        this.assignPalcesParams();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }


    assignPalcesParams()
    {
        this.addVocabulary.word=this.palcesForm.value.vocabularyName;
        this.addVocabulary.wordType=this.palcesForm.value.vocabularyType;
        this.addVocabulary.synonyms=this.palcesForm.value.synonyms;
        this.addVocabulary.antonyms=this.palcesForm.value.antonyms;
        this.addVocabulary.origin=this.palcesForm.value.orgin;
        this.addVocabulary.usageInSentence=this.palcesForm.value.usageInSentence;
        this.addVocabulary.publishingDate=this.palcesForm.value.publishDate;
        this.addVocabulary.videoUrl=this.videoUrl;
        console.log("addVocabulary parms=====>"+JSON.stringify(this.addVocabulary))

    }

    goToAddPlace()
    {
        this.router.navigate(['places/add-places']);
    }
}