import { HttpHeaders } from "@angular/common/http";
import { ServiceResponse } from "../../interfaces/service-response.interface";
import { Util } from "../../util/util";


export class JSONAPIServiceResponse implements ServiceResponse {
  public code: number;
  public message: string;
  public sqlTypes: { [key: string]: number; };
  public startRecordIndex: number;
  public totalQueryRecordsNumber: number;
  public data: any;
  constructor(
    public status: number,
    public statusText: string,
    public headers: HttpHeaders,
    public ok: boolean,
    public body: any
  ) {
    if (body?.data) {
      if (Util.isArray(body.data)) {
        this.data = body.data.map((data: any) => Object.assign({}, data['attributes'], { id: data['id'] }));
      } else {
        this.data = Object.assign({}, body.data['attributes'], { id: body.data['id'] });
      }
    }
    this.code = (this.status >= 200 || this.status < 300) ? 0 : (this.status === 404 ? 3 : 1);
    this.message = this.statusText;


  }

  isSuccessful(): boolean {
    return this.status >= 200 || this.status < 300;
  }

  isFailed(): boolean {
    return this.status > 300;
  }

  isUnauthorized(): boolean {
    return this.status === 403;
  }

}
