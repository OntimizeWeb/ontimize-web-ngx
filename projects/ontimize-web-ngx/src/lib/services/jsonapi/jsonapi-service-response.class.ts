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
    public body: any,
    public context: any
  ) {

    if (body?.data) {
      let key;
      if (context) {
        key = context['keys'];
      }
      if (Util.isArray(body.data)) {
        this.data = body.data.map((data: any) => {
          let keyValue = {};
          keyValue[key] = data['id']
          return Object.assign({}, data['attributes'], keyValue)
        });
      } else {
        let keyValue = {};
        keyValue[key] = body.data['id']
        this.data = Object.assign({}, body.data['attributes'], keyValue);
      }
    }
    if (body?.meta) {
      this.totalQueryRecordsNumber = body.meta.total;
      this.startRecordIndex = this.context?.ovrrArgs?.offset ? this.context.ovrrArgs.offset : 0;
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
