/*import { NgModule } from '@angular/core';
 import { FormsModule } from '@angular/forms';
 import { ChartsModule } from 'ng2-charts/ng2-charts';
 import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
 import { ButtonsModule } from 'ngx-bootstrap/buttons';

 import { DashboardComponent } from './dashboard.component';
 import { DashboardRoutingModule } from './dashboard-routing.module';
 import { Ng2SearchPipeModule } from 'ng2-search-filter';*/
import { NgModule,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl,FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule,
    MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';


// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
//dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



// Components Routing
import { StaffDashboardRoutingModule } from './staffdashboard-routing.module';
import { StaffDashboardComponent } from './staffdashboard.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        Ng2SearchPipeModule,
        StaffDashboardRoutingModule,
        ChartsModule,
        BsDropdownModule,
        ButtonsModule.forRoot()
    ],
    declarations: [ StaffDashboardComponent ]
})
export class StaffDashboardModule { }
