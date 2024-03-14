import { OColumn } from "../components/table/column/o-column.class";
import { OPivotTableFunction } from "./o-pivot-table-function.type";

export type OPivotTablePreferences = {
  title: string
  subtitle: string,
  columns: Array<OColumn>,
  rows?: Array<OColumn>,
  orderBy?: Array<any>,
  functions?: Array<OPivotTableFunction>,
  groups?: Array<string>,
  entity: string,
  service: string
}

export class DefaultOPivotTablePreferences implements OPivotTablePreferences {
  public title: string;
  public subtitle: string;
  public vertical: boolean;
  public columns: any[];
  public rows: any[];
  public groups: string[];
  public functions: any[];
  public orderBy: any[];
  public entity: string;
  public service: string;

  constructor() {
    this.title = '';
    this.subtitle = '';
    this.vertical = true;
    this.columns = [];
    this.rows = [];
    this.groups = [];
    this.functions = [];
    this.orderBy = [];
    this.entity = '';
    this.service = '';

  }
}


