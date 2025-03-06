import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface IServiceResponseAdapter<T> {
  adapt(res: HttpResponse<any>): T;
  adaptError?(error: HttpErrorResponse): any
}
