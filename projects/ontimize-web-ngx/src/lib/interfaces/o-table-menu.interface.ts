import { MatMenu } from '@angular/material/menu';

import { OTableOptionComponent } from '../components/table/extensions/header/table-option/o-table-option.component';
import { EventEmitter } from '@angular/core';

export interface OTableMenu {
  matMenu: MatMenu;
  columnFilterOption: OTableOptionComponent;
  onVisibleFilterOptionChange: EventEmitter<boolean>;

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
