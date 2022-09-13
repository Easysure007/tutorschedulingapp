export default interface PasswordResetModel {
    _id: string;
    email: string;
    code: string;
    isValid: boolean;
    expires?: Date; //What group is a student assigned to?
}