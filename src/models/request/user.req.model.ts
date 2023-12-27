import { UserModel } from "../db-models/user.model";

export interface editUserRequestModel extends UserModel{}

export interface editUserParamsModel{
    userId:string
}