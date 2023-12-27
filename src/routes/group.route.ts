import * as express from "express";
import { Controller } from "src/helpers/controller";
import { GroupApi } from "src/apis/group.api";

const router = express.Router();

router
  .get("/list", Controller.api(GroupApi.getGroups))
  .post("/create", Controller.api(GroupApi.createGroup))
  .post("/members/add",Controller.api(GroupApi.addMembers))
  .post("/members/remove",Controller.api(GroupApi.removeMembers))
  .delete("/:groupId", Controller.api(GroupApi.deleteGroup))

export default router;
