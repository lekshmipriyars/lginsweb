/**
 * Created by priya on 13/07/18.
 */
export class ConfigFile {

    instituteTypes:INSTITUTE_TYPES;
    sendMessageTypeId:SENDMESSAGE_TYPEID;

    imageUrl = 'https://insbetaresources.s3.ap-southeast-1.amazonaws.com/';
    bucketImageUrl = 'https://betacontent.learnerguru.com/';

    login_url = "user/login";

    subject_url = 'subject/{courseId}';
    course_get_by_department_url = 'course/get/{departmentId}';
    departmentlist_by_institute = 'department/getByInstituteId/{instituteId}';
    user_get_by_userid = 'user/get/{userId}';
    event_venue_list = 'eventVenue/list/{instituteId}';
    event_venuetype_list = 'eventType/list/{instituteId}';
    add_event_url = 'event/add';
    all_events_get_url = 'event/{instituteId}';
    all_eventtypes_get_url='eventType/list/{instituteId}';

     //add
    chapter_add_url='chapter/add';
    project_add_url='project/add';
     diary_add= 'diary/add';
    exam_add='exam/add';
    question_add= 'question/add';
    user_add='user/add';
    acadamciyear_add='academicYear/add';
    subject_type_add='subject/type/add';
    course_add='course/add';
    department_add='department/create';
    eventtype_add='eventType/add';
    add_FeesType_url='feeType/add';
    add_vocabulary_url='vocabulary/add';
    contact_add_url='contact/add';
    //disable

    disable_dept = 'department/disable/{userId}/{departmentId}';
    disable_course = 'course/disable/{userId}/{courseId}';
    disable_eventtype = 'eventType/disable/{eventTypeId}';
    disable_subject = 'subject/disable/{userId}/{subjectId}';
    disable_examtype = 'examType/disable/{userId}/{examTypeId}';
    disable_subjecttype = 'subjectType/disable/{userId}/{subjectTypeId}';
    disable_staff= 'staff/disable/{userId}/{staffId}';
    disable_chapter= 'chapter/disable/{userId}/{chapterId}';
    disable_feetype= 'feeType/disable/{userId}/{feeTypeId}';  // need from backend

    //getAllQuestions

    getall_acadamicyear='academicYear/list/{instituteId}';
    getall_questions_by_user='question/get';
    getall_chapters='chapter/{subjectId}';
    user_get='user/get';
    exam_get='exam/get';
    subject_get_all='subject/get/type/{instituteId}';
    getall_feestype_url='feeType/list/{instituteId}';
    getall_vocabulary_url='vocabulary/get/{courseId}/{pageNumber}';

    diary_reply='diary/reply'
    //edit
    edit_user_url='user/update';
    edit_dept_url='department/edit/{departmentId}';
    edit_course_url='course/edit';
    edit_subject_url='subject/edit';
    edit_subject_type_url='subjectType/edit';
    edit_chapter_url='chapter/edit'
    ques_usage=[{id:1,name:'Test'},{id:2,name:'Practice'}];
    ques_verified_type=[{id:0,name:'Not Verified'},{id:2,name:'Verified'}];
    ques_error_type=[{id:0,name:'No Error'},{id:1,name:'Error'}];
    ques_explanation_type=[{id:0,name:'No'},{id:1,name:'Yes'}];
    questionTypes_Data = [{id: 1, name: 'Multiple Choice'}, {id: 2, name: 'Multiple Image Choice'},
        {id: 3, name: 'Multiple Choice Direction'}, {id: 4, name: 'Fill in Blanks'},
        {id: 5, name: 'True or False'}, {id: 6, name: 'Match the following'}, {id: 7, name: 'One Mark'},
        {id: 8, name: 'Two Marks'}, {id: 9, name: 'Three Marks'}, {id: 10, name: 'Four Marks'},
        {id: 11, name: 'Five Marks'}, {id: 12, name: 'Ten Marks'}];
}

export class APPVERSION {
    UpdateVersion = '1.2';
    DefaultParams = {'appVersion': '1.1.9', 'devicePlatformName': 'Desktop'};
    RELEASE_MODE = false;
}

export enum content_file_type_extension {
    PDF = 1,
    DOC = 2,
    DOCX = 3,
    TXT = 4,
    MP4 = 5,
    MP3 = 6,
    PNG = 7,
    JPG = 8,
    WMV = 9,
    AVI = 10,
    MOV = 11,
    JPEG = 12,
    GIF = 13,
    GP3 = 14,
}


export enum  content_file_type {
    PDF = 1,
    DOC = 2,
    DOCX = 3,
    TXT = 4,
    MP4 = 5,
    MP3 = 6,
    PNG = 7,
    JPG = 8,
    WMV = 9,
    AVI = 10,
    MOV = 11,
    JPEG = 12,
    THREEGP = 13,
    GIF = 14,
    GP3 = 15
}


/*
 export array
 var content_file_type_name;
 content_file_type_name = ['PDF Document', 'Microsoft Word Document', 'Microsoft Word Document', 'Text File', 'MPEG 4 Video', 'MPEG 3 Audio', 'Portable Network Graphics', 'Joint Photographic Group', 'Windows Media Video', 'Audio Video Interleaved(AVI)', 'Metal Oxide Varistor(MOV)', 'Joint Photographic Expert Group', '3GP', 'GIF'],
 */

export enum question_type  {
    QUESTION_TYPE_MULTIPLE_CHOICE = 1,
    QUESTION_TYPE_MULTIPLE_CHOICE_IMAGE = 2,
    QUESTION_TYPE_MULTIPLE_CHOICE_DIRECTION = 3,
    QUESTION_TYPE_FILL_IN_BLANKS = 4,
    QUESTION_TYPE_TRUE_OR_FALSE = 5,
    QUESTION_TYPE_MATCH_FOLLOWING = 6,
    QUESTION_TYPE_ONE_MARK = 7,
    QUESTION_TYPE_TWO_MARKS = 8,
    QUESTION_TYPE_THREE_MARKS = 9,
    QUESTION_TYPE_FOUR_MARKS = 10,
    QUESTION_TYPE_FIVE_MARKS = 11,
    QUESTION_TYPE_TEN_MARKS = 12,
    QUESTION_TYPE_SYLLOGISM_ONE = 13,
    QUESTION_TYPE_SYLLOGISM_TWO = 14,
    QUESTION_TYPE_SYLLOGISM_THREE = 15
}
;
var question_type_name = ['Multiple Choice', 'Multiple Image Choice', 'Multiple Choice Direction', 'Fill in Blanks', 'True or False', 'Match the following', 'One Mark',
    'Two Marks', 'Three Marks', 'Four Marks', 'Five Marks', 'Ten Marks', 'Syllogism one', 'Syllogism two', 'Syllogism three'];

var question_type_short_name = ['MCQ', 'MCQ-I', 'MCQ-D', 'FIB', 'T/F', 'MF', '1-M',
    '2-M', '3-M', '4-M', '5-M', '10-M', 'Syllogism-1', 'Syllogism2', 'Syllogism-3'];

export enum  contentType {
    IMAGE = 1,
    VIDEO = 2,
    PDF = 3,
    WORD = 4,
}


export enum  eventTypes{
    INSTITUTE = 1,
    DEPARTMENT = 2,
    PUBLIC = 3
}

export enum user_type {
    LEARNER = 1,
    GURU = 2,
    ADMIN = 3,
    SITEADMIN = 4,
    MODERATOR = 5,
    INSTITUTE = 6
}


export enum INSTITUTE_TYPES{
    USER_TYPE_ADMIN = 1,
    USER_TYPE_MANAGER = 2,
    USER_TYPE_PRINCIPAL = 3,
    USER_TYPE_STAFF = 4,
    USER_TYPE_ACCOUNTANT = 5,
    USER_TYPE_LIBRARIAN = 6,
    USER_TYPE_TRANSPORT_MANAGER = 7,
    USER_TYPE_ASSISTANT = 8,
    USER_TYPE_PARENT = 9,
    USER_TYPE_STUDENT = 10
}


export enum SENDMESSAGE_TYPEID {
    INSTITUTE = 1,
    DEPARTMENT = 2,
    COURSE = 3,
    SUBJECT = 4,
    INDIVIGUAL = 5
}

