import * as express from "express";
import { Controller } from "src/helpers/controller";
import { MessageApi } from "src/apis/message.api";

const router = express.Router();

router
  .post("/add", Controller.api(MessageApi.addMessage))
  .get("/:groupId/:pageNo/:perPage", Controller.api(MessageApi.getMessages))
  .put("/:messageId", Controller.api(MessageApi.editMessage))
  .post("/like", Controller.api(MessageApi.likeMessage))
  .post("/unlike", Controller.api(MessageApi.unlikeMessage))
  .delete("/:messageId", Controller.api(MessageApi.deleteMessage));

export default router;
