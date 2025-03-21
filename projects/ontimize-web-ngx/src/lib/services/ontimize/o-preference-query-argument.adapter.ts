
import { Injectable } from '@angular/core';
import { OPreferenceMappingUtils } from '../../util/preference-mapping-util';
import { OntimizeQueryArgumentsAdapter } from '../query-arguments/ontimize-query-arguments.adapter';

@Injectable()
export class OPreferenceQueryArgumentsAdapter extends OntimizeQueryArgumentsAdapter  {

  parseQueryParameters(args: any): any[] {
    args.columns = OPreferenceMappingUtils.ontimizeMappingKeys(args.columns);
    args.sqlTypes = OPreferenceMappingUtils.ontimizeDataMapping(args.sqlTypes);
    return super.parseQueryParameters(args);
  }
}