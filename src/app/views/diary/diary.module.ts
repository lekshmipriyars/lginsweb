/**
 * Created by priya on 13/07/18.
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
    MatTooltipModule,MatProgressBarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CKEditorModule} from 'ng2-ckeditor';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
// Components Routing
import {DiaryRoutingModule} from './diary-routing.module';


import { AddDiaryComponent } from './adddiary.component';
import { ViewDiaryComponent } from './viewdiary.component';
import { LoaderService } from '../loader/loader.service';
import { LoaderComponent } from '../loader/loader.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DiaryRoutingModule,
        ReactiveFormsModule,
        CKEditorModule,
        MatProgressBarModule,
        Ng4LoadingSpinnerModule.forRoot(),
    ],
    declarations: [
        AddDiaryComponent,
        ViewDiaryComponent,
        LoaderComponent,
    ],
    providers: [LoaderService,{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class DiaryModule { }
