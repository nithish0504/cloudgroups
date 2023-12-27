export interface createGroupRequestModel {
    name: string
    description?: string
    members?: string[]
}


export interface deleteGroupRequestModel {
    groupId: string
}

export interface addGroupMembersRequestModel{
    groupId: string
    members: string[]
}