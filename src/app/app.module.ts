import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA,ModuleWithProviders,Directive, ElementRef, HostListener, Input,ViewChild } from '@angular/core';
import { LocationStrategy, HashLocationStrategy,APP_BASE_HREF, Location } from '@angular/common';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {FlexLayoutModule, BREAKPOINT} from '@angular/flex-layout';
import {FormGroup, FormsModule,AbstractControl, FormBuilder, Validators,ReactiveFormsModule} from '@angular/forms';
import { Http, Response, Headers, RequestOptions, HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WebStorageModule } from 'ngx-store';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { FilterPipe} from './views/services/FilterPipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { ModalDirective,ModalModule } from 'ng2-bootstrap';
import {CKEditorModule} from 'ng2-ckeditor';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {AngularGooglePlaceModule} from 'angular-google-place';
import { PaginationModule } from 'ng2-bootstrap';
import { DataTableModule } from 'angular4-smart-table/dist/index';

import * as moment from 'moment';
import {Ng2TelInputModule} from 'ng2-tel-input';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG:PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

// Route Configuration
export const routes:Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    { path: '**', component: HomeComponent }

];

export const routing:ModuleWithProviders = RouterModule.forRoot(routes);

import { AppComponent } from './app.component';
import {DateAdapter, MatRippleModule, MAT_DATE_LOCALE} from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { RegisterService } from './views/register/register.service';
import { ExamService } from './views/exam/exam.service';
import { StaffService } from './views/staff/staff.service';
import { DairyService } from './views/diary/diary.service';
import { InsManagerService } from './views/services/insmanager.service';
import { LoaderService } from './views/loader/loader.service';
import * as CryptoJS from 'crypto-js/crypto-js';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselsComponent } from './views/base/carousels.component';
import { CarouselConfig } from 'ngx-bootstrap/carousel'


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



// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ContactUsComponent } from './views/contactus/contactus.component';
import { AboutUsComponent } from './views/aboutus/aboutus.component';


const APP_CONTAINERS = [
    DefaultLayoutComponent
];

import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
} from '@coreui/angular'

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './views/home/home.component';
import { OnlyNumber } from './views/services/onlynumber.directive';
import { UploadFileService } from './views/services/upload-file.service';


@NgModule({
    imports: [
        HttpModule,
        BrowserModule,
        AppRoutingModule,
        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatTableModule,
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
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        WebStorageModule,
        FilterPipeModule,
        ToastrModule.forRoot(), // ToastrModule added
        ShowHidePasswordModule.forRoot(),
        CKEditorModule,
        ModalModule.forRoot(),
        Ng4LoadingSpinnerModule.forRoot(),
        Ng2SearchPipeModule,
        MatFormFieldModule,
        MatInputModule,
        AngularGooglePlaceModule,
        Ng2TelInputModule,
        CarouselModule.forRoot(),
        DataTableModule,
        PaginationModule.forRoot(),
        RouterModule.forRoot(routes,{useHash:true}),
    ],
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        P404Component,
        P500Component,
        LoginComponent,
        RegisterComponent,
        NavbarComponent,
        HomeComponent,
        ContactUsComponent,
        AboutUsComponent,
        OnlyNumber,
        FilterPipe,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }, RegisterService,
       ExamService,
        DairyService,
        LoaderService,
        StaffService, UploadFileService,
        InsManagerService,
        {provide: APP_BASE_HREF, useValue: ''}],
    exports:[],
    bootstrap: [AppComponent]
})
export class AppModule {
}
