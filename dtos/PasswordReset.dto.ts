export interface PasswordResetDTO {
    email: string;
    password: string;
    code: number;
    passwordConfirmation: string;
}