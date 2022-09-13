import UserModel from "../models/User.model";

export default interface RegisterSuccessDTO{
    readonly message: string;
    readonly data: UserModel;
}