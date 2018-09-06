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
import {FlexLayoutModule} from '@angular/flex-layout';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

// Components Routing
import {EventRoutingModule} from './event-routing.module';
// Import your library
import { FormWizardModule } from 'angular2-wizard';

import { AddEventComponent } from './addevent.component';
import { AddEventVenueComponent } from './addeventvenue.component';
import { EventListComponent } from './eventlist.component';
import { EventTypeAddComponent } from './eventtypeadd.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {MatStepperModule} from '@angular/material/stepper'
import {AngularGooglePlaceModule} from 'angular-google-place';
import {CKEditorModule} from 'ng2-ckeditor';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MAT_DATE_FORMATS,
    MatCardModule,

} from '@angular/material';



@NgModule({
    imports: [
        CommonModule,
        MatStepperModule,
        MatRadioModule,
        FormsModule,
        EventRoutingModule,
        ReactiveFormsModule,
        FormWizardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        Ng2SearchPipeModule,
        Ng4LoadingSpinnerModule.forRoot(),
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AngularGooglePlaceModule,
        CKEditorModule,
        MatCardModule,
    ],
    declarations: [
        AddEventComponent,
        EventTypeAddComponent,
        AddEventVenueComponent,
        EventListComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class EventModule { }
