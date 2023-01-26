import { BehaviorSubject } from 'rxjs';
import { OTableButton } from './o-table-button.interface';

export interface OTableButtons {
  registerButtons: (oTableButtons: OTableButton[]) => void;
  enabledInsertButton: BehaviorSubject<boolean>;
  enabledRefreshButton: BehaviorSubject<boolean>;
  enabledDeleteButton: BehaviorSubject<boolean>;
}
