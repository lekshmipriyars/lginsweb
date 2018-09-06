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
import {ChapterRoutingModule} from './chapter-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddChapterComponent } from './addchapter.component';
import { ViewChapterComponent } from './viewchapter.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChapterRoutingModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        Ng2SearchPipeModule,
        Ng4LoadingSpinnerModule.forRoot(),
    ],
    declarations: [
        AddChapterComponent,
        ViewChapterComponent


    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class ChapterModule { }
