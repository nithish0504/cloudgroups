import { CommonResponseModel } from "src/models/response/common.res.model";
import * as express from "express";
import { UserModel } from "src/models/db-models/user.model";
import { IdsHelper } from "./ids.helper";
import { DbConfig } from "src/models/db-models/db-schema.model";
import { DbQueryService } from "src/services/dbServices";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Logger } from "./logger";
import { CommonUtils } from "./common-utils";
import { AuthModel } from "src/models/internal/auth.model";
import { GroupModel } from "src/models/db-models/group.model";
import { RoleTypes } from "src/models/internal/common.model";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.cognitoUserPoolId,
  tokenUse: "id",
  clientId: process.env.cognitoClientId,
});

const getAuthBody = async (req: express.Request): Promise<AuthModel | null> => {
  if (
    CommonUtils.isDefined(req.headers) &&
    CommonUtils.isDefined(req.headers["authorization"])
  ) {
    let token = req.headers["authorization"];
    let tokenVerificationResult = await verifyToken(token);
    if (tokenVerificationResult.isSuccess) {
      let payload = tokenVerificationResult.data;
      let userId: string = payload["custom:userId"];
      let projections = {
        _id: 0,
      };
      let userBody = await DbQueryService.findOneById<UserModel>(
        IdsHelper.toObjectId(userId),
        DbConfig.UserCollection,
        projections,
        true,
      );
      userBody._id = IdsHelper.toObjectId(userId);
      return {
        user: userBody,
        role: payload["custom:role"],
        accountId: payload["custom:accountId"],
      };
    }
    return null;
  }
  return null;
};

const verifyToken = async (token: any): Promise<CommonResponseModel<any>> => {
  try {
    const payload = await verifier.verify(token);
    return {
      isSuccess: true,
      data: payload,
    };
  } catch (error: any) {
    Logger.error(error, "Token not valid!");
    return {
      isSuccess: false,
      error: error,
    };
  }
};

const isAdmin = (authPayload: AuthModel): boolean => {
  return authPayload.role === RoleTypes.ADMIN;
}

const isGroupAdmin =async (groupId: string, userId: string) => {
  let group = await DbQueryService.findOneById<GroupModel>(IdsHelper.toObjectId(groupId), DbConfig.GroupCollection, {admins:1}, true);
  return group.admins.includes(userId);
}

const isGroupMember =async (groupId: string, userId: string) => {
  let group = await DbQueryService.findOneById<GroupModel>(IdsHelper.toObjectId(groupId), DbConfig.GroupCollection, {members:1}, true);
  return group.admins.includes(userId);
}

const isGroupAdminOrMember =async (groupId: string, userId: string) => {
  let group = await DbQueryService.findOneById<GroupModel>(IdsHelper.toObjectId(groupId), DbConfig.GroupCollection, {admins:1,members:1}, true);
  return group.admins.includes(userId) || group.members.includes(userId);
}

const isMessageSender = async (messageId: string, userId: string) => {
  let message = await DbQueryService.findOneById<any>(IdsHelper.toObjectId(messageId), DbConfig.MessageCollection, {sender:1}, true);
  return message.sender === userId;
}

export const AuthHelper = {
  getAuthBody,
  isAdmin,
  isGroupAdmin,
  isGroupMember,
  isGroupAdminOrMember,
  isMessageSender
};
