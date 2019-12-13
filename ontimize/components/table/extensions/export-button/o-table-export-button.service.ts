import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class OTableExportButtonService {

  public export$: Subject<string> = new Subject();

}
