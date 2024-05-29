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
      if (Util.isArray(body.data)) {
        this.data = body.data.map((data: any) => {
          return data['attributes'];
        });
      } else {
        this.data = body.data['attributes']
      }
    }
    if (body?.meta) {
      this.totalQueryRecordsNumber = body.meta.total;
      this.startRecordIndex = this.context?.ovrrArgs?.offset ? this.context.ovrrArgs.offset : 0;
    }

    if (this.status >= 200 || this.status < 300) {
      this.code = 0;
    } else if (this.status === 404) {
      this.code = 3;
    } else {
      this.code = 1;
    }
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
