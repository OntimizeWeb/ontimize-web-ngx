import { BaseQueryArgument } from './base-query-argument.adapter';
import { Injectable } from '@angular/core';
import { IBaseQueryArgument } from './base-query-argument.interface';

@Injectable()
export class OntimizeQueryArgumentsAdapter extends BaseQueryArgument implements IBaseQueryArgument {


  parseQueryParameters(args: any) {
    let queryargs = [args.filter, args.columns, args.entity, args.sqlTypes];
    if (args.pageable) {
      queryargs = queryargs.concat([args.ovrrArgs.offset, args.ovrrArgs.length, undefined]);
    }

    queryargs[6] = args.sort
    return queryargs;
  }
}
