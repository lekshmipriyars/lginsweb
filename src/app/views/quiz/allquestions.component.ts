/**
 * Created by priya on 21/08/18.
 */
import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild,Pipe, PipeTransform,ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
import { DomSanitizer } from '@angular/platform-browser'
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
import { AddExam } from '../_models/AddExam';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {AddStudent} from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { GetExamType } from '../_models/GetExamType';
import { GetQuestion } from '../_models/GetQuestion';
import { AddSubject } from '../_models/AddSubject';
import { GetSubject } from '../_models/GetSubject';
import { GetChapter } from '../_models/GetChapter';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
import { UserGetData } from '../_models/usergetdata';
import { GetQuestionParms } from '../_models/GetQuestionParms';
import { DataTableResource } from 'angular4-smart-table';
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
import { question_type,ConfigFile,INSTITUTE_TYPES,
    SENDMESSAGE_TYPEID,
    content_file_type_extension,
    contentType,
    content_file_type } from '../services/configfile';
@Component({
    selector: 'app-student',
    templateUrl: 'allquestions.component.html',
    styleUrls: ['./quiz.component.scss'],
    encapsulation: ViewEncapsulation.None

})

@NgModule({
    declarations: [],
    exports: [],
    providers: [],
})
export class AllQuestionsComponent implements OnInit {
    baseUrl = environment.baseUrl;
    crypto = new BasicCrptoCredentials();
    configFile = new ConfigFile();
    questionList:GetQuestion [];
    departmentList:Department [];
    subjectList:GetSubject [];
    courseList:GetCourse [];
    chapterList:GetChapter [];
    addSubject = new AddSubject();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    chapterData = new GetChapter();
    getQuestionParamData = new GetQuestionParms();
    getUserListParamData = new GetUserListParamData();
    userTypeIdList:number[] = [];
    userGetDataList:UserListTempData [] = [];
    userTempGetDataList:UserGetData [] = []
    userData = new UserGetData();
    userTempData = new UserGetData();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    selectedChapterData = null;
    selectedUserData = null;
    selectedDepartmentId = 0;
    selectedCourseId = 0;
    selectedSubjectId = 0;
    selectedChapterId = 0;
    editStaffForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    gender_value = '';
    timer:any;
    desData = 'No Question Found';
    desSubjectData = 'No Subject Found'
    backgroundImage = '../assets/img/search-icon.png';
    msgInPopup = "";
    msgInDeletePopup = '';


    showMultipleChoice = false;
    showMultipleChoiceImage = false;
    showMultipleChoiceDirection = false;
    showFillup = false;
    showMatchFollowing = false;
    showTrueFalse = false;
    showOneMark = false;
    showSyllogismOne = false;
    showSyllogismTwo = false;
    showSyllogismThree = false;
    showSyllogism = false;
    showOtherTypeQuestion = false;

    questionTypes = this.configFile.questionTypes_Data;
    questionUsage = this.configFile.ques_usage;
    qModelData = null;
    quesErrorType = this.configFile.ques_error_type;
    qErrorTypeData = null;
    quesExplanationType = this.configFile.ques_explanation_type;
    qExplanationData = null;
    selectedQuestionType = null;
    selectedExplanationType = null;
    selectedErrorType = null;
    selectedUsageType = null;
    questionType = 0;
    totalPages = 0;
    pageNumberInQues = 0;
    questionsCount:number;
    questionCount = 0;
    isConnected:Observable<boolean>;
    @ViewChild('warningModal') public childModal:ModalDirective;
    maxSize: number;
    currentPage: number;
    numPages: number;



    itemResource = new DataTableResource(this.departmentList);
    items = [];
    itemCount = 0;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private _sanitizer:DomSanitizer,
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



    setPage(pageNo: number): void {
        this.currentPage = pageNo;
    }

    ngOnInit() {
        this.desData = 'No Question Found';
        this.getQuestionType(this.questionTypes[0].id);
        this.selectedQuestionType = this.questionTypes[0];
        this.selectedExplanationType = this.quesExplanationType[0];
        this.selectedErrorType = this.quesErrorType[0];
        this.selectedUsageType = this.questionUsage[0];
        this.getAllDepartmentListInViewQues();
        this.questionList = [];

    }

    refresh():void {
        window.location.reload();
    }

    getQuestionType(questionType) {
        this.questionType = questionType;
        this.showMultipleChoice = ( questionType === question_type.QUESTION_TYPE_MULTIPLE_CHOICE);
        this.showMultipleChoiceImage = ( questionType === question_type.QUESTION_TYPE_MULTIPLE_CHOICE_IMAGE);
        this.showMultipleChoiceDirection = ( questionType === question_type.QUESTION_TYPE_MULTIPLE_CHOICE_DIRECTION);
        this.showFillup = ( questionType === question_type.QUESTION_TYPE_FILL_IN_BLANKS);
        this.showMatchFollowing = (questionType === question_type.QUESTION_TYPE_MATCH_FOLLOWING);
        this.showTrueFalse = ( questionType === question_type.QUESTION_TYPE_TRUE_OR_FALSE);
        this.showOneMark = ( questionType === question_type.QUESTION_TYPE_ONE_MARK);
        this.showSyllogismOne = ( questionType === question_type.QUESTION_TYPE_SYLLOGISM_ONE);
        this.showSyllogismTwo = ( questionType === question_type.QUESTION_TYPE_SYLLOGISM_TWO);
        this.showSyllogismThree = ( questionType === question_type.QUESTION_TYPE_SYLLOGISM_THREE);
        //  this.showSyllogism = ($scope.showSyllogismOne || $scope.showSyllogismTwo || $scope.showSyllogismThree);
        // this.showOtherTypeQuestion = !($scope.showMultipleChoice || $scope.showFillup || $scope.showMatchFollowing || $scope.showTrueFalse || $scope.showOneMark || $scope.showSyllogismOne || $scope.showSyllogismTwo || $scope.showSyllogismThree);
    }

    // need to move pipe
    assembleHTMLItem(data) {
        return this._sanitizer.bypassSecurityTrustHtml(data);
    }


    getAllDepartmentListInViewQues():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        console.log("department_all_get_url================>" + department_all_get_url);
        this.desData = 'No Question Found';
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    ////     console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.localStorageService.get('deparmentInQuestion') == '' || this.localStorageService.get('deparmentInQuestion') == null) {
                        this.selectedDepartmentData = this.departmentList[0];
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    } else {
                        this.selectedDepartmentData = this.localStorageService.get('deparmentInQuestion');
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    }
                    this.getAllCouseList();
                    this.assignUserListParams();
                    this.getAllIUsersList();
                } else {
                    this.courseList = [];
                    this.subjectList = [];
                    this.chapterList = [];
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.selectedChapterData = null;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllCouseList():void {
        this.subjectList = [];
        this.chapterList = [];
        this.selectedSubjectData = null;
        this.selectedChapterData = null;
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        console.log("course list url================>" + course_all_get_url);
        this.desData = 'No Question Found';
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));

                    if (this.localStorageService.get('courseInQuestion') == '' || this.localStorageService.get('courseInQuestion') == null) {
                        this.selectedCourseData = this.courseList[0];
                        this.selectedCourseId = this.selectedCourseData.courseId;
                    } else {
                        this.selectedCourseData = this.localStorageService.get('courseInQuestion');
                        this.selectedCourseId = this.selectedCourseData.courseId;
                    }
                    this.getAllSubjectList();
                } else {
                    this.courseList = [];
                    this.subjectList = [];
                    this.chapterList = [];
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.selectedChapterData = null;
                    this.desData = 'No Question Found';
                    ////  this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList():void {
        this.chapterList = [];
        this.selectedChapterData = null;
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', this.selectedCourseData.courseId);
        console.log("get_all_subject_url================>" + get_all_subject_url);
        this.desData = 'No Question Found';
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;

                    if (this.localStorageService.get('subjectInQuestion') == '' || this.localStorageService.get('subjectInQuestion') == null) {
                        this.selectedSubjectData = this.subjectList[0];
                        this.selectedSubjectId = this.selectedSubjectData.subjectId;
                    } else {
                        this.selectedSubjectData = this.localStorageService.get('subjectInQuestion');
                        this.selectedSubjectId = this.selectedSubjectData.subjectId;
                    }

                    this.getAllChapters();
                    /// console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.subjectList = [];
                    this.chapterList = [];
                    this.selectedChapterData = null;
                    this.desData = 'No Question Found';
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllChapters():void {
        this.chapterList = [];
        var get_all_chapter_url = this.baseUrl + this.configFile.getall_chapters;
        get_all_chapter_url = get_all_chapter_url.replace('{subjectId}', this.selectedSubjectData.subjectId);
        console.log("get_all_chapter_url========" + get_all_chapter_url);
        this.insmanagerService.getAllChaptersWithPromise(get_all_chapter_url)
            .then(resData => {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.chapterList = [];
                    if (data.data.lgchapterEntities != null) {
                        this.chapterList = data.data.lgchapterEntities;
                        ///   console.log("chapterList========" + JSON.stringify(this.chapterList));
                        if (this.localStorageService.get('chapterInQuestion') == '' || this.localStorageService.get('chapterInQuestion') == null) {
                            this.selectedChapterData = this.chapterList[0];
                            this.selectedChapterId = this.selectedChapterData.chapterId;
                        } else {
                            this.selectedChapterData = this.localStorageService.get('chapterInQuestion');
                            this.selectedChapterId = this.selectedChapterData.chapterId;
                        }
                    } else {
                        this.toastr.error('', 'No Chapter Found');
                    }


                    this.assignGetQuestionParams(0);

                } else {
                    this.chapterList = [];
                    this.selectedChapterData = null;
                    this.desData = 'No Question Found';
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    private assignUserListParams() {
        this.userTypeIdList = [];
        this.userTypeIdList.push(INSTITUTE_TYPES.USER_TYPE_STAFF);
        this.getUserListParamData.instituteId = 1;
        this.getUserListParamData.userTypeId = this.userTypeIdList;
        this.getUserListParamData.courseId = 0;
        this.getUserListParamData.departmentId = (this.selectedDepartmentData == null) ? 0 : this.selectedDepartmentData.departmentId;
        this.getUserListParamData.subjectId = 0;
        console.log("getUserListParamData  ===========>>>" + JSON.stringify(this.getUserListParamData))
    }


    // all userlist getting
    getAllIUsersList():void {
        this.userGetDataList = [];  // for array clear
        let u_data=[];
        this.userGetDataList.push({'userId':0,'fName':'All'});
        if(this.userData.userType==INSTITUTE_TYPES.USER_TYPE_ADMIN)
        {
            this.userGetDataList.push({'userId':this.userData.userId,'fName':'Admin'});
        }
        this.insmanagerService.getUserListWithPromise(this.getUserListParamData)
            .then(userListData=> {
                var data = JSON.parse(JSON.stringify(userListData));
                if (data.status.success) {
                    u_data = this.getDecryptedUserDatas(data.data);
                    u_data.forEach((key:any, val:any) => {
                        let temp={'userId':key.userId,'fName':key.fName};
                        if ( this.userGetDataList.indexOf(key.userId) == -1) {
                            this.userGetDataList.push(temp);
                        }
                    });
                    this.desData = '';
                ///    console.log(" this.userGetDataList========" + JSON.stringify( this.userGetDataList));
                } else {
                    this.desData = data.status.description;
                }
            },
                error => this.errorMessage = <any>error);
    }

    getDecryptedUserDatas(data) {
        this.userTempGetDataList=[];
        data.forEach((key:any, val:any) => {
            let tempData = new UserGetData();
            tempData = key;
            tempData.userName = (tempData.userName != null || tempData.userName != undefined || tempData.userName != '') ? this.crypto.decryptByAES(tempData.userName) : '';
            tempData.profileImage = (tempData.profileImage == null ||tempData.profileImage == undefined || tempData.profileImage == '') ? '' : this.crypto.decryptByAES(tempData.profileImage);
            tempData.emailId = (tempData.emailId == null || tempData.emailId == undefined || tempData.emailId == '') ? '' : this.crypto.decryptByAES(tempData.emailId);
            tempData.fName = (tempData.fName == null || tempData.fName == undefined || tempData.fName == '') ? '' : this.crypto.decryptByAES(tempData.fName);
            tempData.lName = (tempData.lName == null || tempData.lName == undefined || tempData.lName == '') ? '' : this.crypto.decryptByAES(tempData.lName);
            tempData.location = (tempData.location == null || tempData.location == undefined || tempData.location == '') ? '' : this.crypto.decryptByAES(tempData.location);
            tempData.address = (tempData.address == null || tempData.address == undefined ||tempData.address == '') ? '' : this.crypto.decryptByAES(tempData.address);
            if (tempData.lName == '') {
                if (tempData.fName == '') {
                    if (tempData.userName != '') {
                        tempData.displayName = tempData.userName;
                    }
                } else {
                    tempData.displayName = tempData.fName;
                }
            }

            this.userTempGetDataList.push(tempData);
        })

        return this.userTempGetDataList;
    }





    assignGetQuestionParams(pageno) {
       //// let pageNo = this.localStorageService.get("pageNumberInQues");
        this.getQuestionParamData.chapterId = (this.selectedChapterData == null) ? 0 : this.selectedChapterData.chapterId;
        if (this.getQuestionParamData.chapterId == 0) {
            this.toastr.error('', 'No Chapter Found');
            return;
        }
        this.getQuestionParamData.userId = 0;
        if (this.selectedUserData != null) {
            this.getQuestionParamData.userId = (this.selectedUserData.userId == null) ? 0 : this.selectedUserData.userId;
        }
        this.getQuestionParamData.errorStatus = this.selectedErrorType.id;
        this.getQuestionParamData.usageType = this.selectedUsageType.id;
        this.getQuestionParamData.questionType = this.selectedQuestionType.id;
        this.getQuestionParamData.explanation = this.selectedExplanationType.id;
        this.getQuestionParamData.pageNumber = pageno;
        console.log("assignGetQuestionParams     =======> " + JSON.stringify(this.getQuestionParamData));
        this.getAllQuestionList();
    }

    getAllQuestionList():void {
        this.desData = 'No Question Found';
        this.questionsCount=0;
        this.insmanagerService.getAllQuestionsWithPromise(this.getQuestionParamData)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.questionList = [];
                    this.desData = 'No Question Found';
                    if (data != null) {
                        //// console.log("questionList------------------->" + JSON.stringify(data))
                        if (data.data != null) {
                            this.numPages = data.data.totalPages;
                            this.pageNumberInQues = data.data.number;
                            this.questionsCount = data.data.totalElements;
                            console.log("numPages------------------->" + this.numPages);
                            console.log("pageNumberInQues------------------->" + this.pageNumberInQues)
                            console.log("questionsCount------------------->" + this.questionsCount )

                            this.maxSize=5;
                            if (data.data.content != null) {
                                this.questionList = data.data.content;
                                this.setDataSourceInList( this.questionList);
                                this.desData = '';
                                ///  console.log("questionList---------------" + JSON.stringify(data))
                            }
                        }
                         this.setPage(this.pageNumberInQues)
                    }

                } else {
                    this.questionList = [];
                    this.setDataSourceInList( this.questionList);
                    this.desData = 'No Question Found';
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


    getAllQuestionInPagination()
    {
      console.log("pagination===="+this.currentPage)
        this.assignGetQuestionParams(this.currentPage);
    }
    pageChanged(event: any): void {
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
       // const startItem = (event.page - 1) * event.itemsPerPage;
        ///const endItem = event.page * event.itemsPerPage;
    //    this.localStorageService.set("pageNumberInQues",event.page);
     ///  if(event.page==1)
     //  return
      ///  this.assignGetQuestionParams(event.page-1);


    }

    goToDeletequestionPopUp(data):void {
        // console.log("deltePopup data====="+JSON.stringify(data));
        this.localStorageService.set("popupquestion", data);
        this.msgInDeletePopup = 'Do you want to delete ' + data.question;
        this.childModal.show();
    }

    getValueInQuestionType(data) {
        console.log("data=====" + JSON.stringify(data))
        this.selectedQuestionType = null;
        for (var i = 0; i < this.questionTypes.length; i++) {
            var getQuestionTypeData = this.questionTypes[i];
            if (getQuestionTypeData.name == data) {
                this.selectedQuestionType = this.questionTypes[i];
                console.log(" this.selectedQuestionType=====" + JSON.stringify(this.selectedQuestionType));
            }

        }
        //// this.questionType = this.selectedQuestionType.id;
        var questionType = this.selectedQuestionType.id;
        this.getQuestionType(questionType);
        this.assignGetQuestionParams(0);


    }

    getValueInDepartment(data) {
        console.log("getValueInDepartment=============>" + JSON.stringify(data))
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name != null || this.departmentData.name != '') {
                if (this.departmentData.name.trim() == data.trim()) {
                    this.selectedDepartmentData = this.departmentList[i];
                    console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                    this.getAllCouseList();
                    this.assignUserListParams();
                    this.getAllIUsersList();
                }
            }

        }

    }

    getValueInCourse(data) {
        console.log("getValueInCourse========>" + data);
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.name != null || this.courseData.name != '') {
                if (this.courseData.name.trim() == data.trim()) {
                    this.selectedCourseData = this.courseList[i];
                    console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));
                    this.getAllSubjectList();
                }
            }

        }

    }

    getValueInSubject(data) {
        console.log("selectedSubjectData========>" + data);
        this.selectedSubjectData = null;
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.name != null || this.subjectData.name != '') {
                if (this.subjectData.name.trim() == data.trim()) {
                    this.selectedSubjectData = this.subjectList[i];
                    this.getAllChapters();
                    console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

                }
            }

        }

    }


    getValueInChapter(data) {
        this.selectedChapterData = null;
        for (var i = 0; i < this.chapterList.length; i++) {
            this.chapterData = this.chapterList[i];
            if (this.chapterData.chapterTitle != null || this.chapterData.chapterTitle != '') {
                if (this.chapterData.chapterTitle.trim() == data.trim()) {
                    this.selectedChapterData = this.chapterList[i];
                    console.log(" this.selectedChapterData=====" + JSON.stringify(this.selectedChapterData));
                    this.assignGetQuestionParams(0);


                }
            }

        }

    }


    getValueInUser(data) {
        this.selectedUserData = null;
        for (var i = 0; i < this.userGetDataList.length; i++) {
            if (this.userGetDataList[i].fName != null || this.userGetDataList[i].fName != '') {
                if (this.userGetDataList[i].fName.trim() == data.trim()) {
                    this.selectedUserData = this.userGetDataList[i];
                    console.log(" this.selectedUserData=====" + JSON.stringify(this.selectedUserData));
                    this.assignGetQuestionParams(0);


                }
            }

        }
    }

    getValueInQuestionUsage(data) {
        for (var i = 0; i < this.questionUsage.length; i++) {
            if (this.questionUsage[i].name.trim() == data.trim()) {
                this.selectedUsageType = this.questionUsage[i];
                console.log("this.questionUsage=====" + JSON.stringify(this.selectedUsageType));
                this.assignGetQuestionParams(0);

            }
        }

    }

    getValueInErrorType(data) {
        for (var i = 0; i < this.quesErrorType.length; i++) {
            if (this.quesErrorType[i].name.trim() == data.trim()) {
                this.selectedErrorType = this.quesErrorType[i];
                console.log("this.selectedErrorType=====" + JSON.stringify(this.selectedErrorType));
                this.assignGetQuestionParams(0);

            }
        }
    }

    getValueInQExplanation(data) {
        for (var i = 0; i < this.quesExplanationType.length; i++) {
            if (this.quesExplanationType[i].name.trim() == data.trim()) {
                this.selectedExplanationType = this.quesExplanationType[i];
                console.log("this.selectedExplanationType=====" + JSON.stringify(this.selectedExplanationType));
                this.assignGetQuestionParams(0);

            }
        }
    }

    goToViewQuesPopUp(data) {
        this.localStorageService.set("viewQuesDatas", data);
        this.router.navigate(['/quiz/view-questions']);
    }
}

interface TestObject {
    name:string;
    value:number;
}

export  class UserListTempData {
    userId:number;
    fName:string;
}