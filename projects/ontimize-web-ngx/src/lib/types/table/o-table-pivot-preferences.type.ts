import { OColumn } from "../../components/table/column/o-column.class";
import { OTablePivotFunction } from "./o-table-pivot-function.type";

export type OTablePivotPreferences = {
  title: string
  subtitle: string,
  columns: Array<OColumn>,
  rows?: Array<OColumn>,
  orderBy?: Array<any>,
  functions?: Array<OTablePivotFunction>,
  groups?: Array<string>,
  entity: string,
  service: string
}

export class DefaultOTablePivotPreferences implements OTablePivotPreferences {
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


