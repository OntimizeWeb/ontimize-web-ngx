import { HttpResponse } from "@angular/common/http";
import { OntimizeServiceResponseAdapter } from "./ontimize-service-response.adapter";
import { OntimizeServiceResponse } from "./ontimize-service-response.class";
import { OPreferenceMappingUtils } from "../../util/preference-mapping-util";
import { Injectable } from "@angular/core";

@Injectable()
export class OPreferenceResponseAdapter extends OntimizeServiceResponseAdapter {
  adapt(res: HttpResponse<any>): OntimizeServiceResponse {

    if (res.body?.data) {
      res.body.data = OPreferenceMappingUtils.standarDataMapping(res.body.data);
    }

    if (res.body.sqlTypes) {
      res.body.sqlTypes = OPreferenceMappingUtils.standarDataMapping(res.body.sqlTypes);
    }
    console.log(' OPreferenceResponseAdapter res.body', res.body);

    return new OntimizeServiceResponse(
      res.body.code,
      res.body.data,
      res.body.message,
      res.body.sqlTypes,
      res.body.startRecordIndex,
      res.body.totalQueryRecordsNumber
    );
  }

}