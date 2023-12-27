import { GenderTypes } from './../models/internal/common.model';
import Joi from "joi"


const editUserRequestSchema = () =>
    Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        address: Joi.object().optional().allow(null),
        gender: Joi.string().valid(...Object.values(GenderTypes)).optional(),
        age: Joi.number().optional(),
        SSN: Joi.string().optional(),
        phone: Joi.string().required(),
    })

const editUserParamSchema = () =>
    Joi.object().keys({
        userId: Joi.string().required().trim(),
    })


export const UserSchema = {
    editUserRequestSchema,
    editUserParamSchema
}