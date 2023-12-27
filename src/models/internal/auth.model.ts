import { UserModel } from "../db-models/user.model";

export interface AuthModel {
  user: UserModel;
  role: string;
  accountId: string;
}
