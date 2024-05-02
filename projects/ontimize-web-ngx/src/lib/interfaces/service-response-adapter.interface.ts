import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface IServiceResponseAdapter<T> {
  context: any;
  adapt(res: HttpResponse<any>): T;
  adaptError(error: HttpErrorResponse): any
  setContext(context: any): void;
}
