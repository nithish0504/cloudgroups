import app from "./src/app";
import serverless from "serverless-http";

module.exports.handler = serverless(app, {
    request: function (req: any, event: any, context: any) {
        context.callbackWaitsForEmptyEventLoop = false;
        req.event = event;
        req.context = context;
        try{
            req.claims = event.requestContext.authorizer.claims || {};
        } catch (ex) {
            req.claims = {};
        }
    },
});