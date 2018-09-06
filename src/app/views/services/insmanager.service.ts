/**
 * Created by priya on 10/07/18.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import {AddAcadamicYear} from '../_models/AddAcadamicYear';
import {GetAcadamicYearData} from '../_models/GetAcadamicYearData';
import {Department} from '../_models/Department';
import {AddStudent} from '../_models/AddStudent';
import {GetCourse} from '../_models/GetCourse';
import {GetUserListParamData} from '../_models/getuserlistparmdata';
import {AddExam} from '../_models/AddExam';
import { GetExamType } from '../_models/GetExamType';
import { AddSubjectType } from '../_models/AddSubjectType';
import { AddEventType } from '../_models/AddEventType';
import { AddSubject } from '../_models/AddSubject';
import {GetSubject}from '../_models/GetSubject';
import {AddDiary}from '../_models/AddDiary';
import {AddTask}from '../_models/AddTask';
import {GetDiary} from '../_models/GetDiary';
import { LoaderService } from '../loader/loader.service';
import { SendDiary } from '../_models/SendDiary';
import { AddCourse } from '../_models/AddCourse';
import { Course } from '../_models/Course';
import { AddDepartment } from '../_models/AddDepartment';
import { GetAllExam} from '../_models/GetAllExam';
import { AddStaff} from '../_models/AddStaff';
import { AddEvent} from '../_models/AddEvent';
import { GetEventType } from '../_models/GetEventType';
import { ConfigFile } from '../services/configfile';
import { AddQuiz } from '../_models/AddQuiz';
import { EditCourse } from '../_models/EditCourse';
import { DataId}from '../_models/DataId';
import { EditSubjectType}from '../_models/EditSubjectType';
import { EditSubject } from '../_models/EditSubject';
import { GetQuestion } from '../_models/GetQuestion';
import { AddChapter } from '../_models/AddChapter';
import { GetChapter } from '../_models/GetChapter';
import { GetQuestionParms } from '../_models/GetQuestionParms';
import { GetStudent } from '../_models/GetStudent';
import { Login }  from '../_models/login';
import { EditStaff }  from '../_models/EditStaff';
import { AddProject } from '../_models/AddProject';
import { EditStudent }  from '../_models/EditStudent';
import { EditChapterData } from '../_models/EditChapterData'
import { AddFeesType } from '../_models/AddFeesType'
import { GetFeesType } from '../_models/GetFeesType'
import { AddVocabulary } from '../_models/AddVocabulary';
import  {AddContact} from '../_models/AddContact';
@Injectable()
export class InsManagerService {
    baseUrl = environment.baseUrl;
    configFile = new ConfigFile();
    getall_departments_byinsid_url = this.baseUrl + 'department/getByInstituteId/{instituteId}';
    course_all_get_url=this.baseUrl +'course/get/{departmentId}';
    all_departments_byacadamicid_url=this.baseUrl+'department/getByAcademicId/{academicId}';
    get_acadamic_url=this.baseUrl+'academicYear/list/{instituteId}';
    constructor(private http:Http,private loaderService: LoaderService) {
    }
    addLoginWithObservable(book:Login): Observable<Login> {
        var  login_url= this.baseUrl+this.configFile.login_url;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(login_url, book, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }
    addLoginWithPromise(user:Login): Promise<Login> {
        var  login_url= this.baseUrl+this.configFile.login_url;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(login_url, user, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addAcadamicWithObservable(addAcadamicYear:AddAcadamicYear):Observable<AddAcadamicYear> {
        var acadamicyear_add_url = this.baseUrl + this.configFile.acadamciyear_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(acadamicyear_add_url, addAcadamicYear, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    addAcadamicWithWithPromise(addAcadamicYear:AddAcadamicYear):Promise<AddAcadamicYear> {
        var acadamicyear_add_url = this.baseUrl + this.configFile.acadamciyear_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(acadamicyear_add_url, addAcadamicYear, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addCourseAddWithPromise(courseAdd:AddCourse): Promise<AddCourse> {
        var course_add_url= this.baseUrl+this.configFile.course_add
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(course_add_url, courseAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addStudentWithPromise(studentAdd:AddStudent):Promise<AddStudent> {
        var student_staff_add_url = this.baseUrl + this.configFile.user_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(student_staff_add_url, studentAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addQuizWithPromise(quizAdd:AddQuiz):Promise<AddQuiz> {
        var quiz_add_url = this.baseUrl + this.configFile.question_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(quiz_add_url, quizAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    ///add exam
    addExamWithPromise(addExam:AddExam):Promise<AddExam> {
        var exam_add_url = this.baseUrl + this.configFile.exam_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(exam_add_url, addExam, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    // subject type
    addSubjectTypeAddWithObservable(subjectttypeadd:AddSubjectType): Observable<AddSubjectType> {
        var subject_type_add_url = this.baseUrl + this.configFile.subject_type_add;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(subject_type_add_url, subjectttypeadd, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    addSubjectTypeAddWithPromise(subjectadd:AddSubjectType): Promise<AddSubjectType> {
        var subject_type_add_url = this.baseUrl + this.configFile.subject_type_add;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(subject_type_add_url, subjectadd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }


    addEventTypeAddWithPromise(eventTypeAdd:AddEventType): Promise<AddEventType> {
        var  event_type_add_url= this.baseUrl+this.configFile.eventtype_add;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(event_type_add_url, eventTypeAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }


    addSubjectWithPromise(addSubject:AddSubject):Promise<AddSubject> {
        var subject_add_url = this.baseUrl + 'subject/add';
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(subject_add_url, addSubject, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    addVocabularyWithPromise(addVocabulary:AddVocabulary):Promise<AddVocabulary> {
        var vocabulary_add_url = this.baseUrl + this.configFile.add_vocabulary_url;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(vocabulary_add_url, addVocabulary, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addChapterWithPromise(addChapter:AddChapter):Promise<AddChapter> {
        var chapter_add_url = this.baseUrl + this.configFile.chapter_add_url
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(chapter_add_url, addChapter, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addProjectWithPromise(addProject:AddProject):Promise<AddProject> {
        var project_add_url = this.baseUrl + this.configFile.project_add_url
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(project_add_url, addProject, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

/// dirydiary
    addDairyWithPromise(diaryAdd:AddDiary):Promise<AddDiary> {
        var diary_add_url = this.baseUrl + this.configFile.diary_add;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(diary_add_url, diaryAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addTaskWithPromise(taskAdd:AddTask):Promise<AddTask> {
        var task_add_url = this.baseUrl + 'task/add';
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post(task_add_url, taskAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addDepartmentAddWithObservable(departmentAdd:AddDepartment): Observable<AddDepartment> {
        var dept_create_rul=this.baseUrl+this.configFile.department_add
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(dept_create_rul, departmentAdd, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    addDepartmentAddWithPromise(departmentAdd:AddDepartment): Promise<AddDepartment> {
        var dept_create_rul=this.baseUrl+this.configFile.department_add
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(dept_create_rul, departmentAdd, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    addStaffWithPromise(addStaff:AddStaff): Promise<AddStaff> {
        var student_staff_add_url = this.baseUrl + this.configFile.user_add;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(student_staff_add_url, addStaff, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    addEventWithPromise(addEvent:AddEvent): Promise<AddEvent> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(environment.baseUrl+this.configFile.add_event_url, addEvent, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    addFeesTypeWithPromise(addFeesType:AddFeesType): Promise<AddFeesType> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(environment.baseUrl+this.configFile.add_FeesType_url, addFeesType, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    addCoantactTypeWithPromise(addContact:AddContact): Promise<AddContact> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(environment.baseUrl+this.configFile.contact_add_url, addContact, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteStaffStudentWithPromise(url):Promise<GetStudent[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteChapterWithPromise(url):Promise<GetChapter[]> {
        console.log("delete chapter url====== >"+url)
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    deleteDepartmentWithPromise(url):Promise<Department[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    deleteCourseWithPromise(url):Promise<Course> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteSubjectWithPromise(url):Promise<DataId> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteExamTypeWithPromise(url):Promise<DataId> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteSubjectTypeWithPromise(url):Promise<DataId> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    deleteFeesTypeWithPromise(url):Promise<DataId> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url,options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editSubjectTypeAddWithPromise(subjectedit:EditSubjectType): Promise<EditSubjectType> {
        var edit_subjecttype_url = this.baseUrl + this.configFile.edit_subject_type_url
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(edit_subjecttype_url, subjectedit, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editDepartmentWithPromise(depatmentEdit:AddDepartment,url:string): Promise<AddDepartment> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, depatmentEdit, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editChapterWithPromise(chapterEdit:EditChapterData,url:string): Promise<EditChapterData> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, chapterEdit, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editCourseWithPromise(courseEdit:EditCourse,url:string): Promise<EditCourse> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, courseEdit, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    editSubjectWithPromise(subjectEdit:EditSubject,url:string): Promise<EditSubject> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, subjectEdit, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editStaffWithPromise(editStaff:EditStaff,url:string): Promise<EditStaff> {
        console.log("Edit Staff url--"+url)
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, editStaff, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    editStudentWithPromise(editStudent:EditStudent,url:string): Promise<EditStudent> {
        console.log("EditStudent url--"+url)
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(url, editStudent, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    setAcadamicYearWithPromise(url):Promise<GetAcadamicYearData[]> {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(url, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    goToDeleteAcadamicYearWithPromise(url):Promise<GetAcadamicYearData[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    goToGetUserWithPromise(url):Promise<GetUserListParamData[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAcadamicYearWithPromise(url):Promise<GetAcadamicYearData[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAllDepartmentsWithPromise(url):Promise<Department[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAllVocabularyWithPromise(url):Promise<AddVocabulary[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getEventTypesWithPromise(url):Promise<GetEventType[]> {
        console.log("url for get Event type===="+url)
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getAllCourseByDepartmentWithPromise(url):Promise<GetCourse []> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getAllQuestionsWithPromise(getQuestion:GetQuestionParms):Promise<GetQuestionParms []> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        console.log("getQuestion list parmas"+JSON.stringify(getQuestion))
        return this.http.post(environment.baseUrl+this.configFile.getall_questions_by_user, getQuestion, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getExamTypeListWithPromise(url):Promise<GetExamType> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getSubjectTypesWithPromise(instituteId): Promise<AddSubjectType[]> {

        var subject_get_all_url=this.baseUrl+this.configFile.subject_get_all;
        subject_get_all_url=subject_get_all_url.replace('{instituteId}',instituteId);
        return this.http.get(subject_get_all_url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAllSubjectWithPromise(url):Promise<GetSubject[]> {
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAllCoursesWithPromise(courseGetUrl): Promise<Course[]> {
        console.log("courseGetUrl---------------->"+courseGetUrl)
        return this.http.get(courseGetUrl).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getAllChaptersWithPromise(chapterGetUrl): Promise<GetChapter[]> {
        console.log("chapterGetUrl---------------->"+chapterGetUrl)
        return this.http.get(chapterGetUrl).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    sendMessageWithPromise(sendDairy:SendDiary):Promise<SendDiary> {
        var send_diary_url = this.baseUrl + this.configFile.diary_reply;
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.put(send_diary_url, sendDairy, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }


    getAllExamsListWithPromise(getAllExam:GetAllExam): Promise<GetAllExam> {
        var get_all_exam_url = this.baseUrl + this.configFile.exam_get;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(get_all_exam_url, getAllExam, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getUserListWithPromise(userList:GetUserListParamData): Promise<GetUserListParamData> {
        var ins_admin_list_user_url= this.baseUrl+this.configFile.user_get;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        console.log("user list parmas"+JSON.stringify(userList))
        return this.http.post(ins_admin_list_user_url, userList, options).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    getDiaryListWithPromise(url):Promise<GetDiary[]> {
        this.showLoader();
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getFeesListWithPromise(url):Promise<GetFeesType[]> {
        this.showLoader();
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }


    getViewDiaryListWithPromise(url):Promise<GetDiary[]> {
        this.showLoader();
        return this.http.get(url).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }
    private extractData(res:Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorObservable(error:Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    private handleErrorPromise(error:Response | any) {
        console.error(error.message || error);
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return Promise.reject(error.message || error);
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        this.hideLoader();
    }

    private showLoader(): void {
        this.loaderService.show();
    }

    private hideLoader(): void {
        this.loaderService.hide();
    }
}