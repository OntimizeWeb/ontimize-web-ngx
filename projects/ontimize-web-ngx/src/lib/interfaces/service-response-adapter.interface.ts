import { HttpResponse } from '@angular/common/http';

export interface ServiceResponseAdapter<T> {
  adapt(res: HttpResponse<any>): T;
}
