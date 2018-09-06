import { NgModule,Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormControl,FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule} from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';
import { CommonModule } from '@angular/common';
import { DatePipe,LocationStrategy, HashLocationStrategy } from '@angular/common';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import {FlexLayoutModule} from '@angular/flex-layout'
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
// Components Routing
import { FeesRoutingModule } from './fees-routing.module';
import { AddfeesComponent } from './addfees/addfees.component';
import { FeeTypeComponent } from './feettype.component';
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
    MatStepperModule,
    MatNativeDateModule,
    MAT_DATE_FORMATS,


} from '@angular/material';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FeesRoutingModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [
    AddfeesComponent,
      FeeTypeComponent
  ],
  providers: [DatePipe,{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }]
})



export class FeesModule { }
