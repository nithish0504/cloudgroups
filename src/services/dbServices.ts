import { MongoClientService } from "../config/db";
import {
  InsertOneResult,
  InsertManyResult,
  UpdateResult,
  ObjectId,
  DeleteResult,
  WithId,
  AggregateOptions,
  UpdateOptions,
} from "mongodb";
import { CommonUtils } from "src/helpers/common-utils";
import { IdsHelper } from "src/helpers/ids.helper";

async function insertOne<T extends { _id: any }>(
  data: any,
  collectionName: string,
): Promise<InsertOneResult<T>> {
  const db = await MongoClientService.getDb();
  let collection = db.collection<T>(collectionName);
  return collection.insertOne(data, { writeConcern: { w: 1 } });
}

async function insertMany<T extends { _id: any }>(
  data: any[],
  collectionName: string,
): Promise<InsertManyResult<T>> {
  const db = await MongoClientService.getDb();
  return db
    .collection<T>(collectionName)
    .insertMany(data, { writeConcern: { w: 1 } });
}

async function findOneById<T>(
  id: string | ObjectId,
  CollectionName: string,
  projection: any,
  skipIdConversion = false,
): Promise<WithId<T>> {
  let condition = {
    _id: skipIdConversion ? id : IdsHelper.toObjectId(id),
  };
  return findOneByQuery(condition, CollectionName, projection);
}

async function findOneByQuery<T>(
  condition: any,
  collectionName: string,
  projection: any,
): Promise<WithId<T | any>> {
  const db = await MongoClientService.getDb();
  let options = {
    projection: projection,
  };
  return db.collection(collectionName).findOne(condition, options);
}

async function findManyByQuery<T>(
  condition: any,
  collectionName: string,
  projection: any,
): Promise<WithId<T | any>> {
  const db = await MongoClientService.getDb();
  let options = {
    projection: projection,
  };
  return db.collection(collectionName).find(condition, options).toArray();
}

async function updateOneById(
  id: string | ObjectId,
  update: any,
  collectionName: string,
  skipIdConversion = false,
): Promise<UpdateResult> {
  const conditions = {
    _id: skipIdConversion ? id : IdsHelper.toObjectId(id),
  };
  return updateOneByQuery(conditions, update, collectionName);
}

async function updateOneByQuery(
  conditions: any,
  update: any,
  collectionName: string,
  options?:UpdateOptions
): Promise<UpdateResult> {
  if (!CommonUtils.isDefined(options)) {
    options={}
  }
  const db = await MongoClientService.getDb();
  return db.collection(collectionName).updateOne(conditions, update,options);
}

async function aggregate<T>(
  pipeline: any,
  collectionName: string,
  options?: AggregateOptions,
): Promise<T[] | any[]> {
  const db = await MongoClientService.getDb();
  return db.collection(collectionName).aggregate(pipeline, options).toArray();
}

async function deleteOneById(
  id: string | ObjectId,
  collectionName: string,
  skipIdConversion = false,
): Promise<DeleteResult> {
  const conditions = {
    _id: skipIdConversion ? id : IdsHelper.toObjectId(id),
  };
  return deleteOneByQuery(conditions, collectionName);
}

async function deleteOneByQuery(
  conditions: any,
  collectionName: string,
): Promise<DeleteResult> {
  const db = await MongoClientService.getDb();
  return db.collection(collectionName).deleteOne(conditions);
}

export const DbQueryService = {
  insertOne,
  insertMany,
  findOneById,
  findOneByQuery,
  findManyByQuery,
  updateOneById,
  updateOneByQuery,
  aggregate,
  deleteOneById,
  deleteOneByQuery,
};
