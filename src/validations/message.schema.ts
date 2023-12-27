import Joi from "joi";


const addMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        message: Joi.string().required().trim(),
        referMessageId: Joi.string().trim().optional().allow(null).allow(""),
    })

const editMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        message: Joi.string().required().trim(),
    })

const editMessageRequestParamSchema = () =>
    Joi.object().keys({
        messageId: Joi.string().required().trim()
    })

const deleteMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        messageId: Joi.string().required().trim(),
    })

const getMessagesRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        pageNo: Joi.number().required(),
        perPage: Joi.number().required(),
    })

const likeMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        messageId: Joi.string().required().trim()
    })

export const MessageSchema = {
    addMessageRequestSchema,
    editMessageRequestSchema,
    editMessageRequestParamSchema,
    deleteMessageRequestSchema,
    getMessagesRequestSchema,
    likeMessageRequestSchema
}