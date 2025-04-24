
export interface BaseResponse {
  isSuccessful(): boolean;
  isFailed(): boolean;
  isUnauthorized(): boolean;
}
