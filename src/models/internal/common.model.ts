export enum GenderTypes {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface AddressModel {
  street: string;
  city: string;
  pincode: string;
  country: string;
}

export enum RoleTypes {
  ADMIN = "admin",
  USER = "user",
}


export enum StatusTypes {
  INITIATED = "initiated",
  IN_PROCESS = "in_process",
  SUCCESS = "success",
  FAILURE = "failure",
}

export enum VerificationStatusTypes {
  INITIATED = "initiated",
  IN_PROCESS = "in_process",
  SUCCESS = "success",
  FAILURE = "failure",
}
