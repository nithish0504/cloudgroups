import * as express from "express";
import { AuthHelper } from "src/helpers/auth-helper";
import { CommonUtils } from "src/helpers/common-utils";
import { Logger } from "src/helpers/logger";
import { Validator } from "src/helpers/validator";
import { AuthModel } from "src/models/internal/auth.model";
import { createGroupRequestModel, deleteGroupRequestModel, addGroupMembersRequestModel } from "src/models/request/group.req.model";
import { ApiResponse } from "src/models/response/common.res.model";
import { ResponseTemplate } from "src/models/response/response.template.model";
import { GroupService } from "src/services/group.service";
import { GroupSchema } from "src/validations/group.schema";


const createGroup = async (req:express.Request) => {
    let authPayload: AuthModel = await AuthHelper.getAuthBody(req)

    if (CommonUtils.isDefined(authPayload)) {
        const reqbody = await Validator.validate<createGroupRequestModel>(req.body,GroupSchema.createGroupRequestSchema())
        const createGroupResponse = await GroupService.createGroup(reqbody,authPayload.user._id)
        if(createGroupResponse.isSuccess){
            Logger.info("Successfully created the group")
            return ResponseTemplate.SuccessResponse("Successfully created the group",createGroupResponse.data)
        }
        return ResponseTemplate.InternalError("Error in creating group","createGroup","createGroup")
    }else{
        Logger.info("You don't have permission to create group")
        return ResponseTemplate.AuthFailureResponse("You don't have permission to create group")
    }
}

const deleteGroup = async (req:express.Request) => {
    let authPayload: AuthModel = await AuthHelper.getAuthBody(req)
    let pathParams = await Validator.validate<deleteGroupRequestModel>(req.params,GroupSchema.deleteGroupRequestSchema())

    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdmin(pathParams.groupId,authPayload.user._id.toString())) {
        const deleteGroupResponse = await GroupService.deleteGroup(pathParams.groupId,authPayload.user._id)
        if(deleteGroupResponse.isSuccess){
            Logger.info("Successfully deleted the group")
            return ResponseTemplate.SuccessResponse("Successfully deleted the group",deleteGroupResponse.data)
        }
        return ResponseTemplate.InternalError("Error in deleting group","deleteGroup","deleteGroup")
    }else{
        Logger.info("You don't have permission to delete group")
        return ResponseTemplate.AuthFailureResponse("You don't have permission to delete group")
    }
}


const addMembers = async (req:express.Request) => {
    let authPayload: AuthModel = await AuthHelper.getAuthBody(req)
    const reqbody = await Validator.validate<addGroupMembersRequestModel>(req.body,GroupSchema.addGroupMembersRequestSchema())

    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdmin(reqbody.groupId,authPayload.user._id.toString())) {
        const addMembersResponse = await GroupService.addMembers(reqbody.groupId,reqbody.members,authPayload.user._id)
        if(addMembersResponse.isSuccess){
            Logger.info("Successfully added members to the group")
            return ResponseTemplate.SuccessResponse("Successfully added members to the group",addMembersResponse.data)
        }
        return ResponseTemplate.InternalError("Error in adding members to the group","addMembers","addMembers")
    }else{
        Logger.info("You don't have permission to add members to the group")
        return ResponseTemplate.AuthFailureResponse("You don't have permission to add members to the group")
    }
}

const removeMembers = async (req:express.Request) => {
    let authPayload: AuthModel = await AuthHelper.getAuthBody(req)
    const reqbody = await Validator.validate<addGroupMembersRequestModel>(req.body,GroupSchema.addGroupMembersRequestSchema())

    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdmin(reqbody.groupId,authPayload.user._id.toString())) {
        const removeMembersResponse = await GroupService.removeMembers(reqbody.groupId,reqbody.members,authPayload.user._id)
        if(removeMembersResponse.isSuccess){
            Logger.info("Successfully removed members from the group")
            return ResponseTemplate.SuccessResponse("Successfully removed members from the group",removeMembersResponse.data)
        }
        return ResponseTemplate.InternalError("Error in removing members from the group","removeMembers","removeMembers")
    }else{
        Logger.info("You don't have permission to remove members from the group")
        return ResponseTemplate.AuthFailureResponse("You don't have permission to remove members from the group")
    }
}

const getGroups =async (req:express.Request): Promise<ApiResponse<any>> => {
    let authPayload: AuthModel = await AuthHelper.getAuthBody(req)
    if (CommonUtils.isDefined(authPayload)) {
        const getGroupsResponse = await GroupService.getGroups(authPayload.user._id.toString(),req.query?.search?.toString())
        if (getGroupsResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully fetched groups",getGroupsResponse.data)
        }
        return ResponseTemplate.InternalError("Error in fetching groups","getGroups","getGroups")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to fetch groups")
}

export const GroupApi = {
    getGroups,
    createGroup,
    deleteGroup,
    addMembers,
    removeMembers
} 