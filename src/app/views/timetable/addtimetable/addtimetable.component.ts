import { Component, OnInit } from '@angular/core';
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
import { PermissionService } from '../../permission.service';
import { Permission } from '../../permission';
import { InsManagerService } from '../../services/insmanager.service';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../../views/login/userdata';
import  {BasicCrptoCredentials} from '../../services/BasicCrptoCredentials';
import { ValidationService } from '../../services/validation.service';
import { IUserLogin } from '../../shared/interface';
import { LoggerService } from '../../services/logger.service';
import { UploadFileService } from '../../services/upload-file.service';
import { ConfigFile } from '../../services/configfile';
import { environment } from '../../../../environments/environment';
import { AddChapter } from '../../_models/AddChapter';
import { Department } from '../../_models/Department';
import { GetCourse } from '../../_models/GetCourse';
import { AddSubject } from '../../_models/AddSubject';
import { GetSubject } from '../../_models/GetSubject';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-addtimetable',
  templateUrl: './addtimetable.component.html',
  styleUrls: ['./addtimetable.component.scss']
})
export class AddtimetableComponent implements OnInit {
    userData = new UserData();
    crypto = new BasicCrptoCredentials();
    departmentData = new Department();
    configFile=new ConfigFile();
    baseUrl = environment.baseUrl;
    departmentList:Department [];
    courseList:GetCourse [];
    addSubject = new AddSubject();
    courseData = new GetCourse();
    subjectData = new GetSubject();
    selectedDepartmentData = null;
    selectedCourseData = null;
    selectedSubjectData = null;
    url = 'assets/img/no_image.png';
    timer:any;
    subjectList:GetSubject [];
    backgroundImage='../assets/img/search-icon.png';
    errorMessage:String;
    desSubjectData = '';
    timetableForm:FormGroup;
    selectedDepartmentId:number;
    selectedCourseId:number;
    selectedSubjectId:number;
    isConnected: Observable<boolean>;



    constructor(private formBuilder:FormBuilder, public _http:Http,
                private permissionService:PermissionService,
                private router:Router,
                private toastr:ToastrService,
                public localStorageService:LocalStorageService,
                private uploadService:UploadFileService,
                private spinnerService: Ng4LoadingSpinnerService,
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
      this.timetableForm = this.formBuilder.group({



      });
      this.getAllDepartmentList();

  }
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
                    this.spinnerService.hide();
                    this.departmentList = data.data;
                    ////     console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.spinnerService.hide();
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
                    this.spinnerService.hide();
                    this.courseList = data.data;
                    ///  console.log("courseList========" + JSON.stringify(this.courseList));
                    ///////// this.selectedCourseData = this.courseList[0];
                    this.getAllSubjectList(this.courseList[0].courseId);
                } else {
                    this.spinnerService.hide();
                    this.courseList.length = 0;
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }

    getAllSubjectList(id):void {
        var get_all_subject_url = this.baseUrl + this.configFile.subject_url;
        get_all_subject_url = get_all_subject_url.replace('{courseId}', id);
        console.log("get_all_subject_url========" + get_all_subject_url);
        this.insmanagerService.getAllSubjectWithPromise(get_all_subject_url)
            .then(subjectListData => {
                var data = JSON.parse(JSON.stringify(subjectListData));
                if (data.status.success) {
                    this.desSubjectData = '';
                    this.subjectList = data.data;
                    /// console.log("subjectList========" + JSON.stringify(this.subjectList));
                } else {
                    this.subjectList.length = 0;
                    this.desSubjectData = data.status.description;
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
    }

    getValueInCourse(data) {
        this.selectedCourseData = null;
        for (var i = 0; i < this.courseList.length; i++) {
            this.courseData = this.courseList[i];
            console.log(" data=====" + data + "======" + this.courseData.name + "======");
            if (this.courseData.name != null || this.courseData.name != '') {
                if (this.courseData.name.trim() == data.trim()) {
                    this.selectedCourseData = this.courseList[i];
                    console.log(" this.selectedCourseData=====" + JSON.stringify(this.selectedCourseData));

                }
            }

        }
    }

    getValueInSubject(data) {
        this.selectedSubjectData = null;
        for (var i = 0; i < this.subjectList.length; i++) {
            this.subjectData = this.subjectList[i];
            if (this.subjectData.name != null || this.subjectData.name != '') {
                if (this.subjectData.name.trim() == data.trim()) {
                    this.selectedSubjectData = this.subjectList[i];
                    console.log(" this.selectedSubjectData=====" + JSON.stringify(this.selectedSubjectData));

                }
            }

        }
    }
    onSubmit() {
        if (this.timetableForm.invalid) {
            return;
        }
        if (this.selectedDepartmentData == '' || this.selectedDepartmentData == undefined || this.selectedDepartmentData == null) {
            this.toastr.error('', "Choose Department");
            return;
        }
        else if (this.selectedCourseData == '' || this.selectedCourseData == undefined || this.selectedCourseData == null) {
            if (this.courseList != null) {
                if (this.courseList.length == 0) {
                    this.toastr.error('', "No Course for this selected department.. so cant able to add student...");
                } else {
                    this.toastr.error('', "Choose Course");
                }
            }
            else {
                this.toastr.error('', "Choose Course");
            }

            return;
        }
        else if (this.selectedSubjectData == '' || this.selectedSubjectData == undefined || this.selectedSubjectData == null) {
            if (this.subjectList != null) {
                if (this.subjectList.length == 0) {
                    this.toastr.error('', "No subject for this selected course.. so cant able to add chapter...");
                } else {
                    this.toastr.error('', "Choose subject");
                }
            }
            else {
                this.toastr.error('', "No subject for this selected course.. so cant able to add chapter...");
            }
            return;
        }

    }


}
