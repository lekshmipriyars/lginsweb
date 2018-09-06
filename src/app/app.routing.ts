import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { HomeComponent } from './views/home/home.component';
import { ContactUsComponent } from './views/contactus/contactus.component';
import { AboutUsComponent } from './views/aboutus/aboutus.component';
export const routes:Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '404',
        component: P404Component,
        data: {
            title: 'Page 404'
        }
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500'
        }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {
            title: 'Login Page'
        }
    },
    {
        path: 'home',
        component: HomeComponent,
        data: {
            title: 'Login Page'
        }
    },
    {
        path: 'register',
        component: RegisterComponent,
        data: {
            title: 'Register Page'
        }
    },
    {
        path: 'contactus',
        component: ContactUsComponent,
        data: {
            title: 'ContactUs Page'
        }
    },
    {
        path: 'aboutus',
        component: AboutUsComponent,
        data: {
            title: 'AboutUs Page'
        }
    },

    {
        path: '',
        component: DefaultLayoutComponent,
        data: {
            title: 'Home'
        },
        children: [
            {
                path: 'chapter',
                loadChildren: './views/chapter/chapter.module#ChapterModule'
            },
            {
                path: 'quiz',
                loadChildren: './views/quiz/quiz.module#QuizModule'
            },
            {
                path: 'project',
                loadChildren: './views/project/project.module#ProjectModule'
            },
            {
                path: 'task',
                loadChildren: './views/task/task.module#TaskModule'
            },
            {
                path: 'event',
                loadChildren: './views/event/event.module#EventModule'
            },
            {
                path: 'diary',
                loadChildren: './views/diary/diary.module#DiaryModule'
            },
            {
                path: 'department',
                loadChildren: './views/department/department.module#DepartmentModule'
            },
            {
                path: 'course',
                loadChildren: './views/course/course.module#CourseModule'
            },
            {
                path: 'student',
                loadChildren: './views/student/student.module#StudentModule'
            },
            {
                path: 'staff',
                loadChildren: './views/staff/staff.module#StaffModule'
            },
            {
                path: 'exam',
                loadChildren: './views/exam/exam.module#ExamModule'
            },
            {
                path: 'subject',
                loadChildren: './views/subject/subject.module#SubjectModule'
            },
            {
                path: 'acadamicyear',
                loadChildren: './views/acadamicyear/acadamicyear.module#AcadamicyearModule'
            },

            {
                path: 'dashboard',
                loadChildren: './views/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'staff-dashboard',
                loadChildren: './views/staffdashboard/staffdashboard.module#StaffDashboardModule'
            },

            {
                path: 'notifications',
                loadChildren: './views/notifications/notifications.module#NotificationsModule'
            },
            {
                path: 'activity',
                loadChildren: './views/activity/activity.module#ActivityModule'
            },
            {
                path: 'fees',
                loadChildren: './views/fees/fees.module#FeesModule'
            },
            {
                path: 'club',
                loadChildren: './views/club/club.module#ClubModule'
            },
            {
                path: 'timetable',
                loadChildren: './views/timetable/timetable.module#TimetableModule'
            },
            {
                path: 'vocabulary',
                loadChildren: './views/vocabulary/vocabulary.module#VocabularyModule'
            },
            {
                path: 'personality',
                loadChildren: './views/personality/personality.module#PersonaliytModule'
            },
            {
                path: 'places',
                loadChildren: './views/places/places.module#PlacesModule'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
