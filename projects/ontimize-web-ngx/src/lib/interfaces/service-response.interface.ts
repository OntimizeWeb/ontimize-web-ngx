import { BaseResponse } from "./base-response.interface";

export interface ServiceResponse extends BaseResponse{
  code: number;
  sqlTypes?: { [key: string]: number; };
  startRecordIndex?: number;
  totalQueryRecordsNumber?: number;

}
