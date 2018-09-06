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
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatStepper} from '@angular/material';
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
import { AddDepartment } from '../_models/AddDepartment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import { environment } from '../../../environments/environment';
import { InsManagerService } from '../services/insmanager.service';
import { question_type,ConfigFile,INSTITUTE_TYPES,
    SENDMESSAGE_TYPEID,
    content_file_type_extension,
    contentType,
    content_file_type } from '../services/configfile';
import { AddQuiz } from '../_models/AddQuiz';
import { AddChapter } from '../_models/AddChapter';
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { AddSubject } from '../_models/AddSubject';
import { GetSubject } from '../_models/GetSubject';
import { GetChapter } from '../_models/GetChapter';
@Component({
    templateUrl: 'createquiz.component.html',
    animations: [trigger('slideInOut', [
        state('in', style({transform: 'translate3d(0, 0, 0)'})),
        state('out', style({transform: 'translate3d(100%, 0, 0)'})),
        transition('in => out', animate('400ms ease-in-out')),
        transition('out => in', animate('400ms ease-in-out'))])],
    styleUrls: ['./quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
    userData = new UserData();
    configFile = new ConfigFile();
    crypto = new BasicCrptoCredentials();
    baseUrl = environment.baseUrl;
    addQuiz = new AddQuiz();
    uploadFileName = '';
    desSubjectData = '';
    departmentList:Department [];
    subjectList:GetSubject [];
    courseList:GetCourse [];
    chapterList:GetChapter [];
    addSubject = new AddSubject();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    chapterData=new GetChapter();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    selectedChapterData=null;
    isValidQuizCreate=false;
    questionModel=this.configFile.ques_usage;
    qModelData=null;
    statusQuestionType:Object;
    multipleQuizForm:FormGroup;
    questionForm:FormGroup;
    choiceAForm:FormGroup;
    choiceBForm:FormGroup;
    choiceCForm:FormGroup;
    choiceDForm:FormGroup;
    choiceEForm:FormGroup;
    timer:any;
    mcqQuestionForm:FormGroup;
    mcqImagechoiceAForm:FormGroup;
    mcqImagechoiceBForm:FormGroup;
    mcqImagechoiceCForm:FormGroup;
    mcqImagechoiceDForm:FormGroup;
    mcqImagechoiceEForm:FormGroup;

    questionType=0;
    questionFormSubmitted = false;
    choiceAFormSubmitted=false;
    choiceBFormSubmitted=false;
    choiceCFormSubmitted=false;
    choiceDFormSubmitted=false;
    choiceEFormSubmitted=false;

    data = '';
    public handleError;
    errorMessage:String;

    selectedQFiles:FileList;
    selectedAnsAFiles:FileList;
    selectedAnsBFiles:FileList;
    selectedAnsCFiles:FileList;
    selectedAnsDFiles:FileList;
    selectedAnsEFiles:FileList;
    selectedAnsExplanationFiles:FileList;

    questionUrl = 'assets/img/no_image.png';
    ansAUrl = 'assets/img/no_image.png';
    ansBUrl = 'assets/img/no_image.png';
    ansCUrl = 'assets/img/no_image.png';
    ansDUrl = 'assets/img/no_image.png';
    ansEUrl = 'assets/img/no_image.png';
    ansExplanationUrl = 'assets/img/no_image.png';


    file:File;
    chosenQFileName = '';
    chosenAFileName = '';
    chosenBFileName = '';
    chosenCFileName = '';
    chosenDFileName = '';
    chosenEFileName = '';
    chosenExplanationFileName = '';

    chosenQFileType = '';
    chosenAFileType = '';
    chosenBFileType = '';
    chosenCFileType = '';
    chosenDFileType = '';
    chosenEFileType = '';
    chosenExplanationFileType = '';

    chosenQFileSize = '';
    chosenAFileSize = '';
    chosenBFileSize = '';
    chosenCFileSize = '';
    chosenDFileSize = '';
    chosenEFileSize = '';
    chosenExplanationFileSize = '';


    qChoiceA = '';
    qChoiceB = '';
    qChoiceC = '';
    qChoiceD = '';
    qChoiceE = '';
    qHint = '';
    qChoiceExplanation = '';
    questionImageFileName=null;
    choiceAImageFileName = null;
    choiceBImageFileName = null;
    choiceCImageFileName = null;
    choiceDImageFileName = null;
    choiceEImageFileName = null;
    qHintImageFileName = null;
    choiceExplImageFileName = null;
    selectedQuestionType = null;


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
    mulitipleQuizFormSubmited = false;


    rndChoiceA = false;
    rndChoiceB = false;
    rndChoiceC = false;
    rndChoiceD = false;
    rndChoiceE = false;
    answerChoiceType='';
    @ViewChild('stepper') stepper:MatStepper;
    ckeConfig:any;
    @ViewChild("ckeditor") ckeditor:any;
    isConnected: Observable<boolean>;
    questionTypes =this.configFile.questionTypes_Data;


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
        this.statusQuestionType=this.questionTypes[0];

    }

    ngOnInit() {
        this.ckeConfig = {
            height: 200,
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
        this.multipleQuizForm = this.formBuilder.group({
            qQuestion: ['', [Validators.required]],
            qChoiceA: ['', [Validators.required]],
            qChoiceB: ['', [Validators.required]],
            qChoiceC: ['', [Validators.required]],
            qChoiceD: ['', [Validators.required]],
        });

        this.questionForm = this.formBuilder.group({
            qQuestion: ['', [Validators.required]],

        });
        this.choiceAForm = this.formBuilder.group({
            qChoiceA: ['', [Validators.required]],

        });
        this.choiceBForm = this.formBuilder.group({
            qChoiceB: ['', [Validators.required]],
        });
        this.choiceCForm = this.formBuilder.group({
            qChoiceC: ['', [Validators.required]],
        });
        this.choiceDForm = this.formBuilder.group({
            qChoiceD: ['', [Validators.required]],
        });


        this.mcqQuestionForm = this.formBuilder.group({
            mcqImagequestion: ['', [Validators.required]],

        });

       this.getQuestionType( this.questionTypes[0].id);
        this.getAllDepartmentList();

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.questionForm.controls;
    }
    get a() {
        return this.choiceAForm.controls;
    }
    get b() {
        return this.choiceBForm.controls;
    }
    get c() {
        return this.choiceCForm.controls;
    }
    get d() {
        return this.choiceDForm.controls;
    }
    onSubmit() {
        this.questionFormSubmitted = true;
        // stop here if form is invalid
        if (this.questionForm.invalid) {
            return;
        }
        this.getAssignedQuizParms();


    }

    // need to move common
    refresh():void {
        window.location.reload();
    }



    getAllDepartmentList():void {
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    ////     console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.courseList=[];
                    this.subjectList=[];
                    this.chapterList=[];
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList():void {
        this.courseList=[];
        this.subjectList=[];
        this.chapterList=[];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', this.selectedDepartmentData.departmentId);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));
                    this.selectedCourseData = this.courseList[0];
                    this.getAllSubjectList(this.courseList[0].courseId);
                } else {
                    this.courseList=[];
                    this.subjectList=[];
                    this.chapterList=[];
                    this.selectedCourseData = null;
                    this.selectedSubjectData = null;
                    this.selectedChapterData=null;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        this.subjectList=[];
        this.chapterList=[];
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    this.getAllChapters(this.subjectList[0].subjectId);
                    /// console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.subjectList=[];
                    this.chapterList=[];
                    this.selectedSubjectData = null;
                    this.selectedChapterData=null;
                    this.desSubjectData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllChapters(id):void {
        this.chapterList=[];
        var get_all_chapter_url = this.baseUrl + this.configFile.getall_chapters;
        get_all_chapter_url = get_all_chapter_url.replace('{subjectId}', id);
        console.log("get_all_chapter_url========" + get_all_chapter_url);
        this.insmanagerService.getAllChaptersWithPromise(get_all_chapter_url)
            .then(resData => {
                var data = JSON.parse(JSON.stringify(resData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.chapterList = data.data.lgchapterEntities;
                    if(data.data.lgchapterEntities==null)
                    {
                        this.chapterList=[];
                        this.selectedChapterData=null;
                    }
                    console.log("chapterList========" + JSON.stringify(this.chapterList));
                } else {
                    this.chapterList=[];
                    this.selectedChapterData=null;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name != null || this.departmentData.name != '') {
                if (this.departmentData.name.trim() == data.trim()) {
                    this.selectedDepartmentData = this.departmentList[i];
                    console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                    this.getAllCouseList();
                }
            }

        }
        this.isValidQuizCreate=this.checkValidQuizCreation();
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            console.log(" data=====" + data + "======" + this.courseData.name + "======");
            if (this.courseData.name != null || this.courseData.name != '') {
                if (this.courseData.name.trim() == data.trim()) {
                    this.selectedCourseData = this.courseList[i];
                    this.getAllSubjectList(this.selectedCourseData.courseId);
                    console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

                }
            }

        }
        this.isValidQuizCreate=this.checkValidQuizCreation();
    }

    getValueInSubject(data) {
        this.selectedSubjectData = null;
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.name != null || this.subjectData.name != '') {
                if (this.subjectData.name.trim() == data.trim()) {
                    this.selectedSubjectData = this.subjectList[i];
                    this.getAllChapters(this.selectedSubjectData.subjectId);
                    console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

                }
            }

        }
        this.isValidQuizCreate=this.checkValidQuizCreation();
    }

    checkValidQuizCreation():boolean
    {
        var isValid=false;
        if(this.selectedDepartmentData!=null&&this.selectedCourseData!=null&& this.selectedSubjectData!=null&& this.selectedChapterData!=null)
        {
            isValid=true;
        }
        return isValid;
    }
    getValueInChapter(data) {
        this.selectedChapterData = null;
        for (var i = 0; i < this.chapterList.length; i++) {
            this.chapterData = this.chapterList[i];
            if (this.chapterData.chapterTitle != null || this.chapterData.chapterTitle != '') {
                if (this.chapterData.chapterTitle.trim() == data.trim()) {
                    this.selectedChapterData = this.chapterList[i];
                    console.log(" this.selectedChapterData=====" + JSON.stringify(this.selectedChapterData));

                }
            }

        }
        this.isValidQuizCreate=this.checkValidQuizCreation();
    }




    getValueInQuestionModel(data)
    {
        this.qModelData=data;
        //console.log("this.qModelData==="+this.qModelData)
    }

    getImageFileFolderName(url):string {
        return this.userData.instituteId + '/Department/' + this.selectedDepartmentData.departmentId + '/Course/'+this.selectedCourseData.courseId+'/Subject/'+this.selectedSubjectData.subjectId+'/Chapter/'+this.selectedChapterData.chapterId+url;
    }

    getAssignedQuizParms() {
        console.log("this.selectedQFiles======"+this.selectedQFiles);
        this.addQuiz.questionImageUrl = '';
        this.addQuiz.choiceAImageUrl = '';
        this.addQuiz.choiceBImageUrl = '';
        this.addQuiz.choiceCImageUrl = '';
        this.addQuiz.choiceDImageUrl = '';
        this.addQuiz.choiceEImageUrl = '';
        this.addQuiz.answerImageUrl = '';
        this.addQuiz.explanationImage='';
        this.addQuiz.answerImageUrl='';
         this.isValidQuizCreate=this.checkValidQuizCreation();
        if(!this.isValidQuizCreate)
        {
            this.toastr.error('', "No Chapter.. So cant able to create question");
            return;
        }
        if(this.answerChoiceType=='')
        {
            this.toastr.error('', "Please choose the answer");
            return;
        }else if( this.questionType==0)
        {
            this.toastr.error('', "Please choose the Question Type");
            return;
        }else if(this.qModelData==null)
        {
            this.toastr.error('', "Please choose the Question Model");
            return;
        }

        if(this.selectedQuestionType!=null)
        {
            this.questionType=this.selectedQuestionType.id;
        }
        this.addQuiz.question = this.questionForm.value.qQuestion.trim();
        this.addQuiz.choiceA = this.choiceAForm.value.qChoiceA.trim();
        this.addQuiz.choiceB = this.choiceBForm.value.qChoiceB.trim();
        this.addQuiz.choiceC = this.choiceCForm.value.qChoiceC.trim();
        this.addQuiz.choiceD = this.choiceDForm.value.qChoiceD.trim();
        this.addQuiz.choiceE  = (this.qChoiceE == null || this.qChoiceE == undefined || this.qChoiceE == '') ? '' : this.qChoiceE;
        this.addQuiz.explanation  = (this.qChoiceExplanation == null || this.qChoiceExplanation == undefined || this.qChoiceExplanation == '') ? '' : this.qChoiceExplanation;
        if(this.selectedQFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Question/');
            const file = this.selectedQFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.questionImageUrl = this.questionImageFileName;
        }
        if(this.selectedAnsAFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Answer/');
            const file = this.selectedAnsAFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.choiceAImageUrl = this.choiceAImageFileName;
        }

        if(this.selectedAnsBFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Answer/');
            const file = this.selectedAnsBFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.choiceBImageUrl = this.choiceBImageFileName;
        }

        if(this.selectedAnsCFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Answer/');
            const file = this.selectedAnsCFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.choiceCImageUrl = this.choiceCImageFileName;
        }

        if(this.selectedAnsDFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Answer/');
            const file = this.selectedAnsDFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.choiceDImageUrl = this.choiceDImageFileName;
        }


        if(this.selectedAnsExplanationFiles!= undefined)
        {
            var url = this.getImageFileFolderName('/Question/Explanation/');
            const file = this.selectedAnsExplanationFiles.item(0);
            this.uploadService.uploadfile(file, url);
            this.addQuiz.explanationImage=this.choiceExplImageFileName;
        }


        var choiceArray=[ this.addQuiz.choiceA, this.addQuiz.choiceB, this.addQuiz.choiceC, this.addQuiz.choiceD, this.addQuiz.choiceE];
        if(this.checkingUniqueAnswer(choiceArray))
        {
            this.toastr.error('', "Choices should be in Unique Please Check !");
            return;
        }
        this.addQuiz.answer = this.getAnswer(this.answerChoiceType);
        if(this.addQuiz.answer=='')
        {
            this.toastr.error('', "Choice field cannot be empty!");
            return;
        }

        this.addQuiz.answerImageUrl=this.getAnswerImageUrl(this.answerChoiceType);
        this.addQuiz.userId = this.userData.userId;
        this.addQuiz.verified = 0;
        this.addQuiz.editedBy = 0;
        this.addQuiz.verifiedBy = 0;
        this.addQuiz.deleted = 0;
        this.addQuiz.imported = 0;
        this.addQuiz.questionTypeId = this.questionType;
        this.addQuiz.explanation =this.qChoiceExplanation;
        this.addQuiz.statusId = 0;
        this.addQuiz.direction = '';
        this.addQuiz.directionImage = '';
        this.addQuiz.instituteId = this.userData.instituteId;
        this.addQuiz.departmentId = this.selectedDepartmentData.departmentId;
        this.addQuiz.courseId =  this.selectedCourseData.courseId;
        this.addQuiz.subjectId =  this.selectedSubjectData.subjectId;
        this.addQuiz.chapterId =  this.selectedChapterData.chapterId;
        this.addQuiz.subjectTag = this.selectedSubjectData.subjectTag;
        this.addQuiz.chapterTag = this.selectedChapterData.chapterTag;
        this.addQuiz.courseTag = this.selectedCourseData.courseTag;
        this.addQuiz.usageType=this.qModelData;
        console.log("assignedQuizParms=====" + JSON.stringify(this.addQuiz));
       this.goAddQuestion();
    }

    checkingUniqueAnswer(array)
    {
        var valuesSoFar = Object.create(null);
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (value in valuesSoFar) {
                return true;
            }
            valuesSoFar[value] = true;
        }
        return false;
    }

    getAnswer(data)
    {
        var answer='';
        switch (data) {
            case data='qChoiceA':
                answer=this.choiceAForm.value.qChoiceA.trim();
                break;
            case data='qChoiceB':
                answer=this.choiceBForm.value.qChoiceB.trim();
                break;
            case data='qChoiceC':
                answer=this.choiceCForm.value.qChoiceC.trim();
                break;
            case data='qChoiceD':
            answer=this.choiceDForm.value.qChoiceD.trim();
            break;
            case data='qChoiceE':
                answer=this.qChoiceE.trim();
                break;


        }
        return answer;
    }
    getAnswerImageUrl(data)
    {
        var answerImageUrl='';
        switch (data) {
            case data='qChoiceA':
                answerImageUrl=this.choiceAImageFileName;
                break;
            case data='qChoiceB':
                answerImageUrl=this.choiceBImageFileName;
                break;
            case data='qChoiceC':
                answerImageUrl=this.choiceCImageFileName;
                break;
            case data='qChoiceD':
                answerImageUrl=this.choiceDImageFileName;
                break;
            case data='qChoiceE':
                answerImageUrl=this.choiceEImageFileName;
                break;


        }
        return answerImageUrl;
    }

    goAddQuestion()
    {
        this.insmanagerService.addQuizWithPromise(this.addQuiz)
            .then(quizAddData => {
                console.log("quizAddData======================" + JSON.stringify(quizAddData));
                var data = JSON.parse(JSON.stringify(quizAddData));
                if (data.status.success) {
                    this.toastr.success('', "Quiz added successfully! ");
                    this.timer = setTimeout(() => {
                        this.router.navigate(['quiz/all-questions']);
                    }, 1000);
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getChoiceValue(data) {
        console.log("data=====" + data)
        this.answerChoiceType=data;
    }

    getUploadFileName(filename,path) {
        var FOLDER =  this.getImageFileFolderName(path);;
        var devBucketURL = this.configFile.imageUrl;
        var imagebaseUrL = this.configFile.bucketImageUrl;
        this.uploadFileName = imagebaseUrL + FOLDER + filename;
        console.log('uploadFileName=======', this.uploadFileName);
        return this.uploadFileName;
    }

    selectQFile(event) {
        this.selectedQFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenQFileName = event.target.files[0].name;
        this.chosenQFileType = event.target.files[0].type;
        this.chosenQFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.questionUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.questionImageFileName=this.getUploadFileName(this.chosenQFileName,'/Question/Question/');
    }

    selectAnsAFile(event) {
        this.selectedAnsAFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenAFileName = event.target.files[0].name;
        this.chosenAFileType = event.target.files[0].type;
        this.chosenAFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansAUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceAImageFileName=this.getUploadFileName(this.chosenAFileName,'/Question/Answer/');
    }
    selectAnsBFile(event) {
        this.selectedAnsBFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenBFileName = event.target.files[0].name;
        this.chosenBFileType = event.target.files[0].type;
        this.chosenBFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansBUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceBImageFileName=this.getUploadFileName(this.chosenBFileName,'/Question/Answer/');
    }
    selectAnsCFile(event) {
        this.selectedAnsCFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenCFileName = event.target.files[0].name;
        this.chosenCFileType = event.target.files[0].type;
        this.chosenCFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansCUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceCImageFileName=this.getUploadFileName(this.chosenCFileName,'/Question/Answer/');
    }
    selectAnsDFile(event) {
        this.selectedAnsDFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenDFileName = event.target.files[0].name;
        this.chosenDFileType = event.target.files[0].type;
        this.chosenDFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansDUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceDImageFileName=this.getUploadFileName(this.chosenDFileName,'/Question/Answer/');
    }
    selectAnsEFile(event) {
        this.selectedAnsEFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenEFileName = event.target.files[0].name;
        this.chosenEFileType = event.target.files[0].type;
        this.chosenEFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansEUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceEImageFileName= this.getUploadFileName(this.chosenEFileName,'/Question/Answer/');
    }
    selectAnsExplanationFile(event) {
        this.selectedAnsExplanationFiles = event.target.files;
        let files:FileList = event.target.files;
        this.file = files[0];
        this.chosenExplanationFileName = event.target.files[0].name;
        this.chosenExplanationFileType = event.target.files[0].type;
        this.chosenExplanationFileSize = event.target.files[0].size;
        this.getFileSize();
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.ansExplanationUrl = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        this.choiceExplImageFileName=this.getUploadFileName(this.chosenExplanationFileName,'/Question/Explanation/');
    }

    getFileType() {
        /* var extensionIndex = this.chosenQFileName.lastIndexOf('.');
         this.chosenExtension = this.chosenQFileName.substring(extensionIndex).toUpperCase();
         if (content_file_type_extension_name[content_file_type_extension.PNG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenQFileType = content_file_type_name[content_file_type.PNG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenQFileType = content_file_type_name[content_file_type.JPG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.JPEG - 1].toUpperCase() === this.chosenExtension) {
         this.chosenQFileType = content_file_type_name[content_file_type.JPEG - 1];
         } else if (content_file_type_extension_name[content_file_type_extension.GIF - 1].toUpperCase() === this.chosenExtension) {
         this.chosenQFileType = content_file_type_name[content_file_type.GIF - 1];
         } else {
         this.chosenQFileType = 'Unknown File Type';
         }*/

    }

    getFileSize() {
        var fileSizeInBytes = 0;
        fileSizeInBytes = parseInt(this.chosenQFileSize);
        var tempSize=0;
        if (fileSizeInBytes > 1024 * 1024) {
            var fileSizeInMB = fileSizeInBytes / 1024 / 1024;
            tempSize = Math.round(fileSizeInMB * 100) / 100 ////+ ' MB';
            this.chosenQFileSize=tempSize.toString()+'MB';
        } else if (fileSizeInBytes > 1024) {
            var fileSizeInKB = fileSizeInBytes / 1024;
            tempSize = Math.round(fileSizeInKB * 100) / 100 /////+ ' KB';
            this.chosenQFileSize=tempSize.toString()+'KB';
        } else {
            tempSize = fileSizeInBytes //; + ' Bytes';
            this.chosenQFileSize=tempSize.toString()+'Bytes';
        }
    }




    resetQuiz() {

        this.qChoiceA = '';
        this.qChoiceB = '';
        this.qChoiceC = '';
        this.qChoiceD = '';
        this.qChoiceE = '';
        this.choiceAImageFileName = null;
        this.choiceBImageFileName = null;
        this.choiceCImageFileName = null;
        this.choiceDImageFileName = null;
        this.choiceEImageFileName = null;
    }

    getValueInQuestionType(data) {
     console.log("data====="+JSON.stringify(data))
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

    }
    getQuestionType(questionType)
    {
        this.questionType=questionType;
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


    goForward(f:NgForm, stepper:MatStepper) {
        console.log("index============================>" + stepper.selectedIndex);
        // stop here if form is invalid

        if (stepper.selectedIndex == 0) {
            this.questionFormSubmitted = true;
            if (this.questionForm.invalid) {
                return;
            }else
            {
                this.isValidQuizCreate=this.checkValidQuizCreation();
                if(!this.isValidQuizCreate)
                {
                    this.toastr.error('', "Please choose chapter. Then only able to create course");
                    return;
                }else {
                    console.log(this.questionForm.value);
                    stepper.next();
                    return;
                }

            }

        }
      if (stepper.selectedIndex == 1) {
            this.choiceAFormSubmitted = true;
          if (this.choiceAForm.invalid) {
                return;
            }else
            {
                console.log(this.choiceAForm.value);
                stepper.next();
                return;
            }

        }
        if (stepper.selectedIndex == 2) {

            this.choiceBFormSubmitted = true;
            if (this.choiceBForm.invalid) {
                return;
            }else
            {
                console.log(this.choiceBForm.value);
                stepper.next();
                return;
            }

        }
        if (stepper.selectedIndex == 3) {
            this.choiceCFormSubmitted = true;
            if (this.choiceCForm.invalid) {
                return;
            }else
            {
                console.log(this.choiceCForm.value);
                stepper.next();
                return;
            }

        }
        if (stepper.selectedIndex == 4) {
            this.choiceDFormSubmitted = true;
            if (this.choiceDForm.invalid) {
                return;
            }else
            {
                console.log(this.choiceDForm.value);
                stepper.next();
                return;
            }

        }
        if (stepper.selectedIndex == 5) {
            stepper.next();
                return;
        }
        if (stepper.selectedIndex == 6) {
            this.getAssignedQuizParms();
        }
    }
    goBack(stepper:MatStepper) {
        console.log("index======" + stepper.selectedIndex)
        stepper.previous();
    }

    onChoiceEEditorChange(data)
    {
        console.log("choice e data======" + data)
    }

    onChoiceEChange(data)
    {
        this.qChoiceE=data;

    }
    onExplanationChange(data)
    {
        this.qChoiceExplanation=data;

    }
}
