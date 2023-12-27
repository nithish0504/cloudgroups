"use strict";

import * as express from "express";
import { ApiResponse } from "src/models/response/common.res.model";
import { ResponseTemplate } from "src/models/response/response.template.model";
import { Logger } from "src/helpers/logger";
import { AuthHelper } from "src/helpers/auth-helper";
import { CommonUtils } from "src/helpers/common-utils";
import { UserService } from "src/services/user.service";
import { editUserParamsModel, editUserRequestModel } from "src/models/request/user.req.model";
import { Validator } from "src/helpers/validator";
import { UserSchema } from "src/validations/user.schema";

const signupUser = async (req: express.Request): Promise<ApiResponse<any>> => {
  Logger.info(req.body);
  return ResponseTemplate.SuccessResponse(
    "Hello from signup api",
    "hello data",
  );
};

const logoutUser = async (req: express.Request): Promise<ApiResponse<any>> => {
  Logger.info(req.body);
  return ResponseTemplate.SuccessResponse(
    "Hello from signup api",
    "hello data",
  );
};

const getUsers = async (req: express.Request): Promise<ApiResponse<any>> => {
  let authPayload = await AuthHelper.getAuthBody(req);
  if (CommonUtils.isDefined(authPayload) && AuthHelper.isAdmin(authPayload)) {
    let users = await UserService.getUsers(req.query?.search?.toString());
    return ResponseTemplate.SuccessResponse("Successfully fetched users", users);
  }
  return ResponseTemplate.AuthFailureResponse("You don't have permissions to fetch users");
}

const editUser = async (req: express.Request): Promise<ApiResponse<any>> => {
  let authPayload = await AuthHelper.getAuthBody(req);
  let pathParams = await Validator.validate<editUserParamsModel>(req.params, UserSchema.editUserParamSchema());
  let reqbody = await Validator.validate<editUserRequestModel>(req.body, UserSchema.editUserRequestSchema());
  if (CommonUtils.isDefined(authPayload) && AuthHelper.isAdmin(authPayload)) {
    const editUserResult = await UserService.editUser(reqbody,pathParams.userId);
    if (editUserResult.isSuccess) {
      return ResponseTemplate.SuccessResponse("Successfully edited user", editUserResult.data);
    }
    return ResponseTemplate.InternalError("Error in editing user", "editUser", "editUser");
  }
  return ResponseTemplate.AuthFailureResponse("You don't have permissions to edit user");
}

const deleteUser = async (req: express.Request): Promise<ApiResponse<any>> => {
  let authPayload = await AuthHelper.getAuthBody(req);
  let pathParams = await Validator.validate<editUserParamsModel>(req.params, UserSchema.editUserParamSchema());
  if (CommonUtils.isDefined(authPayload) && AuthHelper.isAdmin(authPayload)) {
    const deleteUserResult = await UserService.deleteUser(pathParams.userId);
    if (deleteUserResult.isSuccess) {
      return ResponseTemplate.SuccessResponse("Successfully deleted user", deleteUserResult.data);
    }
    return ResponseTemplate.InternalError("Error in deleting user", "deleteUser", "deleteUser");
  }
  return ResponseTemplate.AuthFailureResponse("You don't have permissions to delete user");
}

export const UserApi = {
  signupUser,
  logoutUser,
  getUsers,
  editUser,
  deleteUser
};
