export default interface UserModel {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly role: string;
    readonly status: string;
    readonly isAnonymous: boolean;
}