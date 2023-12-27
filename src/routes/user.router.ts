import * as express from "express";
// import { Response, NextFunction } from 'express';
import { Controller } from "src/helpers/controller";
import { UserApi } from "src/apis/user.api";

const router = express.Router();

router
  .get("/signup", Controller.api(UserApi.signupUser))
  .post("/logout", Controller.api(UserApi.logoutUser))
  .get("/", Controller.api(UserApi.getUsers))
  .post("/edit/:userId", Controller.api(UserApi.editUser))
  .delete("/delete/:userId", Controller.api(UserApi.deleteUser));

// router.route("/signup").get(async function(req:express.Request, res: Response){
//     res.send({
//         "isSuccess":true,
//         "message":"message"
//     })
// })

export default router;
