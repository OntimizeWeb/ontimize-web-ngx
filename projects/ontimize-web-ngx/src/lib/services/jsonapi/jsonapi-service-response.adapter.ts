import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONAPIServiceResponse } from './jsonapi-service-response.class';
import { IServiceResponseAdapter } from '../../interfaces/service-response-adapter.interface';

@Injectable()
export class JSONAPIServiceResponseAdapter implements IServiceResponseAdapter<JSONAPIServiceResponse> {

  context: any;

  adapt(res: HttpResponse<any>): JSONAPIServiceResponse {
    return new JSONAPIServiceResponse(
      res.status,
      res.statusText,
      res.headers,
      res.ok,
      res.body,
      this.context
    );
  }
  /**
   * Adapts error
   * @param httpError
   * @returns
   */
  adaptError(httpError: HttpErrorResponse) {
    return httpError.error?.errors.map((error: any) => this.getErrorMessage(error)).join('\n');
  }

  /**
   * Gets error message
   * @param error
   * @returns error message
   */
  getErrorMessage(error: any): string {
    if (error.title && error.detail && error.title !== error.detail) {
      return (error.title ? (error.title + ':') : '') + error.detail
    } else if (error.title) {
      return error.title;
    } else if (error.detail) {
      return error.detail;
    } else {
      return error;
    }
  }

  /**
   * Sets context
   * @param context
   */
  setContext(context: any) {
    this.context = context;
  }
}
