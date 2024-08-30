
export interface BaseResponse {
  data: any;
  message: string;
  isSuccessful(): boolean;
  isFailed(): boolean;
  isUnauthorized(): boolean;
}
