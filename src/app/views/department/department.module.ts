/**
 * Created by priya on 11/07/18.
 */
import { NgModule,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl,FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DataTableModule } from 'angular4-smart-table/dist/index';
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

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';


// Components Routing
import {DepartmentRoutingModule} from './department-routing.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddDepartmentComponent } from './adddepartment.component';
import { DepartmentListComponent } from './departmentlist.component';
import { PaginationModule } from 'ng2-bootstrap/pagination';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DepartmentRoutingModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        Ng2SearchPipeModule,
        DataTableModule,
        PaginationModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
    ],
    declarations: [
        AddDepartmentComponent,
        DepartmentListComponent

    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class DepartmentModule { }
