/**
 * Created by priya on 11/07/18.
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

import { AddEventComponent } from './addevent.component';
import { AddEventVenueComponent } from './addeventvenue.component';
import { EventTypeAddComponent } from './eventtypeadd.component';
import { EventListComponent } from './eventlist.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Event'
        },
        children: [
            {
                path: 'add-event-type',
                component: EventTypeAddComponent,
                data: {
                    title: 'EventType'
                }
            },
            {

                path: 'add-event-venue',
                component: AddEventVenueComponent,
                data: {
                    title: 'Add EventVenue'
                }
            },
            {
                path: 'add-event',
                component: AddEventComponent,
                data: {
                    title: 'Add Event'
                }
            },
            {
                path: 'event-list',
                component: EventListComponent,
                data: {
                    title: 'Event List'
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
export class EventRoutingModule { }
