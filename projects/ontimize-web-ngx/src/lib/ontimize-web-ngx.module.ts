import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Injectable } from '@angular/core';

import { OntimizeWebNgxComponent } from './ontimize-web-ngx.component';

import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './config/o-modules';

// export { ONTIMIZE_MODULES } from './config/o-modules';
// export { ONTIMIZE_PROVIDERS } from './config/o-providers';

// export * from './config/app-config';
// export * from './MainLauncher';

// export * from './pipes/order-by.pipe';
// export * from './pipes/o-translate.pipe';
// export * from './pipes/columns-filter.pipe';
// export * from './pipes/o-integer.pipe';
// export * from './pipes/o-real.pipe';
// export * from './pipes/o-moment.pipe';
// export * from './pipes/o-currency.pipe';
// export * from './pipes/o-percentage.pipe';

// export * from './services/login.service';
// export * from './services/navigation.service';
// export * from './services/ontimize.service';
// export * from './services/ontimize-ee.service';
// export * from './services/ontimize-export.service';
// export * from './services/ontimize-file.service';
// export * from './services/moment.service';
// export * from './services/currency.service';
// export * from './services/number.service';
// export * from './services/dialog.service';
// export * from './services/snackbar.service';
// export * from './services/translate/o-translate.service';
// export * from './services/data-service.provider';
// export * from './services/auth-guard.service';
// export * from './services/local-storage.service';
// export * from './services/app-config.provider';
// export * from './services/app-menu.service';
// export * from './services/o-user-info.service';
// export * from './services/o-modules-info.service';
// export * from './services/mat-date-formats.factory';
// export * from './services/translate/o-translate-http-loader';
// export * from './services/translate/o-translate.parser';
// export * from './services/parser/o-service-response.parser';
// export * from './services/ontimize-icon-registry.service';
// export * from './services/permissions/o-permissions.module';
// export * from './services/remote-config.service';

// export * from './decorators/input-converter';
// export * from './decorators/o-component';

// export * from './components/list/list-item/o-list-item.directive';
// export * from './directives/keyboard-listener.directive';
// export * from './directives/o-hidden.directive';

// export * from './components/input/listpicker/o-list-picker.component';
// export * from './components/input/nif-input/o-nif-input.component';
// export * from './components/input/password-input/o-password-input.component';
// export * from './components/input/percent-input/o-percent-input.component';
// export * from './components/input/real-input/o-real-input.component';
// export * from './components/input/search-input/o-search-input.component';
// export * from './components/input/text-input/o-text-input.component';
// export * from './components/input/textarea-input/o-textarea-input.component';
// export * from './components/input/validation/o-error.component';
// export * from './components/input/validation/o-validator.component';
// export * from './components/input/o-form-service-component.class';
// export * from './components/input/hour-input/o-hour-input.component';
// export * from './components/input/time-input/o-time-input.component';
// export * from './components/input/radio/o-radio.component';
// export * from './components/input/slide-toggle/o-slide-toggle.component';
// export * from './components/input/slider/o-slider.component';
// export * from './components/input/date-range/o-daterange-input.component';
// export * from './components/table/o-table.component';
// export * from './components/table/o-table.dao';
// export * from './components/table/o-table.datasource';
// export * from './components/table/column/o-table-column.component';
// export * from './components/table/column/cell-renderer/cell-renderer';
// export * from './components/table/column/cell-editor/cell-editor';
// export * from './components/table/extensions/dialog/o-table-dialog-components';
// export * from './components/table/extensions/footer/o-table-footer-components';
// export * from './components/table/extensions/header/o-table-header-components';
// // export * from './components/filter-expression.utils';
// export * from './components/o-component.class';
// export * from './components/o-form-data-component.class';
// export * from './components/o-service-base-component.class';
// export * from './components/o-service-component.class';
// export * from './components/container/o-container-component.class';
// export * from './components/user-info/o-user-info.component';
// export * from './components/language-selector/o-language-selector.component';
// export * from './components/card-menu-item/o-card-menu-item.component';
// export * from './components/grid/o-grid.component';

// export * from './layouts/app-layout/o-app-layout.component';
// export * from './layouts/app-layout/app-layout-header/o-app-layout-header.component';
// export * from './layouts/app-layout/app-layout-sidenav/o-app-layout-sidenav.component';
// export * from './components/app-header/o-app-header.component';
// export * from './components/app-sidenav/o-app-sidenav.component';
// export * from './layouts/card-menu-layout/o-card-menu-layout.component';
// export * from './layouts/form-layout/o-form-layout-manager.component';
// export * from './layouts/form-layout/tabgroup/options/o-form-layout-tabgroup-options.component';
// export * from './layouts/form-layout/dialog/options/o-form-layout-dialog-options.component';

// export * from './util/async';
// export * from './util/base64';
// export * from './util/events';
// export * from './util/permissions';
// export * from './util/sqltypes';
// export * from './util/util';
// export * from './util/codes';
// export * from './components/service.utils';
// export * from './components/filter-expression.utils';

// export * from './shared/material/custom.material.module';
// export * from './shared/shared.module';

// export * from './validators/o-validators';

// export * from './types/ontimize-service-config.type';
// export * from './types/remote-configuration.type';

@Injectable({
  providedIn: 'root',
})

@NgModule({
  declarations: [OntimizeWebNgxComponent] ,
  imports: INTERNAL_ONTIMIZE_MODULES,
  exports: [INTERNAL_ONTIMIZE_MODULES_EXPORTED, OntimizeWebNgxComponent],
  entryComponents: [
    ODialogComponent,
    OSnackBarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntimizeWebNgxModule { }
