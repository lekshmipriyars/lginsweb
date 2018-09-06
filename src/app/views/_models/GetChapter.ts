/**
 * Created by priya on 22/08/18.
 */
export  class GetChapter
{
    chapterId:number;
    chapterImage:string;
    chapterTag:string;
    chapterTitle:string;
    dateCreated:number;
    dateModified:number;
    description:string;
    lgSubjectEntity:lgSubjectEntity;
    orderId:number;
    practiceQuestionCount:number;
    status:number;
    subjectId:number;
    testQuestionCount:number;

}

export class lgSubjectEntity
{
    courseId:number;
    description:string;
    image:string;
    lgcourseinfoEntity:lgcourseinfoEntity;
    lgSemesterEntity:JSON;
    lgstatusEntity:JSON;
    lgSubjectTypeEntity:JSON;
    maxMarks:number;
    name:number;
    orderId:number;
    passingMarks:number;
    practiceQuestionCount:number;
    semesterId:number;
    statusId:number;
    subjectId:number;
    subjectTag:string;
    subjectTypeId:number;
    testQuestionCount:number;

}

export class lgcourseinfoEntity
{
    courseId:number;
    courseImage:string;
    courseTag:string;
    departmentId:number;
    description:string;
    lgdepartmentinfoEntity:lgdepartmentinfoEntity;
    mediumTypeId:number;
    name:string;
    orderId:number;
    practiceQuestionCount:number;
    statusId:number;
    testQuestionCount:number;

}

export class lgdepartmentinfoEntity
{
    departmentId:number;
    departmentImage:string;
    description:string;
    instituteId:number;
    lginstituteinfoEntity:JSON;
    name:string;
    orderId:number;
    statusId:number;
}