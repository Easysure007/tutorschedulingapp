export default interface StudentModel {
    _id: string;
    registrationNumber: string;
    name: string;
    email: string;
    role: string;
    password: string;
    groupId?: string; //What group is a student assigned to?
}