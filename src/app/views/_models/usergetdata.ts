/**
 * Created by priya on 16/07/18.
 */
export  class UserGetData {
    userId: number;
    userName: string;
    password: string;
    fName: string;
    lName: string;
    gender: number;
    emailId: string;
    birhDate: string;
    phone: string;
    profileImage: string;
    dateCreated: string;
    dateModified: string;
    appVersion: string;
    userStatus: string;
    location: string;
    userType:number;
    instituteId: number;
    countryCode: string;
    dialCode: string;
    latitude: string;
    longitude: string;
    latitudeRad: string;
    longitudeRad: string;
    addedBy :number;
    visibility:number;
    userMappingId:number;
    address:string;
    martialStatus:string;
    qualification:string;
    phoneVerifiedStatus:number;
    emailVerifiedStatus:number;
    lgUserMappingEntity:lgUserMappingEntity;
    displayName :string;

}

export  class lgUserMappingEntity
{
    userMappingId:number;
    userId:number;
    subjectId:number;
    courseId:number;
    departmentId:number;
    instituteId:number;
    userTypeId:number;
    designationId:number;
    academicYearID:number;
    lgSubjectEntity:JSON;
    lgAcademicYearEntity:JSON;
    lgcourseinfoEntity:JSON;
    lgdepartmentinfoEntity:lgdepartmentinfoEntity;
    lgdesignationEntity:lgdesignationEntity;
    lgInstituteEntity:lgInstituteEntity;
}

export  class lgInstituteEntity {
    currentAcademicYearStatus:number;
    dateCreated:number;
    dateModified:number;
    insAddress:number;
    insCode:number;
    insContactNumber:number;
    insEmailId:string;
    insLogoUrl:string;
    insName:string;
    instituteCategory:number;
    instituteId:number;
    instituteType:number;
    insWebsiteUrl:string;
    statusId:number;

}

export  class lgdesignationEntity {
    designationId:number;
    designation:string;
    instituteId:number;
}

export  class lgdepartmentinfoEntity {
    instituteId:number;
    departmentId:number;
    name:string;
    departmentImage:string;
    description:string;
    academicYearId:number;
    orderId:number;
    lginstituteinfoEntity:'';
    statusId:number;
}

export class lgAcademicYearEntity{
    instituteId:number;
    academicYear:string;
    academicYearId:string;
    endDate:string;
    isCurrent:string;
    startDate:number;

}