import * as https from "https";
import { CommonUtils } from "src/helpers/common-utils";
import { Logger } from "src/helpers/logger";
import { CommonResponseModel } from "src/models/response/common.res.model";

const postRequestNoWait = async (
  data: string | Buffer,
  options: https.RequestOptions,
) => {
  return new Promise((resolve, reject) => {
    //create the request object with the callback with the result
    const req = https.request(options);

    // handle the possible errors
    req.on("error", (e) => {
      reject(e.message);
    });
    //do the request
    req.write(data);

    //finish the request
    req.end(() => {
      resolve(data);
    });
  });
};

function httpsPost(
  body: Object | string,
  options: https.RequestOptions,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: "POST",
        ...options,
      },
      (res) => {
        const chunks: any[] = [];
        res.on("data", (data) => chunks.push(data));
        res.on("end", () => {
          let resBody: any = Buffer.concat(chunks);
          switch (res.headers["content-type"]) {
            case "application/json":
              resBody = JSON.parse(resBody);
              break;
          }
          resolve(resBody);
        });
      },
    );
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

const httpsGet = async (
  options: https.RequestOptions,
  apiTimeoutInSec: number = 0,
): Promise<CommonResponseModel<any>> => {
  return new Promise((resolve, _reject) => {
    const req = https.request(
      {
        method: "GET",
        ...options,
      },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          let responseBody = data;
          const contentType = res.headers["content-type"];
          if (
            CommonUtils.isDefined(contentType) &&
            contentType.includes("application/json") &&
            CommonUtils.isDefined(responseBody) &&
            responseBody.toString().length != 0
          ) {
            try {
              responseBody = JSON.parse(responseBody.toString());
            } catch (ex: any) {
              Logger.error(ex, "httpGet");
            }
          }
          if (res.statusCode === 200 || res.statusCode === 204) {
            resolve({ isSuccess: true, data: responseBody });
          } else {
            resolve({ isSuccess: false, error: `${res.statusCode}-${data}` });
          }
        });
      },
    );
    req.on("error", (e) => resolve({ isSuccess: false, error: e }));
    req.end();
    if (apiTimeoutInSec > 0) {
      setTimeout(
        () =>
          req.destroy(
            Error(`API request has timed out after ${apiTimeoutInSec} seconds`),
          ),
        apiTimeoutInSec * 1000,
      );
    }
  });
};

function httpsPatch(
  body: Object | string,
  options: https.RequestOptions,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: "PATCH",
        ...options,
      },
      (res) => {
        const chunks: any[] = [];
        res.on("data", (data) => chunks.push(data));
        res.on("end", () => {
          let resBody: any = Buffer.concat(chunks);
          switch (res.headers["content-type"]) {
            case "application/json":
              resBody = JSON.parse(resBody);
              break;
          }
          resolve(resBody);
        });
      },
    );
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

export const HttpService = {
  httpsPost,
  httpsGet,
  postRequestNoWait,
  httpsPatch,
};
