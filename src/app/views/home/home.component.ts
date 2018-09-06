import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule,
    MatTooltipModule
} from '@angular/material';
import {FlexLayoutModule,BREAKPOINT} from '@angular/flex-layout';
import { LocalStorageService, NgxResource } from 'ngx-store';
import { UserData } from '../../views/login/userdata';
import { ConfigFile,APPVERSION } from '../../views/services/configfile';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselsComponent } from '../../views/base/carousels.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'home.component.html',
    providers: [
        { provide: CarouselConfig, useValue: { interval: 1500, noPause: true ,showIndicators: true  }
        }
    ],
   
})
export class HomeComponent {
    userData = new UserData();
    appversion= new APPVERSION();
    appversionData='';
    options = {
        direction: 'row',
        mainAxis: 'space-around',
        crossAxis: 'center'
    };
    myInterval = 2500;
    activeSlideIndex = 0;
    isPage='Home';
    slides = [
        {image: 'assets/ins-home-bg.png'},
        {image: 'assets/Students_at_the_University_of_Mary_Lumen_Vitae_University_Center.jpg'},
        {image: 'assets/semesterstart14.jpg'}
    ];

    showIndicator = true;

    switchIndicator(): void {
        this.showIndicator = !this.showIndicator;
    }




    constructor(public localStorageService:LocalStorageService) {
        this.localStorageService.set('userdata', '')
        console.log('userdata in home -------------:', this.localStorageService.get('userdata'));
        this.appversionData =this.appversion.DefaultParams.appVersion;


    }

    // functionalities
    public functionalities:Array<any> = [
        {'title': 'Attendance management', 'image': 'how_to_reg'},
        {'title': 'Faculty Management', 'image': 'wc'},
        {'title': 'Event Calendar', 'image': 'event_note'},
        {'title': 'Examination Management', 'image': 'assignment_turned_in'},
        {'title': 'Library Management', 'image': 'local_library'},
        {'title': 'Reception & Front Office', 'image': 'business'},
        {'title': 'Reports', 'image': 'insert_chart'},
        {'title': 'Time Table', 'image': 'format_list_numbered'},
        {'title': 'Student Info Management', 'image': 'person'},
        {'title': 'User Customisation', 'image': 'settings'},
        {'title': 'Scheduling', 'image': 'access_alarms'},
        {'title': 'Assessment Management', 'image': 'equalizer'},
        {'title': 'Enrollment Management', 'image': 'how_to_reg'},
        {'title': 'Higher Education', 'image': 'school'},
        {'title': 'Student Records', 'image': 'art_track'},
        {'title': 'Academics', 'image': 'chrome_reader_mode'},
        {'title': 'Admission', 'image': 'group_add'},
        {'title': 'Courses', 'image': 'list'},
        {'title': 'Email Integration', 'image': 'mail'},
        {'title': 'Event Management', 'image': 'date_range'},
        {'title': 'Help Desk', 'image': 'contact_phone'},
        {'title': 'Mobile Support', 'image': 'phonelink_ring'},
        {'title': 'Registration Management', 'image': 'offline_pin'},
        {'title': 'SMS', 'image': 'drafts'},
        {'title': 'School Management', 'image': 'domain\n'},
        {'title': 'Attendance Tracking', 'image': 'ballot'},
        {'title': 'Facility Management', 'image': 'supervised_user_circle'},
        {'title': 'Curriculum Management', 'image': 'vertical_split'},
        {'title': 'Parent Portal', 'image': 'people'},
        {'title': 'Student Portal', 'image': 'person'}

    ];

    // functionalitiesFeatures
    public functionalitiesFeatures:Array<any> = [
        {
            'title': 'Academics',
            'description': 'Synchronized study content on all devices.  Adaptive Quizzes for personlised learning. Engaging video content to help students master their concepts.Detailed feedback and analysis for teachers'
        },
        {
            'title': 'Assessment',
            'description': 'Analyse progress and plan better. Create assignments and homework. Create tests and analyse marks. Customized quizes and examinations'
        },
        {
            'title': 'Administration',
            'description': 'Synchronized study content on all devices.Adaptive Quizzes for personlised learning.Engaging video content to help students master their concepts. Detailed feedback and analysis for teachers'
        },
        {
            'title': 'Activities',
            'description': '  Adaptive Quizzes for personlised learning. Engaging video content to help students master their concepts. Detailed feedback and analysis for teachers'
        },
    ];


    // for clicking that radio button
    layoutAlign() {
        return `${this.options.mainAxis} ${this.options.crossAxis}`;
    }



}

