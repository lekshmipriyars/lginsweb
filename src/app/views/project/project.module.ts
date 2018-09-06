/**
 * Created by priya on 18/07/18.
 */


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

// Components Routing
import {ProjectRoutingModule} from './project-routing.module';


import { AddProjectComponent } from './addproject.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProjectRoutingModule,
        ReactiveFormsModule
    ],
    declarations: [
        AddProjectComponent,


    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class ProjectModule { }
