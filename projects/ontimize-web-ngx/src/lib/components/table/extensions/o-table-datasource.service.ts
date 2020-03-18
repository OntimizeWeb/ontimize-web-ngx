import { Injectable } from '@angular/core';

import { DefaultOTableDataSource } from './default-o-table.datasource';

@Injectable()
export class OTableDataSourceService {

  constructor() { }

  getInstance() {
    return new DefaultOTableDataSource();
  }
}
