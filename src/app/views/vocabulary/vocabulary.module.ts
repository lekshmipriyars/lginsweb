/**
 * Created by priya on 30/08/18.
 */
import { NgModule,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl,FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
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
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
//dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

// Components Routing
import { VocabularyRoutingModule } from './vocabulary-routing.module';
import { VocabularyComponent } from './vocabulary.component';
import { ViewVocabularyComponent } from './viewvocabulary.component';
import { AddVocabularyComponent } from './addvocabulary.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {CKEditorModule} from 'ng2-ckeditor';
import { DataTableModule } from 'angular4-smart-table/dist/index';
import {
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatStepperModule,
    MatNativeDateModule,
    MAT_DATE_FORMATS,

} from '@angular/material';
import { DatePipe } from '@angular/common';
@NgModule({
    imports: [
         Ng2SearchPipeModule,
        VocabularyRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatIconModule,
        MatDatepickerModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        Ng2TelInputModule,
        MatFormFieldModule,
        CKEditorModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        DataTableModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),

    ],
    declarations: [ VocabularyComponent,AddVocabularyComponent,ViewVocabularyComponent ]
})
export class VocabularyModule { }
