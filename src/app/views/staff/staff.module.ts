/**
 * Created by priya on 10/07/18.
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
    MatTooltipModule,MatRadioModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
//dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



// Components Routing
import { StaffRoutingModule } from './staff-routing.module';
import { AddStaffComponent } from './addstaff.component';
import { StaffListComponent } from './stafflist.component';
import { EditStaffComponent } from './editstaff.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { DataTableModule } from 'angular4-smart-table/dist/index';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StaffRoutingModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatIconModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        Ng2SearchPipeModule,
        Ng2TelInputModule,
        Ng4LoadingSpinnerModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot(),
        DataTableModule,

    ],
    declarations: [
        AddStaffComponent,
        StaffListComponent,
        EditStaffComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
})
export class StaffModule {
}
