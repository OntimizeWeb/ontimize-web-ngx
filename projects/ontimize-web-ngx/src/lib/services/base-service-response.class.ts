import { ServiceResponse } from '../interfaces/service-response.interface';
import { Codes } from '../util/codes';

export abstract class BaseServiceResponse implements ServiceResponse {

  constructor(
    public code: number,
    public data: any,
    public message: string,
    public sqlTypes?: { [key: string]: number; },
    public startRecordIndex?: number,
    public totalQueryRecordsNumber?: number
  ) {
  }

  isSuccessful(): boolean {
    return this.code === Codes.ONTIMIZE_SUCCESSFUL_CODE;
  }

  isFailed(): boolean {
    return this.code === Codes.ONTIMIZE_FAILED_CODE;
  }

  isUnauthorized(): boolean {
    return this.code === Codes.ONTIMIZE_UNAUTHORIZED_CODE;
  }
}
