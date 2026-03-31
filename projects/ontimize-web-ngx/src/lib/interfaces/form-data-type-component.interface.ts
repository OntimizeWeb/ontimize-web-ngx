import { IComponent } from './component.interface';

export interface IFormDataTypeComponent extends IComponent {
  getSQLType(): number;
}
