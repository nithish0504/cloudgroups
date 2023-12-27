import { CommonUtils } from "src/helpers/common-utils";
import { IdsHelper } from "src/helpers/ids.helper";
import { GroupModel } from "src/models/db-models/group.model";
import { createGroupRequestModel } from "src/models/request/group.req.model";
import { CommonResponseModel } from "src/models/response/common.res.model";
import { DbQueryService } from "./dbServices";
import { DbConfig } from "src/models/db-models/db-schema.model";
import { ObjectId } from "mongodb";
import { UserService } from "./user.service";
import { Logger } from "src/helpers/logger";

const createGroup =async (groupBody: createGroupRequestModel,userId: ObjectId): Promise<CommonResponseModel<any>> => {

    let group: GroupModel = {
        _id:null,
        name: groupBody.name,
        description: groupBody.description,
        members: groupBody.members.length > 0 ? groupBody.members : [userId.toString()],
        admins: [userId.toString()],
        createdAt: CommonUtils.getSecondsSinceEpoch(),
        updatedAt: CommonUtils.getSecondsSinceEpoch(),
    }

    const createGroupResult = await DbQueryService.insertOne(group, DbConfig.GroupCollection)
    if (createGroupResult.acknowledged) {
        return {
            isSuccess: true,
            data: createGroupResult.insertedId,
        }
    }
    return {
        isSuccess: false,
        error: "Error in creating group",
        message: "Error in creating group",
    }
}

const deleteGroup = async (groupId: string, userId: ObjectId): Promise<CommonResponseModel<any>> => {
    const conditions = {
        _id: new ObjectId(groupId),
        admins: { $in: [userId] }
    }
    const deleteGroupResult = await DbQueryService.deleteOneByQuery(conditions, DbConfig.GroupCollection)
    if (deleteGroupResult.acknowledged) {
        return {
            isSuccess: true,
            data: deleteGroupResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in deleting group",
        message: "Error in deleting group",
    }
}

const addMembers = async (groupId: string, members: string[], userId:ObjectId) => {
    const conditions = {
        _id: new ObjectId(groupId),
        admins: { $in: [userId] }
    }
    const updateGroupResult = await DbQueryService.updateOneByQuery(conditions, { $push: { members: IdsHelper.toObjectIds(members) } }, DbConfig.GroupCollection)
    if (updateGroupResult.acknowledged) {
        return {
            isSuccess: true,
            data: updateGroupResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in updating group",
        message: "Error in updating group",
    }
}

const removeMembers = async (groupId: string, members: string[], userId:ObjectId) => {
    const conditions = {
        _id: new ObjectId(groupId),
        admins: { $in: [userId] }
    }
    const updateGroupResult = await DbQueryService.updateOneByQuery(conditions, { $pull: { members: IdsHelper.toObjectIds(members) } }, DbConfig.GroupCollection)
    if (updateGroupResult.acknowledged) {
        return {
            isSuccess: true,
            data: updateGroupResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in updating group",
        message: "Error in updating group",
    }
}

const getGroups = async (userId: string, search: string) => {
    let conditions: any = {
        members: { $in: [userId] } 
    }
    // Logger.debug(search)
    if(CommonUtils.isDefined(search)){
        conditions = {
            ...conditions,
            $or: [
                { name: { $regex: search, $options: 'i' } },
            ]
        }
    }
    let projections = {
        _id: 1,
        name: 1,
        description: 1,
        members: 1,
        admins: 1,
    }
    const groups = await DbQueryService.findManyByQuery<GroupModel>(conditions, DbConfig.GroupCollection, projections)
    for(let group of groups){
        group.members = await UserService.getUserNamesByIds(group.members)
        group.admins = await UserService.getUserNamesByIds(group.admins)
    }
    return {
        isSuccess:true,
        data:groups
    }
}



export const GroupService = {
    getGroups,
    createGroup,
    deleteGroup,
    addMembers,
    removeMembers
}