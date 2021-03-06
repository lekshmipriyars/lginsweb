/**
 * Created by priya on 03/09/18.
 */
/**
 * Created by priya on 30/08/18.
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

import { AddPersonalityComponent } from './addpersonality.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Personality'
        },
        children: [

            {
                path: 'add-personality',
                component: AddPersonalityComponent,
                data: {
                    title: 'Add Personality'
                }
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes),CommonModule],
    exports: [RouterModule]
})
export class PersonalityRoutingModule {}
