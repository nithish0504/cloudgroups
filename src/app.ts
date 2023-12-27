import Express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import UserRouter from "src/routes/user.router";
import GroupRouter from "src/routes/group.route";
import MessageRouter from "src/routes/message.route";

class App {
  public app: Express.Application;
  constructor() {
    this.app = Express();
    this.config();
  }
  private config() {
    // let newApp = Express()
    let customHeaders: string[] = ["Authorization"];
    this.app.use(
      cors({
        allowedHeaders: customHeaders,
      }),
    );
    this.app.options(process.env.corsOrigin, [
      cors({
        allowedHeaders: customHeaders,
      }),
    ]);
    this.app.use(
      bodyParser.json({
        strict: false,
        limit: "20mb",
        type: "application/json",
      }),
    );
    // newApp.use("user", UserRouter)
    // console.log("basepath",process.env.basepath)
    this.app.use("/user", UserRouter);
    this.app.use("/group", GroupRouter);
    this.app.use("/message", MessageRouter);
    // this.app.use(`/${process.env.basepath}`, newApp)
  }
}
export default new App().app;
