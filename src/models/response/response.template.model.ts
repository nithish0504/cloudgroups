import { ApiResponse } from "./common.res.model";
import { ApiStatusCodes } from "./api.status-codes.model";
import { Logger } from "src/helpers/logger";

const SuccessResponse = <T>(message: string, data: any): ApiResponse<T> => {
  return {
    statusCode: ApiStatusCodes.RequestSuccess,
    message: message || "success",
    data: data,
  };
};

const AuthFailureResponse = (message: string): ApiResponse<any> => {
  return {
    statusCode: ApiStatusCodes.AuthenticationFailure,
    message: message || "Access Denied",
  };
};

const InternalError = (
  message: string,
  tag: string,
  api: string,
  stage = 1,
): ApiResponse<any> => {
  if (message && message.toString().trim() !== "") {
    Logger.error(
      `error in ${api} with ${tag} at stage ${stage} and ${message}`,
      api,
    );
    return {
      statusCode: ApiStatusCodes.InternalError,
      message: message,
    };
  }
  return {
    statusCode: ApiStatusCodes.InternalError,
    message: message,
  };
};

export const ResponseTemplate = {
  SuccessResponse,
  AuthFailureResponse,
  InternalError,
};
