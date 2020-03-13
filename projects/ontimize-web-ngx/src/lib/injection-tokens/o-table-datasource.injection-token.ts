import { InjectionToken } from '@angular/core';

import { OTableDataSource } from '../interfaces/o-table-datasource.interface';

export const O_TABLE_DATASOURCE = new InjectionToken<OTableDataSource>('OTableDataSource');
