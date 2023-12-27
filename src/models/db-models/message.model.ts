import { ObjectId } from "mongodb";

export interface MessageModel {
    _id: ObjectId
    message: string
    senderId: string
    groupId: string
    likes: string[]
    referMessageId?: string
    createdAt: number
    updatedAt: number
}