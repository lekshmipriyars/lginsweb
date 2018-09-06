/**
 * Created by priya on 10/07/18.
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
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import  {AddTask}from '../_models/AddTask';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';

@Component({
    selector: 'app-student',
    templateUrl: 'addtask.component.html',
    styleUrls: ['./task.component.scss']

})
export class AddTaskComponent implements OnInit {

    //ck editor initalization
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;

    ckeditorContent = '';
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addTask = new AddTask();
    departmentData = new Department();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    departmentList:Department [];
    courseList:GetCourse [];
    taskForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    isDepartment = false;
    isImage = false;
    isCourse = false;
    data = '';
    sendUserTypeList:number[] = [];
    sendToDOId:number[] = [];
    public handleError;
    errorMessage:String;
    stLastName:string;
    selectedFiles:FileList;
    url = 'assets/img/no_image.png';
    file:File;
    chosenFileName = '';
    contentType = 0;
    chosenExtension = '';
    chooseTypeData = 0;
    chosenFileType = '';
    chosenFileSize = '';
    sendTypeId = 0;
    gender_value = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    chooseTypesDatas = [{'id': '1', 'name': 'Department'}, {'id': '2', 'name': 'Course'}, {
        'id': '3',
        'name': 'Indvidual'
    }];
    // need to write down in common
    content_file_type_extension_name = ['.pdf', '.doc', '.docx', '.txt', '.mp4', '.mp3', '.png', '.jpg', '.wmv', '.avi', '.mov', '.jpeg', '.gif', '.3gp'];
    content_file_type_name = ['PDF Document', 'Microsoft Word Document', 'Microsoft Word Document', 'Text File', 'MPEG 4 Video', 'MPEG 3 Audio', 'Portable Network Graphics', 'Joint Photographic Group', 'Windows Media Video', 'Audio Video Interleaved(AVI)', 'Metal Oxide Varistor(MOV)', 'Joint Photographic Expert Group', '3GP', 'GIF'];
    isConnected: Observable<boolean>;
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
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
        }

    }

    ngOnInit() {
        //ckEditor configuarations
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


        this.taskForm = this.formBuilder.group({
            chosenFileName: ['', [Validators.required]],
            chosenFileType: ['', [Validators.required]],
            chosenFileSize: ['', [Validators.required]],
        });
        this.getAllDepartmentList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.taskForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.taskForm.invalid) {
            return;
        }


        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.chooseTypeData == 2) {
                if (this.courseList != null) {
                    if (this.courseList.length == 0) {
                        this.toastr.error('', "No Course for this selected department.. so cant able to add diary.....");
                    } else {
                        this.toastr.error('', "Choose Course");
                    }
                }
                else {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add diary...");
                }
            }
            return;
        } else if (this.selectedFiles == undefined) {
            this.toastr.error('', "Choose Image ");
            return;
        } else if (this.ckeditorContent == '' || this.ckeditorContent == undefined || this.ckeditorContent == '') {
            this.toastr.error('', "Add Description");
        }
        this.assignTaskAddParams();
        console.log("parms====" + JSON.stringify(this.addTask));
        this.addTaskApi();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }


    private assignTaskAddParams() {
        this.getFileType();
        this.sendUserTypeList = [];
        this.getTODOIDs();
        this.sendUserTypeList.push(INSTITUTE_TYPES.USER_TYPE_STUDENT);
        this.sendUserTypeList.push(INSTITUTE_TYPES.USER_TYPE_STAFF);
        var url = this.userData.instituteId + '/Diary/';
        const file = this.selectedFiles.item(0);
        this.uploadService.uploadfile(file, url);
        this.getUploadFileName();
        this.addTask.message = this.ckeditorContent;
        this.addTask.fromUserId = this.userData.userId;
        this.addTask.sentTypeId = this.sendTypeId;
        this.addTask.content = this.crypto.encryptByAES(this.uploadFileName);
        this.addTask.contentType = this.contentType;
        this.addTask.toId = this.sendToDOId;
        this.addTask.userTypeList = this.sendUserTypeList;


    }

    getUploadFileName() {
        var FOLDER = this.userData.instituteId + '/Diary/';
        var devBucketURL = "https://insbetaresources.s3.ap-southeast-1.amazonaws.com/";
        /// var prodBucketURL = "http://insresources.s3.amazonaws.com/";
        var imagebaseUrL = 'https://betacontent.learnerguru.com/';
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
    }


    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
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
                    console.log("courseList========" + JSON.stringify(this.courseList));
                } else {
                    this.courseList.length = 0;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    addTaskApi():void {
        this.insmanagerService.addTaskWithPromise(this.addTask)
            .then(taskAddData => {
                console.log("diaryAddData======================" + JSON.stringify(taskAddData));
                var data = JSON.parse(JSON.stringify(taskAddData));
                if (data.status.success) {
                    this.toastr.success('', "Task message added successfully! ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
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
        var extensionIndex = this.chosenFileName.lastIndexOf('.');
        this.isImage = false;
        this.chosenExtension = this.chosenFileName.substring(extensionIndex).toUpperCase();
        if (this.content_file_type_extension_name[content_file_type_extension.PNG - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = true;
            this.contentType = contentType.IMAGE;
            this.chosenFileType = this.content_file_type_name[content_file_type.PNG - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.JPG - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = true;
            this.contentType = contentType.IMAGE;
            this.chosenFileType = this.content_file_type_name[content_file_type.JPG - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.JPEG - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = true;
            this.contentType = contentType.IMAGE;
            this.chosenFileType = this.content_file_type_name[content_file_type.JPEG - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.GIF - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = true;
            this.contentType = contentType.IMAGE;
            this.chosenFileType = this.content_file_type_name[content_file_type.GIF - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.PDF - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = false;
            this.contentType = contentType.PDF;
            this.chosenFileType = this.content_file_type_name[content_file_type.PDF - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.DOCX - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = false;
            this.contentType = contentType.WORD;
            this.chosenFileType = this.content_file_type_name[content_file_type.DOCX - 1];
        } else if (this.content_file_type_extension_name[content_file_type_extension.DOC - 1].toUpperCase() === this.chosenExtension) {
            this.isImage = false;
            this.contentType = contentType.WORD;
            this.chosenFileType = this.content_file_type_name[content_file_type.DOC - 1];
        } else {
            this.contentType = 0;
            this.chosenFileType = 'Unknown File Type';
        }
    }

    getFileSize() {
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

    //ck editor change event
    onEditorChange(event):void {
        //// console.log('onEditorChange data: ' + event.editor.getData());
        this.ckeditorContent = event.editor.getData()
    }

    getChooseTypeValue(data) {
        this.chooseTypeData = data.id;
        if (this.chooseTypeData == 1) {
            this.isDepartment = true;
            this.isCourse = false;
            this.sendTypeId = SENDMESSAGE_TYPEID.DEPARTMENT;
        } else if (this.chooseTypeData == 2) {
            this.isDepartment = true;
            this.isCourse = true;
            this.sendTypeId = SENDMESSAGE_TYPEID.COURSE;
        }
        else {
            this.isDepartment = true;
            this.isCourse = true;
            this.sendTypeId = SENDMESSAGE_TYPEID.INDIVIGUAL;
        }
    }

    getTODOIDs() {
        this.sendToDOId = [];
        if (this.chooseTypeData == 1) {
            this.sendToDOId.push(this.selectedDepartmentData.departmentId);
        } else if (this.chooseTypeData == 2) {
            this.sendToDOId.push(this.selectedCourseData.courseId);
        } else if (this.chooseTypeData == 3) {
            ///  this.sendToDOId = getUserIds(thisselected);
        }
    }


}


