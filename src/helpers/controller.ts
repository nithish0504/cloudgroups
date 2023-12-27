import { Response } from "express";
import { Logger } from "./logger";
import { ResponseTemplate } from "../models/response/response.template.model";
import { RestStatusCodes } from "src/models/internal/rest.model";
import { ApiStatusCodes } from "src/models/response/api.status-codes.model";

type ErrorType = {
  errorType: string;
  message?: string;
  isJoi?: boolean;
  details?: any[];
};

const _getErrorResult = (error: ErrorType): [any, object] => {
  switch (error.errorType) {
    case RestStatusCodes[RestStatusCodes.NotFound]:
      return [
        RestStatusCodes.NotFound,
        {
          statusCode: ApiStatusCodes.ApiNotFound,
          message: error.message ? error.message : "not found",
        },
      ];
    case RestStatusCodes[RestStatusCodes.InvalidParameters]:
      delete error.isJoi;
      const errorMessage =
        error instanceof Object && error.details && error.details.length > 0
          ? error.details[0].message
          : error;
      Logger.debug(errorMessage);
      return [
        RestStatusCodes.RestSuccess,
        {
          statusCode: ApiStatusCodes.MissingParams,
          message: `Invalid parameters ${errorMessage
            ?.toString()
            ?.replace(/\\/g, "")}`,
        },
      ];
    case RestStatusCodes[RestStatusCodes.Forbidden]:
      return [
        RestStatusCodes.Forbidden,
        ResponseTemplate.AuthFailureResponse(error.message),
      ];
    case RestStatusCodes[RestStatusCodes.ServerError]:
    default:

      if(error.isJoi){
        delete error.isJoi;
        const errorMessage =
          error instanceof Object && error.details && error.details.length > 0
            ? error.details[0].message
            : error;
        Logger.debug(errorMessage);
        return [
          RestStatusCodes.RestSuccess,
          {
            statusCode: ApiStatusCodes.MissingParams,
            message: `Invalid parameters ${errorMessage
              ?.toString()
              ?.replace(/\\/g, "")}`,
          },
        ];
      }
      /**
       * @todo: Email to admin
       */
      Logger.error(
        error instanceof Object ? JSON.stringify(error) : error,
        "error",
      );
      return [
        RestStatusCodes.RestSuccess,
        {
          statusCode: ApiStatusCodes.InternalError,
          message: "Internal server error. Please try again",
        },
      ];
  }
};

const api = (api: (req: any) => Promise<any>) => {
  return (req: any, res: Response) => {
    api(req)
      .then((result) =>
        res
          .status(
            result.statusCode == ApiStatusCodes.AuthenticationFailure
              ? RestStatusCodes.Forbidden
              : RestStatusCodes.RestSuccess,
          )
          .send(result),
      )
      .catch((err) => {
        Logger.error(err, "error");
        const [restStatusCode, result] = _getErrorResult(err);
        res.status(restStatusCode).send(result);
      });
  };
};

// const api = (apiFunction: (req: any) => Promise<any>) => {
//     console.log("here0")
//     return async (req: any, res: Response, next: NextFunction) => {
//       try {
//         console.log("here1")
//         const result = await apiFunction(req);
//         console.log("result",result)
//         const restStatusCode =
//           result.statusCode == ApiStatusCodes.AuthenticationFailure
//             ? RestStatusCodes.Forbidden
//             : RestStatusCodes.RestSuccess;
//         res.status(restStatusCode).send(result);
//       } catch (err:any) {
//         Logger.error(err,"error");
//         const [restStatusCode, result] = _getErrorResult(err);
//         res.status(restStatusCode).send(result);
//       }
//     };
// };

export const Controller = {
  api,
};
