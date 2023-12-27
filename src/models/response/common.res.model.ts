export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
}

export interface CommonResponseModel<T> {
  isSuccess: boolean;
  data?: T;
  error?: Error | any;
  message?: string;
}

export interface ValidityResponse {
  isValid: boolean;
  data?: any;
  error?: Error | string;
  message?: string;
}
