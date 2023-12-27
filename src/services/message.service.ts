import { ObjectId } from "mongodb";
import { CommonUtils } from "src/helpers/common-utils";
import { MessageModel } from "src/models/db-models/message.model";
import { DbQueryService } from "./dbServices";
import { DbConfig } from "src/models/db-models/db-schema.model";
import { CommonResponseModel } from "src/models/response/common.res.model";
import { IdsHelper } from "src/helpers/ids.helper";



const addMessage =async (messageBody:any, userId: ObjectId) => {
    let message: MessageModel = {
        _id: new ObjectId(),
        message: messageBody.message,
        senderId: userId.toString(),
        groupId: messageBody.groupId,
        likes: [],
        createdAt: CommonUtils.getSecondsSinceEpoch(),
        updatedAt: CommonUtils.getSecondsSinceEpoch(),
    }
    if(CommonUtils.isDefined(messageBody.referMessageId)){
        message["referMessageId"] = messageBody.referMessageId.toString();
    }
    const createMessageResult = await DbQueryService.insertOne(message, DbConfig.MessageCollection)
    if (createMessageResult.acknowledged) {
        return {
            isSuccess: true,
            data: createMessageResult.insertedId,
        }
    }
    return {
        isSuccess: false,
        error: "Error in creating message",
        message: "Error in creating message",
    }
}


const editMessage = async (messageBody:any, messageId: string): Promise<CommonResponseModel<any>> => {
    let update = {
        $set:{
            message: messageBody.message,
            updatedAt: CommonUtils.getSecondsSinceEpoch(),
        }
    }
    let UpdateResult = await DbQueryService.updateOneById(IdsHelper.toObjectId(messageId), update, DbConfig.MessageCollection)
    if (UpdateResult.acknowledged) {
        return {
            isSuccess: true,
            data: UpdateResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in updating message",
        message: "Error in updating message",
    }
}

const deleteMessage = async (messageId: string): Promise<CommonResponseModel<any>> => {
    let DeleteResult = await DbQueryService.deleteOneById(IdsHelper.toObjectId(messageId), DbConfig.MessageCollection)
    if (DeleteResult.acknowledged) {
        return {
            isSuccess: true,
            data: DeleteResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in deleting message",
        message: "Error in deleting message",
    }
}

const getMessages = async (groupId: string, fromEpoch: number, pageNo: number, perPage: number) => {
    let conditions = {
        groupId: groupId,
        createdAt: { $gte: fromEpoch }
    }
    const projections = {
        _id:1,
        message: 1,
        likes: 1,
        senderId: 1,
        createdAt: 1,
    }
    const pipeline = [
        { $match: conditions },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                metadata: [{ $count: "total" }, {$addFields: { page: pageNo } }],
                data:[{$skip: (pageNo - 1)* perPage}, {$limit:perPage}, {$project:projections}]
            },
        },
    ]
    const options = {
        allowDiskUse: true,
    }
    const messagesResult = await DbQueryService.aggregate(pipeline, DbConfig.MessageCollection, options)
    if (messagesResult.length > 0) {
        return {
            isSuccess: true,
            data: messagesResult[0],
        }
    }
    return {
        isSuccess: false,
        error: "Error in getting messages",
        message: "Error in getting messages",
    }
}

const likeMessage = async (messageId: string, userId: string) => {
    let update = {
        $push:{
            likes: userId,
        },
        $set:{
            updatedAt: CommonUtils.getSecondsSinceEpoch(),
        }
    }
    let UpdateResult = await DbQueryService.updateOneById(IdsHelper.toObjectId(messageId), update, DbConfig.MessageCollection)
    if (UpdateResult.acknowledged) {
        return {
            isSuccess: true,
            data: UpdateResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in liking message",
        message: "Error in liking message",
    }
}

const unlikeMessage = async (messageId: string, userId: string) => {
    let update = {
        $pull:{
            likes: userId,
        },
        $set:{
            updatedAt: CommonUtils.getSecondsSinceEpoch(),
        }
    }
    let UpdateResult = await DbQueryService.updateOneById(IdsHelper.toObjectId(messageId), update, DbConfig.MessageCollection)
    if (UpdateResult.acknowledged) {
        return {
            isSuccess: true,
            data: UpdateResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in unliking message",
        message: "Error in unliking message",
    }
}

export const MessageService = {
    addMessage,
    editMessage,
    deleteMessage,
    getMessages,
    likeMessage,
    unlikeMessage
}