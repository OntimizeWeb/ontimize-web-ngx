import { BaseRequestArgument } from './base-request-argument.adapter';
import { Injectable } from '@angular/core';
import { IBaseRequestArgument } from './base-request-argument.interface';

@Injectable()
export class OntimizeQueryArgumentsAdapter extends BaseRequestArgument implements IBaseRequestArgument {

  parseQueryParameters(args: any) {
    let queryargs = [args.filter, args.columns, args.entity, args.sqlTypes];
    if (args.pageable) {
      queryargs = queryargs.concat([args.ovrrArgs.offset, args.ovrrArgs.length, undefined]);
    }

    queryargs[6] = args.sort
    return queryargs;
  }
}
