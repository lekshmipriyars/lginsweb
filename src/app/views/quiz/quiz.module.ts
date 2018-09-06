/**
 * Created by priya on 09/08/18.
 */
import { NgModule,Component, OnInit,ViewChild } from '@angular/core';
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
import {QuizRoutingModule} from './quiz-routing.module';
// Import your library
import { FormWizardModule } from 'angular2-wizard';
import { CreateQuizComponent } from './createquiz.component';
import { AllQuestionsComponent } from './allquestions.component';
import { ViewQuestionsComponent } from './viewquestions.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {MatStepperModule} from '@angular/material/stepper'
import {AngularGooglePlaceModule} from 'angular-google-place';
import {CKEditorModule} from 'ng2-ckeditor';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DataTableModule } from 'angular4-smart-table/dist/index';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
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

} from '@angular/material';



@NgModule({
    imports: [
        CommonModule,
        MatStepperModule,
        MatRadioModule,
        FormsModule,
        QuizRoutingModule,
        ReactiveFormsModule,
        FormWizardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        MatDatepickerModule,
        MatFormFieldModule,
        Ng2SearchPipeModule,
        Ng4LoadingSpinnerModule.forRoot(),
        MatInputModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AngularGooglePlaceModule,
        CKEditorModule,
        MatIconModule,
        DataTableModule,
        PaginationModule.forRoot(),
    ],
    declarations: [
        CreateQuizComponent,
        AllQuestionsComponent,
        ViewQuestionsComponent,
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class QuizModule { }
