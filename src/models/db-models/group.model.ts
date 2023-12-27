import { ObjectId } from "mongodb";

export interface GroupModel {
    _id: ObjectId | null
    name: string
    description: string
    members: string[]
    admins: string[]
    createdAt: number
    updatedAt: number
}