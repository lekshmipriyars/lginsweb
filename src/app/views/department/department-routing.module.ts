/**
 * Created by priya on 11/07/18.
 */
import { NgModule,Component , OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
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



import { AddDepartmentComponent } from './adddepartment.component';
import { DepartmentListComponent } from './departmentlist.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Department'
        },
        children: [

            {
                path: 'add-department',
                component: AddDepartmentComponent,
                data: {
                    title: 'Add Department'
                }
            },
            {
                path: 'department-list',
                component: DepartmentListComponent,
                data: {
                    title: 'Department List'
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class DepartmentRoutingModule { }
