/**
 * Created by priya on 10/07/18.
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
import { AddExam } from '../_models/AddExam';
import { InsManagerService } from '../services/insmanager.service';
import { environment } from '../../../environments/environment';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {AddStudent} from '../_models/AddStudent'
import { Department } from '../_models/Department';
import { GetCourse } from '../_models/GetCourse';
import { GetExamType } from '../_models/GetExamType';
import { ConfigFile } from '../services/configfile';
import { GetSubject } from '../_models/GetSubject';
import { FilterPipe} from '../services/FilterPipe';
import  {GetAllExam} from '../_models/GetAllExam';
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
import { DataTableResource } from 'angular4-smart-table';

@Component({
    selector: 'app-student',
    templateUrl: 'viewexamlist.component.html',
    styleUrls: ['./exam.component.scss']

})

@NgModule({
    declarations: [FilterPipe],
    exports: [FilterPipe]
})

export class ViewExamListComponent implements OnInit {
    baseUrl = environment.baseUrl;
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    addExam = new AddExam();
    departmentData = new Department();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    examTypeData = new GetExamType();
    configFile = new ConfigFile();
    getExamType = new GetExamType();
    getAllExam = new GetAllExam();
    getAllExamList:GetAllExam [];
    departmentList:Department [];
    examTypeList:GetExamType [];
    courseList:GetCourse [];
    subjectList:GetSubject [];
    examForm:FormGroup;
    uploadFileName = '';
    submitted = false;
    data = '';
    public handleError;
    errorMessage:String;
    gender_value = '';
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedExamTypeData = null;
    selectedSubjectData = null;
    selectedExamShowType = null
    examStartDate = '';
    examEndDate = '';
    desSubjectData = '';
    examStartTime = '';
    examEndTime = '';
    minStartDate = new Date();
    maxStartDate = new Date(2019, 0, 1);
    minEndDate = '';
    maxEndDate = '';
    examList = [];
    totalMarks = 0;
    passingMarks = 0;
    searchText = '';
    backgroundImage = '../assets/img/search-icon.png';
    examTypeVal = 0;
    examTypeDatas = [{'id': '1', 'name': 'Live Exams'}, {'id': '2', 'name': 'Expired Exams'}];
    selectedDepartmentId:number;
    selectedCourseId:number;
    selectedSubjectId:number;
    desData = 'No Exams Found';
    msgInPopup = "";
    isConnected: Observable<boolean>;
    itemResource = new DataTableResource(this.examList);
    items = [];
    itemCount = 0;
    @ViewChild('warningModal') public childModal:ModalDirective;
    @ViewChild('editModal') public editModal:ModalDirective;
    @ViewChild('viewModal') public viewModal:ModalDirective;
    ////   public options = {type : 'address', componentRestrictions: { country: 'IN' }};
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
        this.examForm = this.formBuilder.group({
            options: ['', [Validators.required]],
        });
        this.getAllDepartmentList();
        this.getAllExamTypeList();
        /* if (this.localStorageService.get('deparmentInExam') == '' || this.localStorageService.get('deparmentInExam') == null) {
         this.selectedDepartmentData = null
         } else {
         this.selectedDepartmentData = this.localStorageService.get('deparmentInExam');
         this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
         }
         if (this.localStorageService.get('courseInExam') == '' || this.localStorageService.get('courseInExam') == null) {
         this.selectedCourseData = null
         } else {
         this.selectedCourseData = this.localStorageService.get('courseInExam');
         this.selectedCourseId = this.selectedCourseData.courseId;
         }
         if (this.localStorageService.get('subjectInExam') == '' || this.localStorageService.get('subjectInExam') == null) {
         this.selectedSubjectData = null
         } else {
         this.selectedSubjectData = this.localStorageService.get('subjectInExam');
         this.selectedSubjectId = this.selectedSubjectData.subjectId;
         }*/

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.examForm.controls;
    }

    onSubmit() {
        this.examList = [];
        this.submitted = true;
        if (this.examForm.invalid) {
            return;
        }
        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        } else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.courseList != null) {
                if (this.courseList.length == 0) {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add student...");
                } else {
                    this.toastr.error('', "Choose Course");
                }
            }
            else {
                this.toastr.error('', "No Course for this selected department.. so cant able to add student...");
            }

            return;
        } else if (this.selectedSubjectData == '' || this.selectedSubjectData == undefined || this.selectedSubjectData == null) {
            this.toastr.error('', "Choose subject ");
            return;
        } else if (this.selectedExamTypeData == '' || this.selectedExamTypeData == undefined || this.selectedExamTypeData == null) {
            this.toastr.error('', "Choose Exam Type");
            return;
        }

        this.examList.push({
            subjectId: this.selectedSubjectData.subjectId,
            startTime: new Date(this.examStartTime).getTime(), //this.formatDate(this.examStartTime),
            endTime: new Date(this.examEndTime).getTime(), //this.formatDate(this.examEndTime),
            maxMark: this.totalMarks,
            passMark: this.passingMarks
        });

        console.log("parms====" + JSON.stringify(this.addExam));

    }

    // need to move common
    refresh():void {
        window.location.reload();
    }

    formatDate(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    private getAllExamParms() {
        this.getAllExam.instituteId = this.userData.instituteId;
        this.getAllExam.courseId = this.selectedCourseData.courseId;
        this.getAllExam.subjectId = this.selectedSubjectData.subjectId;
        this.getAllExam.expiredStatus = this.examTypeVal;
        console.log("getAllExam===" + JSON.stringify(this.getAllExam))
    }


    getAllDepartmentList():void {
        this.courseList = [];
        this.subjectList = [];
        this.getAllExamList = [];
        var department_all_get_url = this.baseUrl + this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                 /////   console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.localStorageService.get('deparmentInExam') == '' || this.localStorageService.get('deparmentInExam') == null) {
                        this.selectedDepartmentData = this.departmentList[0];
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    } else {
                        this.selectedDepartmentData = this.localStorageService.get('deparmentInExam');
                        this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
                    }
                    ////console.log("departmentList========" + JSON.stringify(this.departmentList));
                    if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
                       this.getAllCouseList(this.selectedDepartmentData.departmentId);
                    }

                } else {
                    this.departmentList = [];
                    this.courseList = [];
                    this.subjectList = [];
                    this.getAllExamList = [];
                    this.desData = data.status.description;
                    this.toastr.error('', data.status.description);


                }
            },
                error => this.errorMessage = <any>error);
    }


    getAllCouseList(id):void {
        this.subjectList = [];
        this.getAllExamList = [];
        var course_all_get_url = this.baseUrl + this.configFile.course_get_by_department_url;
        course_all_get_url = course_all_get_url.replace('{departmentId}', id);
        this.insmanagerService.getAllCourseByDepartmentWithPromise(course_all_get_url)
            .then(courseData=> {
                var data = JSON.parse(JSON.stringify(courseData));
                if (data.status.success) {
                    this.courseList = data.data
                    if (this.localStorageService.get('courseInExam') == '' || this.localStorageService.get('courseInExam') == null) {
                        this.selectedCourseData = this.courseList[0];
                        this.selectedCourseId = this.selectedCourseData.courseId;
                    } else {
                        this.selectedCourseData = this.localStorageService.get('courseInExam');
                        if (this.selectedCourseData != '') {
                            this.selectedCourseId = this.selectedCourseData.courseId;
                        }

                    }
                    if (this.selectedCourseData != null || this.selectedCourseData != undefined) {
                        this.getAllSubjectList(this.selectedCourseData.courseId);
                    }

                } else {
                    this.courseList = [];
                    this.subjectList = [];
                    this.getAllExamList = [];
                    this.selectedSubjectData = '';
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        this.getAllExamList = [];
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    if (this.localStorageService.get('subjectInExam') == '' || this.localStorageService.get('subjectInExam') == null) {
                        this.selectedSubjectData = this.subjectList[0];
                        this.selectedSubjectId = this.selectedSubjectData.courseId;
                    } else {
                        this.selectedSubjectData = this.localStorageService.get('subjectInExam');
                        if (this.selectedSubjectData != '') {
                            this.selectedSubjectId = this.selectedSubjectData.courseId;
                        }
                    }
                    if (this.selectedSubjectData != null || this.selectedSubjectData != undefined) {
                        if (this.examTypeVal == 0) {
                            this.toastr.error('', "Choose exam type Live / Expired");
                        } else {
                            this.getAllExamParms();
                            this.getAllExamsList();

                        }
                    }else
                    {
                        this.subjectList = [];
                        this.getAllExamList = [];
                    }


                } else {
                    this.subjectList = [];
                    this.getAllExamList = [];
                    this.desSubjectData = data.status.description;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllExamTypeList():void {
        var exam_type_get_url = this.baseUrl + 'examType/list/{instituteId}';
        exam_type_get_url = exam_type_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getExamTypeListWithPromise(exam_type_get_url)
            .then(examTypeData=> {
                var data = JSON.parse(JSON.stringify(examTypeData));
                if (data.status.success) {
                    this.examTypeList = data.data;

                    console.log("examTypeList========" + JSON.stringify(this.examList));
                } else {
                    this.courseList.length = 0;

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    // all userlist getting
    getAllExamsList():void {
        this.insmanagerService.getAllExamsListWithPromise(this.getAllExam)
            .then(getAllExamsData=> {
                var data = JSON.parse(JSON.stringify(getAllExamsData));
                if (data.status.success) {
                    this.getAllExamList = data.data;
                    console.log("getAllExamList========" + JSON.stringify(this.getAllExamList));
                    this.desData = '';
                    this.setDataSourceInList(this.getAllExamList);

                 /// console.log("getAllExamList========" + JSON.stringify(this.getAllExamList));
                } else {
                    this.getAllExamList = [];
                    this.desData = 'No Exams Found';
                    this.setDataSourceInList(this.examList);

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
    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) {
        return item.jobTitle;
    }


    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }



    getValue(data) {
        console.log("data====" + data.name)
        console.log("id====" + data.id);
        this.gender_value = data.id;
    }


    getValueInDepartment(data) {
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.departmentId == data) {
                this.selectedDepartmentData = this.departmentList[i];
                this.selectedDepartmentId = this.selectedDepartmentData.departmentId;
              ////  console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
                this.localStorageService.set("deparmentInCourse", this.selectedDepartmentData);
                break;
            }
        }
        if (this.selectedDepartmentData != null || this.selectedDepartmentData != undefined) {
            this.localStorageService.set('courseInExam', '');
            this.getAllCouseList(this.selectedDepartmentData.departmentId);
        }


    }

    getValueInCourse(data) {
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            if (this.courseData.courseId == data) {
                this.selectedCourseData = this.courseList[i];
                this.selectedCourseId = this.selectedCourseData.courseId;
                console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));
                this.localStorageService.set("examInCourse", this.selectedCourseData);
                break;
            }
        }
        if (this.selectedCourseData != null || this.selectedCourseData != undefined) {
            this.localStorageService.set('subjectInExam', '');
            this.getAllSubjectList(this.selectedCourseData.courseId);
        }

    }


    getValueInExamType(data) {
        this.selectedExamTypeData = null;
        for (var i = 0; i < this.examTypeList.length; i++) {
            this.getExamType = this.examTypeList[i];
            if (this.getExamType.examType == data) {
                this.selectedExamTypeData = this.examTypeList[i];
                console.log(" this.selectedExamTypeData=====" + JSON.stringify(this.selectedExamTypeData));
            }
        }
    }

    getValueInSubject(data) {
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.courseId == data) {
                this.selectedSubjectData = this.subjectList[i];
                this.selectedSubjectId = this.selectedSubjectData.subjectId;
                console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));
                this.localStorageService.set("examInSubject", this.selectedSubjectData);
                break;
            }
        }
        if (this.selectedSubjectData != null || this.selectedSubjectData != undefined) {
            if (this.examTypeVal == 0) {
                this.toastr.error('', "Choose exam type Live / Expired");

            } else {
                this.getAllExamParms();
                this.getAllExamsList();

            }
        }

    }


    getValueofExamType(data) {
        console.log("id====" + data);
        this.examTypeVal = data.id;
        if (this.selectedCourseData == null) {
            this.toastr.error('', "Choose Department and course");

        } else if (this.selectedSubjectData == null) {
            "Choose Subject"
        }
        else {
            this.getAllExamParms();
            this.getAllExamsList();
        }


    }


    convertMinsToHrsMins(minutes) {
        var h = Math.floor(minutes / 60);
        var m = minutes % 60;
        var data;
        if (h == 0) {
            if (m != 0) {
                data = m > 10 ? (m + ' Minitue(s)') : (m + ' Minitue');

            }
        } else {
            data = h > 10 ? (h + ' Hour(s) ') : (h + ' Hour ');
            if (m != 0) {
                data = m > 10 ? (data + m + ' Minitue(s)') : (data + m + ' Minitue');
            }
        }
        return data;
    }

    goToConFirmExamDelete():void {
        var popupexam = this.localStorageService.get("popupexam");
        console.log("popupexam=====" + JSON.stringify("popupexam"));
        this.goToADeleteApiForExam(popupexam.examType)
    }

    goToADeleteApiForExam(id) {
        var exam_delete_url = this.baseUrl + this.configFile.disable_subject;
        exam_delete_url = exam_delete_url.replace('{examType}', this.userData.userId.toString());
        exam_delete_url = exam_delete_url.replace('{subjectId}', id);
        console.log("exam_delete_url--" + exam_delete_url)
        this.insmanagerService.deleteSubjectWithPromise(exam_delete_url)
            .then(subjectData=> {
                var data = JSON.parse(JSON.stringify(subjectData));
                if (data.status.success) {
                    this.childModal.hide();
                    this.getAllSubjectList(this.selectedCourseData.courseId);
                    this.toastr.success('', "Successfully Deleted");
                } else {

                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    goToDeleteExamPopUp(data):void {
        //console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("popupexam", data);
        this.childModal.show();
        this.msgInPopup = 'Do you want to delete ' + data.lgExamTypeEntity.examType;

    }
    goToEditNamePopUp(data):void {
        ///  console.log("data====="+JSON.stringify(data));
        this.localStorageService.set("editName", data);
        this.editModal.show();

    }


}


