import { BaseResponse } from "./base-response.interface";

export interface JSONAPIResponse extends BaseResponse {
  error?: {
    errors: {
      title?: string,
      detail?: string
    }[]
  }
}
