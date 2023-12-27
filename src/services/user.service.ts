import { IdsHelper } from 'src/helpers/ids.helper';
import { DbQueryService } from './dbServices';
import { DbConfig } from 'src/models/db-models/db-schema.model';
import { UserModel } from 'src/models/db-models/user.model';
import { CommonResponseModel } from 'src/models/response/common.res.model';
import { CommonUtils } from 'src/helpers/common-utils';



const getUserNamesByIds =async (ids:string[]) => {
    const conditions = {
        _id:{
            $in: IdsHelper.toObjectIds(ids)
        }
    }
    const projection = {
        name:1
    }
    const users = await DbQueryService.findManyByQuery<UserModel[]>(conditions, DbConfig.UserCollection, projection)
    return users.map((user:UserModel) => user.name)
}


const getUsers = async (search:string):Promise<CommonResponseModel<any>> => {
    let conditions={}
    if (CommonUtils.isDefined(search)) {
        conditions = {
            $or:[
                {name:{$regex:search,$options:'i'}},
                {email:{$regex:search,$options:'i'}}
            ]
        }
    }
    const projection = {
        _id:1,
        name:1
    }
    const users = await DbQueryService.findManyByQuery<UserModel[]>(conditions, DbConfig.UserCollection, projection)
    return users.map((user:UserModel) =>{ 
        return {
            id:user._id.toString(),
            name:user.name
        }
    })
}

const editUser =async (userbody:UserModel,userId: string): Promise<CommonResponseModel<any>> => {
    let update = {
        $set:userbody
    }
    let UpdateResult = await DbQueryService.updateOneById(IdsHelper.toObjectId(userId), update, DbConfig.UserCollection)
    if(UpdateResult.modifiedCount > 0){
        return {
            isSuccess: true,
            message: "User updated successfully",
        }
    }
    return {
        isSuccess: false,
        error: "Error in updating user",
        message: "Error in updating user",
    }
}

const deleteUser = async (userId: string): Promise<CommonResponseModel<any>> => {
    let DeleteResult = await DbQueryService.deleteOneById(IdsHelper.toObjectId(userId), DbConfig.UserCollection)
    if (DeleteResult.acknowledged) {
        return {
            isSuccess: true,
            data: DeleteResult,
        }
    }
    return {
        isSuccess: false,
        error: "Error in deleting user",
        message: "Error in deleting user",
    }
}

export const UserService = {
    getUserNamesByIds,
    getUsers,
    editUser,
    deleteUser
}