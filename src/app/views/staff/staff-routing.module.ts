/**
 * Created by priya on 10/07/18.
 */
import { NgModule,Component } from '@angular/core';
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


// Components Routing
import { AddStaffComponent } from './addstaff.component';
import { StaffListComponent } from './stafflist.component';
import { EditStaffComponent } from './editstaff.component';
const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Staff'
        },
        children: [
            {
                path: 'add-staff',
                component: AddStaffComponent,
                data: {
                    title: 'Add Staff'
                }
            },
            {
                path: 'staff-list',
                component: StaffListComponent,
                data: {
                    title: 'Staff List'
                }
            },
            {
                path: 'edit-staff',
                component: EditStaffComponent,
                data: {
                    title: 'edit Staff'
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
export class StaffRoutingModule { }
