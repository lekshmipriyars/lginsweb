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
import { ExamTypeAddComponent } from './examtypeadd.component';
import { AddExamComponent } from './addexam.component';
import { ViewExamListComponent } from './viewexamlist.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Exam'
    },
    children: [
      {
        path: 'examtype-add',
        component: ExamTypeAddComponent,
        data: {
          title: 'ExamType Add'
        }
      },
      {
        path: 'add-exam',
        component: AddExamComponent,
        data: {
          title: 'Exam Add'
        }
      },
      {
        path: 'exam-list',
        component: ViewExamListComponent,
        data: {
          title: 'Exam List'
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
export class ExamRoutingModule { }
