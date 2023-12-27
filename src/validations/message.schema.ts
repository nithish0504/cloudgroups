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
        messageId: Joi.string().required().trim(),
        message: Joi.string().required().trim(),
    })

const deleteMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        messageId: Joi.string().required().trim(),
    })

const getMessagesRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
    })

const likeMessageRequestSchema = () =>
    Joi.object().keys({
        groupId: Joi.string().required().trim(),
        messageId: Joi.string().required().trim()
    })

export const MessageSchema = {
    addMessageRequestSchema,
    editMessageRequestSchema,
    deleteMessageRequestSchema,
    getMessagesRequestSchema,
    likeMessageRequestSchema
}