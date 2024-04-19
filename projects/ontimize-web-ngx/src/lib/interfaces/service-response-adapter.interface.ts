import { HttpResponse } from '@angular/common/http';

export interface IServiceResponseAdapter<T> {
  context: any;
  adapt(res: HttpResponse<any>): T;
  setContext(context:any);
}
