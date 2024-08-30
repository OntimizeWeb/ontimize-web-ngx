import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IServiceResponseAdapter } from '../../interfaces/service-response-adapter.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OntimizeServiceResponse } from './ontimize-service-response.class';

@Injectable()
export class OntimizeServiceResponseAdapter implements IServiceResponseAdapter<OntimizeServiceResponse> {
  context:any;
  adapt(res: HttpResponse<any>): ServiceResponse {
    return new OntimizeServiceResponse(
      res.body.code,
      res.body.data,
      res.body.message,
      res.body.sqlTypes,
      res.body.startRecordIndex,
      res.body.totalQueryRecordsNumber
    );
  }

  setContext(context:any) {
    this.context = context;
  }

  adaptError(error: HttpErrorResponse) {
    return error;
  }
}
