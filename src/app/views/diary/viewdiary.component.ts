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
import { AddStudent } from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { AddDiary } from '../_models/AddDiary';
import { SendDiary } from '../_models/SendDiary';
import {GetDiary} from '../_models/GetDiary';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';

@Component({
    selector: 'app-student',
    templateUrl: 'viewdiary.component.html',
    styleUrls: ['./diary.component.scss']

})
export class ViewDiaryComponent implements OnInit {

    //ck editor initalization
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;

    ckeditorContent = '';
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addDiary = new AddDiary();
    sendDiary= new SendDiary();
    departmentData = new Department();
    getDairyData = new GetDiary();
    courseData = new GetCourse();
    configFile = new ConfigFile();
    departmentList:Department [];
    diaryList:GetDiary[];
    getMessagesFromSender:GetDiary[];
    courseList:GetCourse [];
    viewDiaryForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    isDepartment = false;
    isImage = false;
    isCourse = false;
    data = '';
    sendUserTypeList:number[] = [];
    sendToDOId:number[] = [];
    diaryPageNo = 0;
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
    hourData = '';
    miniuteData = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    totalPages = 0;
    totalElements = 0;
    selectedPeopleToChat = new GetDiary();
    getMessagesFromSenderData = new GetDiary();
    selectedDiaryId = 0;
    replyMessage = '';
    replyContent = '';
    chooseTypesDatas = [{'id': '1', 'name': 'Department'}, {'id': '2', 'name': 'Course'}, {
        'id': '3',
        'name': 'Indvidual'
    }];
    // need to write down in common
    content_file_type_extension_name = ['.pdf', '.doc', '.docx', '.txt', '.mp4', '.mp3', '.png', '.jpg', '.wmv', '.avi', '.mov', '.jpeg', '.gif', '.3gp'];
    content_file_type_name = ['PDF Document', 'Microsoft Word Document', 'Microsoft Word Document', 'Text File', 'MPEG 4 Video', 'MPEG 3 Audio', 'Portable Network Graphics', 'Joint Photographic Group', 'Windows Media Video', 'Audio Video Interleaved(AVI)', 'Metal Oxide Varistor(MOV)', 'Joint Photographic Expert Group', '3GP', 'GIF'];
    isConnected: Observable<boolean>;
    constructor(private formBuilder:FormBuilder, public _http:Http,
                private router:Router,
                private spinnerService:Ng4LoadingSpinnerService,
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
            this.diaryPageNo = this.localStorageService.get('diaryPageNo');
            if (this.diaryPageNo == undefined || this.diaryPageNo == null) {
                this.localStorageService.set('diaryPageNo', 0);
                this.diaryPageNo = this.localStorageService.get('diaryPageNo');
            }
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


        this.viewDiaryForm = this.formBuilder.group({
            chosenFileName: [''],
            chosenFileType: [''],
            chosenFileSize: [''],
            ckeditorContent: ['', [Validators.required]]
        });

        this.getDiaryList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.viewDiaryForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.viewDiaryForm.invalid) {
            ///// return;
        }

        if (this.ckeditorContent == '' || this.ckeditorContent == undefined || this.ckeditorContent == '') {
            this.toastr.error('', "Add Message");
        }
        this.assignSendDiaryAddParams();
        console.log("parms====" + JSON.stringify(this.sendDiary));
        this.sendMessageDiaryApi();
    }

    // need to move common
    refresh():void {
        window.location.reload();
    }


    private assignSendDiaryAddParams() {
        if(this.chosenFileName!='') {
            this.getFileType();
            var url = this.userData.instituteId + '/SendDiary/' + this.userData.userId + '/';
            const file = this.selectedFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.getUploadFileName();
            this.sendDiary.content = this.crypto.encryptByAES(this.uploadFileName);
            this.sendDiary.contentType = this.contentType;
        }else
        {
            this.sendDiary.content ='';
            this.sendDiary.contentType =0;
        }
        this.sendDiary.message =this.ckeditorContent;
        this.sendDiary.userId = this.userData.userId;
        this.sendDiary.diaryId = this.selectedDiaryId;

    }


    sendMessageDiaryApi():void {
        this.insmanagerService.sendMessageWithPromise(this.sendDiary)
            .then(sendDiaryAddData => {
                console.log("sendDiaryAddData======================" + JSON.stringify(sendDiaryAddData));
                var data = JSON.parse(JSON.stringify(sendDiaryAddData));
                if (data.status.success) {
                    this.toastr.success('', "Send Dairy message added successfully! ");
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getUploadFileName() {
        var FOLDER = this.userData.instituteId + '/SendDiary/'+this.userData.userId+'/';
        var devBucketURL = "https://insbetaresources.s3.ap-southeast-1.amazonaws.com/";
        /// var prodBucketURL = "http://insresources.s3.amazonaws.com/";
        var imagebaseUrL = 'https://betacontent.learnerguru.com/';
        this.uploadFileName = imagebaseUrL + FOLDER + this.chosenFileName;
        console.log('uploadFileName=======', this.uploadFileName);
    }


    getDiaryList():void {
        this.spinnerService.show();
        var diary_get_url = this.baseUrl + 'diary/get/{userId},{pageNumber}';
        diary_get_url = diary_get_url.replace('{userId}', this.userData.userId.toString());
        diary_get_url = diary_get_url.replace('{pageNumber}', this.diaryPageNo.toString());
        this.insmanagerService.getDiaryListWithPromise(diary_get_url)
            .then(diaryData=> {
                var data = JSON.parse(JSON.stringify(diaryData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.diaryList = data.data.content;
                    this.totalPages = data.data.totalPages;
                    this.totalElements = data.data.totalElements;
                    this.localStorageService.set('diaryPageNo', data.data.number);
                    this.diaryPageNo = this.localStorageService.get('diaryPageNo');
                    console.log("totalPages========" + JSON.stringify(data.data));
                    console.log("diaryList========" + JSON.stringify(this.diaryList));

                    this.diaryList.forEach((key:any, val:any) => {
                        this.userData = key.fromUserEntity;
                        this.userData.userName = (this.userData.userName != null || this.userData.userName != undefined || this.userData.userName != '') ? this.crypto.decryptByAES(this.userData.userName) : '';
                        this.userData.profileImage = (this.userData.profileImage == null || this.userData.profileImage == undefined || this.userData.profileImage == '') ? '' : this.crypto.decryptByAES(this.userData.profileImage);
                        this.userData.emailId = (this.userData.emailId == null || this.userData.emailId == undefined || this.userData.emailId == '') ? '' : this.crypto.decryptByAES(this.userData.emailId);
                        this.userData.fName = (this.userData.fName == null || this.userData.fName == undefined || this.userData.fName == '') ? '' : this.crypto.decryptByAES(this.userData.fName);
                        this.userData.lName = (this.userData.lName == null || this.userData.lName == undefined || this.userData.lName == '') ? '' : this.crypto.decryptByAES(this.userData.lName);
                        this.userData.location = (this.userData.location == null || this.userData.location == undefined || this.userData.location == '') ? '' : this.crypto.decryptByAES(this.userData.location);
                        this.userData.address = (this.userData.address == null || this.userData.address == undefined || this.userData.address == '') ? '' : this.crypto.decryptByAES(this.userData.address);

                        //// this.diaryList.fromUserEntity=this.userData;
                        key.messageTime = this.formattime(key.messageTime)
                    })

                    console.log("diaryList========" + JSON.stringify(this.diaryList));

                    this.selectedPeopleToChat = this.diaryList [0];
                    this.selectedDiaryId = this.diaryList[0].diaryId;
                    this.clickedPerson(this.diaryList [0]);


                } else {
                    this.spinnerService.hide();
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    clickedPerson = function (people) {
        this.selectedPeopleToChat = people;
        this.selectedDiaryId = people.diaryId;
        /// console.log("selectedPeopleToChat --------" + this.selectedPeopleToChat.diaryId);
        this.resetInDiary();
        this.getAllMessages(people);
    };
    resetInDiary = function () {

    }


    getStyleBackground = function (person) {
        var color;
        if (person.visibility == DIARY_SEEN_STATUS.NOT_VISITED) {
            color = 'red';
        } else if (person.visibility == DIARY_SEEN_STATUS.VISITED_NOT_OPEN) {
            color = 'green';
        } else {
            color = 'blue';
        }
        return {"background-color": color};
    }

    getAllMessages = function (people) {
        this.selectedDiaryId = people.diaryId;
        var Url = this.baseUrl + 'diary/history/get/{indexValue}';
        Url = Url.replace('{indexValue}', people.indexValue);
        Url = Url.replace('{userId}', this.userData.userId);

        this.insmanagerService.getViewDiaryListWithPromise(Url)
            .then(viewDiaryData=> {
                var data = JSON.parse(JSON.stringify(viewDiaryData));
                if (data.status.success) {
                    this.spinnerService.hide();
                    this.getMessagesFromSender = data.data;

                    this.getMessagesFromSender.forEach((key:any, val:any) => {
                        this.userData = key.fromUserEntity;
                        this.userData.userName = (this.userData.userName != null || this.userData.userName != undefined || this.userData.userName != '') ? this.crypto.decryptByAES(this.userData.userName) : '';
                        this.userData.profileImage = (this.userData.profileImage == null || this.userData.profileImage == undefined || this.userData.profileImage == '') ? '' : this.crypto.decryptByAES(this.userData.profileImage);
                        this.userData.emailId = (this.userData.emailId == null || this.userData.emailId == undefined || this.userData.emailId == '') ? '' : this.crypto.decryptByAES(this.userData.emailId);
                        this.userData.fName = (this.userData.fName == null || this.userData.fName == undefined || this.userData.fName == '') ? '' : this.crypto.decryptByAES(this.userData.fName);
                        this.userData.lName = (this.userData.lName == null || this.userData.lName == undefined || this.userData.lName == '') ? '' : this.crypto.decryptByAES(this.userData.lName);
                        this.userData.location = (this.userData.location == null || this.userData.location == undefined || this.userData.location == '') ? '' : this.crypto.decryptByAES(this.userData.location);
                        this.userData.address = (this.userData.address == null || this.userData.address == undefined || this.userData.address == '') ? '' : this.crypto.decryptByAES(this.userData.address);


                        this.toUserData = key.toUserEntity;
                        this.toUserData.userName = (this.toUserData.userName != null || this.toUserData.userName != undefined || this.toUserData.userName != '') ? this.crypto.decryptByAES(this.toUserData.userName) : '';
                        this.toUserData.profileImage = (this.toUserData.profileImage == null || this.toUserData.profileImage == undefined || this.toUserData.profileImage == '') ? '' : this.crypto.decryptByAES(this.toUserData.profileImage);
                        this.toUserData.emailId = (this.toUserData.emailId == null || this.toUserData.emailId == undefined || this.toUserData.emailId == '') ? '' : this.crypto.decryptByAES(this.toUserData.emailId);
                        this.toUserData.fName = (this.toUserData.fName == null || this.toUserData.fName == undefined || this.toUserData.fName == '') ? '' : this.crypto.decryptByAES(this.toUserData.fName);
                        this.toUserData.lName = (this.toUserData.lName == null || this.toUserData.lName == undefined || this.toUserData.lName == '') ? '' : this.crypto.decryptByAES(this.toUserData.lName);
                        this.toUserData.location = (this.toUserData.location == null || this.toUserData.location == undefined || this.toUserData.location == '') ? '' : this.crypto.decryptByAES(this.toUserData.location);
                        this.toUserData.address = (this.toUserData.address == null || this.toUserData.address == undefined || this.toUserData.address == '') ? '' : this.crypto.decryptByAES(this.toUserData.address);


                        //// this.diaryList.fromUserEntity=this.userData;
                        key.messageTime = this.formattime(key.messageTime);

                        if (key.toUserId == this.userData.userId) {
                            this.replyMessage = key.replyMessage;
                            this.replyContent = key.replyContent;
                            console.log("toUserId====" + key.toUserId);
                            console.log("replyContent====" + key.replyContent);
                            console.log("replyMessage====" + key.replyMessage);
                        }

                    });
                    var myObj = {
                        "leftArray": this.getMessagesFromSender[0],    //your leftArray variable
                        "rightArray": this.getMessagesFromSender   //your rightArray variable
                    };
                    this.getMessagesFromSenderData = myObj;

                    console.log("getMessagesFromSenderData========" + JSON.stringify(this.getMessagesFromSenderData));


                } else {
                    this.spinnerService.hide();
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);

    }


    formattime = function (date_obj) {
        var time = new Date(date_obj);
        var hour = time.getHours();
        var minute = time.getMinutes();
        this.minuteData = minute.toString()
        var amPM = (hour > 11) ? "PM" : "AM";
        if (hour > 12) {
            hour -= 12;
            this.hourData = hour.toString()
        } else if (hour === 0) {
            this.hourData = "12";
        }
        if (minute < 10) {
            this.minuteData = "0" + minute;
        }
        return this.hourData + ":" + this.minuteData + " " + amPM;
    }

    formatDate = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        return strTime;
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
                /////  this.getAllCouseList();
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


export enum DIARY_SEEN_STATUS  {
    NOT_VISITED = 0,
    VISITED_NOT_OPEN = 1,
    VISITED_AND_OPEN = 2,
}