import { HttpResponse } from '@angular/common/http';

export interface IServiceResponseAdapter<T> {
  adapt(res: HttpResponse<any>): T;
  setContext(context:any);
}
