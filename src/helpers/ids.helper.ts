import { ObjectId } from "mongodb";

const toObjectId = (id:any) => {
  if (id instanceof ObjectId) {
    return id;
  }
  return new ObjectId(id);
};

const toObjectIds = (ids: string[]) => {
  const _ids: string[] = ids;
  return _ids.map((_id) => toObjectId(_id));
};

const newObjectId = () => {
  return new ObjectId();
};

export const IdsHelper = {
  newObjectId,
  toObjectId,
  toObjectIds,
};
