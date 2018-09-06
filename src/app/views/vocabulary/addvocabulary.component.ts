/**
 * Created by priya on 04/09/18.
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
import { GetCourse } from '../_models/GetCourse';
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

@Component({
    templateUrl: 'addvocabulary.component.html',
    styleUrls: ['./vocabulary.component.scss'],
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
})
export class AddVocabularyComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    addVocabulary = new AddVocabulary();
    departmentData = new Department();
    courseData = new GetCourse();
    departmentList:Department [];
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



    selectedFiles:FileList;
    imageUrl = 'assets/img/no_image.png';
    file:File;

    uploadVideoFileName = '';
    selectedVideoFiles:FileList;
    videoUrl = 'assets/img/no_image.png';
    videoFile:File;

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
        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.courseList != null) {
                if (this.courseList.length == 0) {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add Vocabulary...");
                } else {
                    if (this.courseList.length == 1) {
                        this.selectedCourseData = this.courseList[0];
                    }
                }
            }
            else {
                this.toastr.error('', "No Course for this selected department.. so cant able to add Vocabulary...");
            }

            return;
        }
        // stop here if form is invalid
        if (this.vocabularyForm.invalid) {
            return;
        }


        this.assignVocabularyParams();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }


    assignVocabularyParams() {
        console.log("this.chosenFileName======" + this.chosenFileName)
        console.log("this.chosenVideoFileName======" + this.chosenVideoFileName)


        if (this.chosenFileName != '') {
            var url = this.getImageFileFolderName();
            const file = this.selectedFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addVocabulary.imageUrl = this.getUploadFileName(this.chosenFileName);
        }
        this.addVocabulary.word = this.vocabularyForm.value.vocabularyName;
        this.addVocabulary.wordType = this.vocabularyForm.value.vocabularyType;
        this.addVocabulary.synonyms = this.vocabularyForm.value.synonyms;
        this.addVocabulary.antonyms = this.vocabularyForm.value.antonyms;
        this.addVocabulary.origin = this.vocabularyForm.value.orgin;
        this.addVocabulary.usageInSentence = this.vocabularyForm.value.usageInSentence;
        this.addVocabulary.publishingDate = this.vocabularyForm.value.publishDate.getTime();
        this.addVocabulary.userId = this.userData.userId;
        this.addVocabulary.vocabularyId = 0;
        this.addVocabulary.instituteId = this.userData.instituteId
        this.addVocabulary.departmentId = this.selectedDepartmentData.departmentId;
        this.addVocabulary.courseId = this.selectedCourseData.courseId;
        console.log("addVocabulary parms=====>" + JSON.stringify(this.addVocabulary));
        this.apiForAddVocabulary();

    }

    apiForAddVocabulary() {
        this.insmanagerService.addVocabularyWithPromise(this.addVocabulary)
            .then(resData => {
                console.log("resData======================" + JSON.stringify(resData));
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.toastr.success('', "Vocabulary added successfully! ");
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        ///   this.router.navigate(['vocabulary/vocabulary-list']);
                    }, 1000);

                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
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
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

            }

        }
    }


    selectVideoFile(event) {
        this.selectedVideoFiles = event.target.files;
        let files:FileList = event.target.files;
        this.videoFile = files[0];
        ///  console.log("video file====="+this.videoFile)
        this.chosenVideoFileName = event.target.files[0].name;
        this.chosenVideoFileType = event.target.files[0].type;
        this.chosenVideoFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.videoUrl = event.target.result;
                /////   console.log("video file====="+this.videoUrl)
            }
            reader.readAsDataURL(event.target.files[0]);
        }


        if (this.chosenVideoFileName != '') {
            if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
                this.toastr.error('', "Choose Department");
                return;
            } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
                if (this.courseList != null) {
                    if (this.courseList.length == 0) {
                        this.toastr.error('', "No Course for this selected department.. so cant able to add Vocabulary...");
                    } else {
                        if (this.courseList.length == 1) {
                            this.selectedCourseData = this.courseList[0];
                        }
                    }
                }
                else {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add Vocabulary...");
                }

                return;
            }
            this.videoUrl = this.getUploadFileName(this.chosenVideoFileName);
            var url = this.getVideoFileFolderName();
            const file = this.selectedVideoFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addVocabulary.videoUrl = this.getUploadFileName(this.chosenVideoFileName);
        }
    }

    getUploadFileName(data) {
        var FOLDER = this.getVideoFileFolderName();
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + data;
        console.log('uploadFileName=======', this.uploadFileName);
        return this.uploadFileName;
    }

    getImageFileFolderName():string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + '/Vocabulary/image/';
    }

    getVideoFileFolderName():string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/' + this.selectedCourseData.courseId + '/Vocabulary/video/';
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
                this.imageUrl = event.target.result;
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

    goToViewAllList() {
        this.router.navigate(['/vocabulary/vocabulary-list'])

    }
}