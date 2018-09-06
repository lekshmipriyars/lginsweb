export const navItems = [
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        badge: {
            variant: 'info',
            text: 'NEW'
        }
    },

    {
        title: true,
        name: 'DataBase'
    },
    {
        name: 'AcadamicYear',
        url: '/acadamicyear',
        icon: 'icon-puzzle',
        children: [
            {
                name: 'Add / View',
                url: '/acadamicyear/add',
                icon: 'icon-puzzle'
            }]
    },
    {
        name: 'Department',
        url: '/department',
        icon: 'icon-graduation',
        children: [


            {
                name: 'Add Department',
                url: '/department/add-department',
                icon: 'icon-graduation'
            },
            {
                name: 'Department List',
                url: '/department/department-list',
                icon: 'icon-graduation'
            }
        ]
    },
    {
        name: 'Course',
        url: '/course',
        icon: 'icon-globe',
        children: [


            {
                name: 'Add Course',
                url: '/course/add-course',
                icon: 'icon-globe'
            },
            {
                name: 'Course List',
                url: '/course/course-list',
                icon: 'icon-globe'
            }
        ]
    },
    {
        name: 'Subject',
        url: '/subject',
        icon: 'icon-book-open',
        children: [
            {
                name: 'Subject Type',
                url: '/subject/subject-type',
                icon: 'icon-book-open'
            },

            {
                name: 'Add Subject',
                url: '/subject/add-subject',
                icon: 'icon-book-open'
            },
            {
                name: 'Subject List',
                url: '/subject/subject-list',
                icon: 'icon-book-open'
            }
        ]
    },
    {
        name: 'Chapter',
        url: '/chapter',
        icon: 'icon-docs',
        children: [
            {
                name: 'Add Chapter',
                url: '/chapter/add-chapter',
                icon: 'icon-docs'
            },
            {
                name: 'View Chapter',
                url: '/chapter/view-chapter',
                icon: 'icon-docs'
            },

        ]
    },
    {
        name: 'Exam',
        url: '/exam',
        icon: 'icon-fire',
        children: [
            {
                name: 'Exam Type',
                url: '/exam/examtype-add',
                icon: 'icon-fire'
            },

            {
                name: 'Add Exam',
                url: '/exam/add-exam',
                icon: 'icon-fire'
            },
            {
                name: 'List Exam',
                url: '/exam/exam-list',
                icon: 'icon-fire'
            }
        ]
    },
    {
        name: 'Diary',
        url: '/diary',
        icon: 'icon-notebook',
        children: [
            {
                name: 'Add Diary',
                url: '/diary/add-diary',
                icon: 'icon-notebook'
            },

            {
                name: 'View Diary',
                url: '/diary/diary-list',
                icon: 'icon-notebook'
            }
        ]
    },

    {
        name: 'Staff',
        url: '/staff',
        icon: 'icon-people',
        children: [
            {
                name: 'Add Staff',
                url: '/staff/add-staff',
                icon: 'icon-people'
            },
            {
                name: 'Staff List',
                url: '/staff/staff-list',
                icon: 'icon-people'
            },
            {
                name: 'View Staff',
                url: '/staff/view-staff',
                icon: 'icon-people'
            },
        ]
    },

    {
        name: 'Student',
        url: '/student',
        icon: 'icon-user',
        children: [
            {
                name: 'Add Student',
                url: '/student/add-student',
                icon: 'icon-user',
            },
            {
                name: 'Student List',
                url: '/student/student-list',
                icon: 'icon-user'
            },

        ]
    },
    {
        name: 'Day To Day',
        url: '/vocabulary',
        icon: 'icon-diamond',
        children: [
            {
                name: 'Vocabulary',
                url: '/vocabulary/vocabulary-list',
                icon: 'icon-diamond',
            },

            {
                name: 'Personality',
                url: '/personality/add-personality',
                icon: 'icon-diamond',
            },
            {
                name: 'Places',
                url: '/places/allplaces',
                icon: 'icon-diamond',
            },
        ]
    },
    {
        name: 'Task',
        url: '/task',
        icon: 'icon-note',
        children: [
            {
                name: 'Add Task',
                url: '/task/add-task',
                icon: 'icon-note',
            },


        ]
    },
    {
        name: 'Event',
        url: '/event',
        icon: 'icon-support',
        children: [
            {
                name: 'Event Type',
                url: '/event/add-event-type',
                icon: 'icon-support',
            },
            {
                name: 'Event Venue',
                url: '/event/add-event-venue',
                icon: 'icon-support',
            },
            {
                name: 'Add Event',
                url: '/event/add-event',
                icon: 'icon-support',
            },
            {
                name: 'Event List',
                url: '/event/event-list',
                icon: 'icon-support',
            },
        ]
    },
    {
        name: 'Question',
        url: '/quiz',
        icon: 'icon-trophy',
        children: [
            {
                name: 'Create Question',
                url: '/quiz/create-question',
                icon: 'icon-trophy',
            },
            {
                name: 'All Question',
                url: '/quiz/all-questions',
                icon: 'icon-trophy',
            },

        ]
    },
    {
        name: 'Fees',
        url: '/fees',
        icon: 'fa fa-file-text-o fa-lg ',
        children: [
            {
                name: 'Add Fees',
                url: '/fees/add-fees',
                icon: 'fa fa-file-text-o fa-lg',
            },
            {
                name: 'Add FeesType',
                url: '/fees/add-feestype',
                icon: 'fa fa-file-text-o fa-lg',
            },
        ]
    },
    {
        name: 'Project',
        url: '/project',
        icon: 'icon-folder',
        children: [
            {
                name: 'Add Project',
                url: '/project/add-project',
                icon: 'icon-folder',
            },
        ]
    },{
        name: 'Club',
        url: '/club',
        icon: 'fa fa-street-view fa-lg ',
        children: [
            {
                name: 'Add Club',
                url: '/club/add-club',
                icon: 'fa fa-street-view fa-lg ',
            },
        ]
    },
    {
        name: 'TimeTable',
        url: '/timetable',
        icon: 'icon-film',
        children: [
            {
                name: 'Add TimeTable',
                url: '/timetable/add-timetable',
                icon: 'icon-film',
            },
        ]
    },
    {
        name: 'Activtiy',
        url: '/activity',
        icon: 'fa fa-sitemap fa-lg ',
        children: [
            {
                name: 'Add Activity',
                url: '/activity/add-activity',
                icon: 'fa fa-sitemap fa-lg ',
            },
        ]
    },
    /*
     {
     title: true,
     name: 'Components'
     },
     {
     name: 'Base',
     url: '/base',
     icon: 'icon-puzzle',
     children: [
     {
     name: 'Cards',
     url: '/base/cards',
     icon: 'icon-puzzle'
     },
     {
     name: 'Carousels',
     url: '/base/carousels',
     icon: 'icon-puzzle'
     },
     {
     name: 'Collapses',
     url: '/base/collapses',
     icon: 'icon-puzzle'
     },
     {
     name: 'Forms',
     url: '/base/forms',
     icon: 'icon-puzzle'
     },
     {
     name: 'Pagination',
     url: '/base/paginations',
     icon: 'icon-puzzle'
     },
     {
     name: 'Popovers',
     url: '/base/popovers',
     icon: 'icon-puzzle'
     },
     {
     name: 'Progress',
     url: '/base/progress',
     icon: 'icon-puzzle'
     },
     {
     name: 'Switches',
     url: '/base/switches',
     icon: 'icon-puzzle'
     },
     {
     name: 'Tables',
     url: '/base/tables',
     icon: 'icon-puzzle'
     },
     {
     name: 'Tabs',
     url: '/base/tabs',
     icon: 'icon-puzzle'
     },
     {
     name: 'Tooltips',
     url: '/base/tooltips',
     icon: 'icon-puzzle'
     }
     ]
     },
     {
     name: 'Buttons',
     url: '/buttons',
     icon: 'icon-cursor',
     children: [
     {
     name: 'Buttons',
     url: '/buttons/buttons',
     icon: 'icon-cursor'
     },
     {
     name: 'Dropdowns',
     url: '/buttons/dropdowns',
     icon: 'icon-cursor'
     },
     {
     name: 'Brand Buttons',
     url: '/buttons/brand-buttons',
     icon: 'icon-cursor'
     }
     ]
     },
     {
     name: 'Charts',
     url: '/charts',
     icon: 'icon-pie-chart'
     },
     {
     name: 'Icons',
     url: '/icons',
     icon: 'icon-star',
     children: [
     {
     name: 'CoreUI Icons',
     url: '/icons/coreui-icons',
     icon: 'icon-star',
     badge: {
     variant: 'success',
     text: 'NEW'
     }
     },
     {
     name: 'Flags',
     url: '/icons/flags',
     icon: 'icon-star'
     },
     {
     name: 'Font Awesome',
     url: '/icons/font-awesome',
     icon: 'icon-star',
     badge: {
     variant: 'secondary',
     text: '4.7'
     }
     },
     {
     name: 'Simple Line Icons',
     url: '/icons/simple-line-icons',
     icon: 'icon-star'
     }
     ]
     },
     {
     name: 'Notifications',
     url: '/notifications',
     icon: 'icon-bell',
     children: [
     {
     name: 'Alerts',
     url: '/notifications/alerts',
     icon: 'icon-bell'
     },
     {
     name: 'Badges',
     url: '/notifications/badges',
     icon: 'icon-bell'
     },
     {
     name: 'Modals',
     url: '/notifications/modals',
     icon: 'icon-bell'
     }
     ]
     },
     {
     name: 'Widgets',
     url: '/widgets',
     icon: 'icon-calculator',
     badge: {
     variant: 'info',
     text: 'NEW'
     }
     },
     {
     divider: true
     },
     {
     title: true,
     name: 'Extras',
     },
     {
     name: 'Pages',
     url: '/pages',
     icon: 'icon-star',
     children: [
     {
     name: 'Login',
     url: '/login',
     icon: 'icon-star'
     },
     {
     name: 'Register',
     url: '/register',
     icon: 'icon-star'
     },
     {
     name: 'Error 404',
     url: '/404',
     icon: 'icon-star'
     },
     {
     name: 'Error 500',
     url: '/500',
     icon: 'icon-star'
     }
     ]
     },*/

];




