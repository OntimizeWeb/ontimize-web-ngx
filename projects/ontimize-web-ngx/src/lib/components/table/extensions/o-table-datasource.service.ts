import { Injectable } from '@angular/core';

import { OTableComponent } from '../o-table.component';
import { DefaultOTableDataSource } from './default-o-table.datasource';

@Injectable()
export class OTableDataSourceService {

  constructor() { }

  getInstance(table: OTableComponent) {
    return new DefaultOTableDataSource(table);
  }
}
