import { OTableComponent } from '../components/table/o-table.component';

export interface OTableColumn {
  attr: string;
  title: string;
  type: string;
  table: OTableComponent;
  editor: any;
  orderable: boolean;
  searchable: boolean;
  registerEditor: (editor: any) => void;
  registerRenderer: (editor: any) => void;
}
