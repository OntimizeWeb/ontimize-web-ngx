import { ServiceResponse } from "./service-response.interface";

export interface JSONAPIResponse extends ServiceResponse {
  error?: {
    errors: {
      title?: string,
      detail?: string
    }[]
  }
}
