/**
 * Created by priya on 09/08/18.
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

import { CreateQuizComponent } from './createquiz.component';
import { AllQuestionsComponent } from './allquestions.component';
import { ViewQuestionsComponent } from './viewquestions.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Question'
        },
        children: [
            {
                path: 'create-question',
                component: CreateQuizComponent,
                data: {
                    title: 'Create Question'
                }
            },
            {
                path: 'all-questions',
                component: AllQuestionsComponent,
                data: {
                    title: 'All Question'
                }
            },
            {
                path: 'view-questions',
                component: ViewQuestionsComponent,
                data: {
                    title: 'view Question'
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
export class QuizRoutingModule { }
