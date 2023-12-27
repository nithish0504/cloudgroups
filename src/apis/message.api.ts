import { editMessageRequestParamModel } from './../models/request/message.request.model';
import { ApiResponse } from 'src/models/response/common.res.model';
import { AuthHelper } from 'src/helpers/auth-helper';
import * as express from 'express'
import { CommonUtils } from 'src/helpers/common-utils';
import { ResponseTemplate } from 'src/models/response/response.template.model';
import { Validator } from 'src/helpers/validator';
import { addMessageRequestModel, deleteMessageRequestModel, editMessageRequestModel, getMessagesRequestModel, likeMessageRequestModel } from 'src/models/request/message.request.model';
import { MessageSchema } from 'src/validations/message.schema';
import { MessageService } from 'src/services/message.service';
import { Logger } from 'src/helpers/logger';


const addMessage =async (req:express.Request): Promise<ApiResponse<any>> => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<addMessageRequestModel>(req.body,MessageSchema.addMessageRequestSchema())

    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdminOrMember(reqbody.groupId,authPayload.user._id.toString())) {
        const addMessageResult = await MessageService.addMessage(reqbody,authPayload.user._id)
        if (addMessageResult.isSuccess) {
            Logger.info("Successfully added message")
            return ResponseTemplate.SuccessResponse("Successfully added message",addMessageResult.data)
        }
        return ResponseTemplate.InternalError("Error in adding message","addMessage","addMessage")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to add message")   
}


const editMessage =async (req:express.Request): Promise<ApiResponse<any>>  => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<editMessageRequestModel>(req.body,MessageSchema.editMessageRequestSchema())
    let pathParams = await Validator.validate<editMessageRequestParamModel>(req.params,MessageSchema.editMessageRequestParamSchema())
    if (CommonUtils.isDefined(authPayload) && AuthHelper.isMessageSender(pathParams.messageId,authPayload.user._id.toString())) {
        const editMessageResponse = await MessageService.editMessage(reqbody,pathParams.messageId)
        if (editMessageResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully edited message",editMessageResponse.data)
        }
        return ResponseTemplate.InternalError("Error in editing message","editMessage","editMessage")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to edit message")
}

const deleteMessage =async (req:express.Request): Promise<ApiResponse<any>>  => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<deleteMessageRequestModel>(req.body,MessageSchema.deleteMessageRequestSchema())
    if (CommonUtils.isDefined(authPayload) && (AuthHelper.isMessageSender(reqbody.messageId,authPayload.user._id.toString()) || AuthHelper.isGroupAdmin(reqbody.groupId, authPayload.user._id.toString()))) {
        const deleteMessageResponse = await MessageService.deleteMessage(reqbody.messageId)
        if (deleteMessageResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully deleted message",deleteMessageResponse.data)
        }
        return ResponseTemplate.InternalError("Error in deleting message","deleteMessage","deleteMessage")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to delete message")
}

const getMessages =async (req:express.Request): Promise<ApiResponse<any>>  => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<getMessagesRequestModel>(req.params,MessageSchema.getMessagesRequestSchema())
    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdminOrMember(reqbody.groupId,authPayload.user._id.toString())) {
        const getMessagesResponse = await MessageService.getMessages(reqbody.groupId,authPayload.user.createdAt,reqbody.pageNo,reqbody.perPage)
        if (getMessagesResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully fetched messages",getMessagesResponse.data)
        }
        return ResponseTemplate.InternalError("Error in fetching messages","getMessages","getMessages")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to fetch messages")
}

const likeMessage =async (req:express.Request): Promise<ApiResponse<any>>  => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<likeMessageRequestModel>(req.body,MessageSchema.likeMessageRequestSchema())
    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdminOrMember(reqbody.groupId,authPayload.user._id.toString())) {
        const likeMessageResponse = await MessageService.likeMessage(reqbody.messageId,authPayload.user._id.toString())
        if (likeMessageResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully liked message",likeMessageResponse.data)
        }
        return ResponseTemplate.InternalError("Error in liking message","likeMessage","likeMessage")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to like message")
}

const unlikeMessage =async (req:express.Request): Promise<ApiResponse<any>>  => {
    let authPayload = await AuthHelper.getAuthBody(req);
    let reqbody = await Validator.validate<likeMessageRequestModel>(req.body,MessageSchema.likeMessageRequestSchema())
    if (CommonUtils.isDefined(authPayload) && AuthHelper.isGroupAdminOrMember(reqbody.groupId,authPayload.user._id.toString())) {
        const unlikeMessageResponse = await MessageService.unlikeMessage(reqbody.messageId,authPayload.user._id.toString())
        if (unlikeMessageResponse.isSuccess) {
            return ResponseTemplate.SuccessResponse("Successfully unlike message",unlikeMessageResponse.data)
        }
        return ResponseTemplate.InternalError("Error in unliking message","unlikeMessage","unlikeMessage")
    }
    return ResponseTemplate.AuthFailureResponse("You don't have permissions to unlike message")
}

export const MessageApi = {
    addMessage,
    editMessage,
    deleteMessage,
    getMessages,
    likeMessage,
    unlikeMessage,
}