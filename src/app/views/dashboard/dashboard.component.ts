import { NgModule,Component, OnInit,Injectable,Directive, ElementRef, HostListener, Input,ViewChild,Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule,
    MatTooltipModule
} from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';
import {FlexLayoutModule} from '@angular/flex-layout';

import { PermissionService } from './../permission.service';
import { Permission } from './../permission';
import * as CryptoJS from 'crypto-js/crypto-js';
import { ToastrService } from 'ngx-toastr';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LocalStorageService, NgxResource } from 'ngx-store';
import  {BasicCrptoCredentials} from '../services/BasicCrptoCredentials';
import { ValidationService } from '../services/validation.service';
import { IUserLogin } from '../shared/interface';
import { LoggerService } from '../services/logger.service';
import { OnlyNumber } from '../services/onlynumber.directive';
import { UploadFileService } from '../services/upload-file.service';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
import { UserGetData } from '../_models/usergetdata';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FilterPipe} from '../services/FilterPipe';
import { InsManagerService } from '../services/insmanager.service';
import {CommonModule} from '@angular/common';
import { ConfigFile,INSTITUTE_TYPES,SENDMESSAGE_TYPEID,content_file_type_extension,contentType,content_file_type } from '../services/configfile';
import { Department } from '../_models/Department';
import { environment } from '../../../environments/environment';

@Component({
    templateUrl: 'dashboard.component.html'
})
@NgModule({
    imports: [CommonModule],
    declarations:[FilterPipe],
    exports:[FilterPipe]
})
export class DashboardComponent implements OnInit {
    baseUrl = environment.baseUrl;
    getUserListParamData = new GetUserListParamData();
    crypto = new BasicCrptoCredentials();
    userGetDataList:UserGetData [] = [];
    userTypeIdList:number[] = [];
    departmentList:Department [];
    userData = new UserGetData();
    configFile = new ConfigFile();
    departmentData = new Department();
    maleCount = 0;
    femaleCount = 0;
    malePercentage = '';
    errorMessage = String;
    desData = '';
    femalePercentage = '';
    malePercentageVal = 0;
    femalePercentageVal = 0;
    selectedDepartmentData = null;
    backgroundImage='../assets/img/search-icon.png';
    constructor(public localStorageService:LocalStorageService,
                private router:Router,
                private spinnerService: Ng4LoadingSpinnerService,
                private toastr:ToastrService,
                private insmanagerService:InsManagerService) {
        console.log('userdata in dashboard -------------:', this.localStorageService.get('userdata'));

        if (this.localStorageService.get('userdata') == '' || this.localStorageService.get('userdata') == null) {
            this.router.navigate(['./home']);
            this.refresh();  /// this needs to be fix..
        } else {
            this.userData = this.localStorageService.get('userdata');
        }

    }
    refresh():void {
        window.location.reload();
    }

    // lineChart1
    public lineChart1Data:Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Series A'
        }
    ];
    public lineChart1Labels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart1Options:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 40 - 5,
                    max: 84 + 5,
                }
            }],
        },
        elements: {
            line: {
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart1Colours:Array<any> = [
        {
            backgroundColor: getStyle('--primary'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart1Legend = false;
    public lineChart1Type = 'line';

    // lineChart2
    public lineChart2Data:Array<any> = [
        {
            data: [1, 18, 9, 17, 34, 22, 11],
            label: 'Series A'
        }
    ];
    public lineChart2Labels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart2Options:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent',
                    zeroLineColor: 'transparent'
                },
                ticks: {
                    fontSize: 2,
                    fontColor: 'transparent',
                }

            }],
            yAxes: [{
                display: false,
                ticks: {
                    display: false,
                    min: 1 - 5,
                    max: 34 + 5,
                }
            }],
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart2Colours:Array<any> = [
        { // grey
            backgroundColor: getStyle('--info'),
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart2Legend = false;
    public lineChart2Type = 'line';


    // lineChart3
    public lineChart3Data:Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'Series A'
        }
    ];
    public lineChart3Labels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChart3Options:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
            },
        },
        legend: {
            display: false
        }
    };
    public lineChart3Colours:Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)',
        }
    ];
    public lineChart3Legend = false;
    public lineChart3Type = 'line';


    // barChart1
    public barChart1Data:Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
            label: 'Series A'
        }
    ];
    public barChart1Labels:Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    public barChart1Options:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                barPercentage: 0.6,
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        }
    };
    public barChart1Colours:Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.3)',
            borderWidth: 0
        }
    ];
    public barChart1Legend = false;
    public barChart1Type = 'bar';

    // mainChart

    public mainChartElements = 27;
    public mainChartData1:Array<number> = [];
    public mainChartData2:Array<number> = [];
    public mainChartData3:Array<number> = [];

    public mainChartData:Array<any> = [
        {
            data: this.mainChartData1,
            label: 'Current'
        },
        {
            data: this.mainChartData2,
            label: 'Previous'
        },
        {
            data: this.mainChartData3,
            label: 'BEP'
        }
    ];
    /* tslint:disable:max-line-length */
    public mainChartLabels:Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    /* tslint:enable:max-line-length */
    public mainChartOptions:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
                labelColor: function (tooltipItem, chart) {
                    return {backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor}
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                gridLines: {
                    drawOnChartArea: false,
                },
                ticks: {
                    callback: function (value:any) {
                        return value.charAt(0);
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250
                }
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public mainChartColours:Array<any> = [
        { // brandInfo
            backgroundColor: hexToRgba(getStyle('--info'), 10),
            borderColor: getStyle('--info'),
            pointHoverBackgroundColor: '#fff'
        },
        { // brandSuccess
            backgroundColor: 'transparent',
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff'
        },
        { // brandDanger
            backgroundColor: 'transparent',
            borderColor: getStyle('--danger'),
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';

    // social box charts

    public brandBoxChartData1:Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Facebook'
        }
    ];
    public brandBoxChartData2:Array<any> = [
        {
            data: [1, 13, 9, 17, 34, 41, 38],
            label: 'Twitter'
        }
    ];
    public brandBoxChartData3:Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'LinkedIn'
        }
    ];
    public brandBoxChartData4:Array<any> = [
        {
            data: [35, 23, 56, 22, 97, 23, 64],
            label: 'Google+'
        }
    ];

    public brandBoxChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public brandBoxChartOptions:any = {
        tooltips: {
            enabled: false,
            custom: CustomTooltips
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
            }],
            yAxes: [{
                display: false,
            }]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3,
            }
        },
        legend: {
            display: false
        }
    };
    public brandBoxChartColours:Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
            pointHoverBackgroundColor: '#fff'
        }
    ];
    public brandBoxChartLegend = false;
    public brandBoxChartType = 'line';

    public random(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    ngOnInit():void {
        // generate random values for mainChart
        for (let i = 0; i <= this.mainChartElements; i++) {
            this.mainChartData1.push(this.random(50, 200));
            this.mainChartData2.push(this.random(80, 100));
            this.mainChartData3.push(65);
        }

        this.getAllDepartmentList();

    }

    radioModel:string = 'Month';
//department selection code
    getValueInDepartment(data) {
        this.selectedDepartmentData = null;
        for (var i = 0; i < this.departmentList.length; i++) {
            this.departmentData = this.departmentList[i];
            if (this.departmentData.name == data) {
                this.selectedDepartmentData = this.departmentList[i];
                console.log(" this.selectedDepartmentData=====" + JSON.stringify(this.selectedDepartmentData));
            }
        }
        this.assignUserListParams(this.selectedDepartmentData.departmentId);
        this.getAllIUsersList();
    }
    private assignUserListParams(departmentId) {
        this.userTypeIdList = [];
        this.userTypeIdList.push(INSTITUTE_TYPES.USER_TYPE_STAFF);
        this.getUserListParamData.instituteId = 1;
        this.getUserListParamData.userTypeId = this.userTypeIdList;
        this.getUserListParamData.courseId = 0;
        this.getUserListParamData.departmentId=(this.selectedDepartmentData == null)?0:departmentId
        this.getUserListParamData.subjectId = 0;
        console.log("getUserListParamData=====" + JSON.stringify(this.getUserListParamData))

    }


    // all userlist getting
    getAllIUsersList():void {
        this.userGetDataList.length = 0;  // for array clear
        this.insmanagerService.getUserListWithPromise(this.getUserListParamData)
            .then(userListData=> {
                var data = JSON.parse(JSON.stringify(userListData));
                if (data.status.success) {
                    this.userGetDataList = this.getDecryptedDatas(data.data);
                    this.desData = '';
                    // console.log("userGetDataList========" + JSON.stringify(this.userGetDataList));

                } else {
                    this.maleCount = 0;
                    this.femaleCount = 0;
                    this.malePercentage = '';
                    this.femalePercentage = '';
                    this.malePercentageVal = 0;
                    this.femalePercentageVal = 0;
                    this.desData = data.status.description;
                }
            },
                error => this.errorMessage = <any>error);
    }

// all department getting
    getAllDepartmentList():void {
        this.departmentList = [];
        var department_all_get_url = this.baseUrl+this.configFile.departmentlist_by_institute;
        department_all_get_url = department_all_get_url.replace('{instituteId}', this.userData.instituteId.toString());
        this.insmanagerService.getAllDepartmentsWithPromise(department_all_get_url)
            .then(deparmentData=> {
                var data = JSON.parse(JSON.stringify(deparmentData));
                if (data.status.success) {
                    this.departmentList = data.data;
                    this.assignUserListParams(this.departmentList[0].departmentId);
                    this.getAllIUsersList();
                    console.log("departmentList========" + JSON.stringify(this.departmentList));
                } else {
                    this.toastr.error('', data.status.description);

                }
            },
                error => this.errorMessage = <any>error);
    }


    getDecryptedDatas(data) {

        this.maleCount = 0;
        this.femaleCount = 0;
        this.malePercentage = '';
        this.femalePercentage = '';
        this.malePercentageVal = 0;
        this.femalePercentageVal = 0;
        data.forEach((key:any, val:any) => {
            this.userData = key;
            this.userData.userName = (this.userData.userName != null || this.userData.userName != undefined || this.userData.userName != '') ? this.crypto.decryptByAES(this.userData.userName) : '';
            this.userData.profileImage = (this.userData.profileImage == null || this.userData.profileImage == undefined || this.userData.profileImage == '') ? '' : this.crypto.decryptByAES(this.userData.profileImage);
            this.userData.emailId = (this.userData.emailId == null || this.userData.emailId == undefined || this.userData.emailId == '') ? '' : this.crypto.decryptByAES(this.userData.emailId);
            this.userData.fName = (this.userData.fName == null || this.userData.fName == undefined || this.userData.fName == '') ? '' : this.crypto.decryptByAES(this.userData.fName);
            this.userData.lName = (this.userData.lName == null || this.userData.lName == undefined || this.userData.lName == '') ? '' : this.crypto.decryptByAES(this.userData.lName);
            this.userData.location = (this.userData.location == null || this.userData.location == undefined || this.userData.location == '') ? '' : this.crypto.decryptByAES(this.userData.location);
            this.userData.address = (this.userData.address == null || this.userData.address == undefined || this.userData.address == '') ? '' : this.crypto.decryptByAES(this.userData.address);
            if (this.userData.lName == '') {
                if (this.userData.fName == '') {
                    if (this.userData.userName != '') {
                        this.userData.displayName = this.userData.userName;
                    }
                } else {
                    this.userData.displayName = this.userData.fName;
                }
            }
            if (this.userData.gender == 1) {
                this.maleCount++;
            }
            if (this.userData.gender == 2) {
                this.femaleCount++;
            }

            this.userGetDataList.push(this.userData);
        })

        this.malePercentageVal = (this.maleCount / (this.maleCount + this.femaleCount));
        this.femalePercentageVal = (this.femaleCount / (this.maleCount + this.femaleCount));

        this.malePercentage = Math.round((this.malePercentageVal * 100)) + "%";
        this.femalePercentage = Math.round(( this.femalePercentageVal * 100)) + "%";
        ///  console.log("======="+JSON.stringify(this.userGetDataList))
        // console.log("maleCount=======" + this.maleCount + "==" + this.malePercentage)
        // console.log("femaleCount=======" + this.femaleCount + "==" + this.femalePercentage);
        return this.userGetDataList;
    }

    getWidhSizeInMale() {
        return this.malePercentage;
    }

    getWidhSizeInFeMale() {
        return this.femalePercentage;
    }
}
