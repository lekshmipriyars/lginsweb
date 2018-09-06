/**
 * Created by priya on 11/07/18.
 */

export  class UserData {
    userId: number;
    userName: string;
    password: string;
    fName: string;
    lName: string;
    gender: string;
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
    lgdepartmentinfoEntity:JSON;
    lgdesignationEntity:JSON;
    lgInstituteEntity:lgInstituteEntity;
}

export  class lgInstituteEntity
{
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