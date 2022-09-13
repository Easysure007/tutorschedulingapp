export interface RegistrationDTO {
    name: string;
    email: string;
    role: string;
    password: string;
    passwordConfirmation: string;
    isAnonymous: boolean;
}