import { ObjectId } from "mongodb";
import { AddressModel, GenderTypes, RoleTypes } from "../internal/common.model";

export interface UserModel {
  _id: ObjectId | null;
  name: string;
  userName: string;
  email: string;
  phone?: string;
  address?: AddressModel;
  gender?: GenderTypes;
  role: RoleTypes;
  age: number;
  SSN: string;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
}
