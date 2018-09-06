/**
 * Created by priya on 24/08/18.
 */
/**
 * Created by priya on 21/08/18.
 */
import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild,Pipe, PipeTransform} from '@angular/core';
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
import { TrustHtmlPipe } from '../pipe/trust-html.pipe';
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



import { DomSanitizer } from '@angular/platform-browser'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
    constructor(private sanitized: DomSanitizer) {}
    transform(value) {
        console.log(this.sanitized.bypassSecurityTrustHtml(value))
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}


@Component({
    selector: 'app-student',
    templateUrl: 'viewquestions.component.html',
    styleUrls: ['./quiz.component.scss']

})

@NgModule({
    declarations: [SafeHtmlPipe],
    exports: [SafeHtmlPipe]
})
export class ViewQuestionsComponent implements OnInit {
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
    quesData= new GetQuestion();
    getQuestionParamData = new GetQuestionParms();
    getUserListParamData = new GetUserListParamData();
    userTypeIdList:number[] = [];
    userGetDataList:UserGetData [] = [];
    userData = new UserGetData();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    selectedChapterData = null;
    selectedUserData = null;
    selectedDepartmentId = 0;
    selectedCourseId=0;
    selectedSubjectId=0;
    selectedChapterId=0;
    examForm:FormGroup;
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
    @ViewChild('warningModal') public childModal:ModalDirective;

    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                private _sanitizer: DomSanitizer,
                private uploadService:UploadFileService,
                public localStorageService:LocalStorageService,
                private insmanagerService:InsManagerService) {
        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
        }
    }

    ngOnInit() {

        this.questionList=[];
        this.quesData= this.localStorageService.get("viewQuesDatas");
        console.log("this.quesData======"+JSON.stringify(this.quesData))
    }

    refresh():void {
        window.location.reload();
    }


    // need to move pipe
    assembleHTMLItem(data) {
        return this._sanitizer.bypassSecurityTrustHtml(data);
    }


    private assignUserListParams() {

    }



}
