import { MatMenu } from '@angular/material';

import { OTableOptionComponent } from '../components/table/extensions/header/table-option/o-table-option.component';

export interface OTableMenu {
  matMenu: MatMenu;
  columnFilterOption: OTableOptionComponent;

  registerOptions: (oTableOptions: OTableOptionComponent[]) => void;
  onExportButtonClicked: () => void;
  onChangeColumnsVisibilityClicked: () => void;
  onShowsSelects: () => void;
  onLoadFilterClicked: () => void;
  onClearFilterClicked: () => void;
  onStoreConfigurationClicked: () => void;
  onFilterByColumnClicked: () => void;
  onStoreFilterClicked: () => void;
  onApplyConfigurationClicked: () => void;
}
