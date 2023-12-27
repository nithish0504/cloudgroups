import Joi from "joi";

const createGroupRequestSchema = () =>
  Joi.object().keys({
    name: Joi.string().required().trim(),
    description: Joi.string().optional().allow(null).allow("").default("Group description"),
    members: Joi.array().items(Joi.string().optional()).optional().default([]),
  });

const deleteGroupRequestSchema = () =>
  Joi.object().keys({
    groupId: Joi.string().required().trim(),
  })

const addGroupMembersRequestSchema = () =>
  Joi.object().keys({
    groupId: Joi.string().required().trim(),
    members: Joi.array().items(Joi.string().optional()).min(1),
  })

export const GroupSchema = {
    createGroupRequestSchema,
    deleteGroupRequestSchema,
    addGroupMembersRequestSchema
};
