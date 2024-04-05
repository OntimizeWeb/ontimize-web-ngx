import { Injectable } from '@angular/core';

import { RestQueryParameter } from '../../types/rest-query-parameter.type';
import { BaseQueryArgument } from './base-query-argument.adapter';
import { IBaseQueryArgument } from './base-query-argument.interface';
import { map } from 'rxjs';

@Injectable()
export class RestQueryArgumentsAdapter extends BaseQueryArgument implements IBaseQueryArgument {

  parseQueryParameters(args: any): RestQueryParameter[] {
    let fields: object = {};
    fields[args.entity] = args.columns.toString();
    let queryargs: RestQueryParameter = {
      type: args.entity,
      fields: fields
      //fields[entity]: args.columns.toString()
    };

    if (args.pageable) {
      queryargs.page['offset'] = args.ovrrArgs.offset;
      queryargs.page['limit'] = args.ovrrArgs.length;
    }

    return [queryargs];
  }

  // request(method: string, service: any, queryArguments: any) {
  //   return super.request(method, service, queryArguments).pipe(
  //     map((data: any) => {
  //       return this.adapter.adapt(data);
  //     }));
  // }
}
