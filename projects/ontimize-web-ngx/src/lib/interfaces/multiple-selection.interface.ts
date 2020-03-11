import { IComponent } from './component.interface';

export interface IMultipleSelection extends IComponent {
  getSelectedItems(): any[];
  setSelectedItems(values: any[]): void;
}
