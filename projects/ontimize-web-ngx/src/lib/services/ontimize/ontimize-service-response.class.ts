import { ServiceResponse } from '../../interfaces/service-response.interface';

export class OntimizeServiceResponse implements ServiceResponse {

  constructor(
    public code: number,
    public data: any,
    public message: string,
    public sqlTypes: { [key: string]: number; },
    public startRecordIndex?: number,
    public totalQueryRecordsNumber?: number
  ) { }

}
