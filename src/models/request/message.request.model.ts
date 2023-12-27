export interface addMessageRequestModel{
    groupId: string
    message: string
    referMessageId?: string
}


export interface editMessageRequestModel{
    groupId: string
    messageId: string
    message: string
}

export interface deleteMessageRequestModel{
    groupId: string
    messageId: string
}

export interface getMessagesRequestModel{
    groupId: string
    pageNo: number
    perPage: number
}

export interface likeMessageRequestModel{
    groupId: string
    messageId: string
}