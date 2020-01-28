import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DndModule } from '@churchs19/ng2-dnd';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { OBarMenuGroupModule} from '../components/bar-menu/menu-group/o-bar-menu-group.component';
import { OBarMenuItemModule} from '../components/bar-menu/menu-item/o-bar-menu-item.component';
import { OBarMenuModule } from '../components/bar-menu/o-bar-menu.component';
import { OBarMenuNestedModule } from '../components/bar-menu/menu-nested/o-bar-menu-nested.component';
import { OBarMenuSeparatorModule } from '../components/bar-menu/menu-separator/o-bar-menu-separator.component';
import { OBreadcrumbModule } from '../components/breadcrumb/o-breadcrumb.component';
import { OButtonModule } from '../components/button/o-button.component';
import { OButtonToggleModule } from '../components/button-toggle/o-button-toggle.module';
import { OCardMenuItemModule } from '../components/card-menu-item/o-card-menu-item.component';
import { OCheckboxModule } from '../components/input/checkbox/o-checkbox.component';
import { OColumnCollapsibleModule } from '../components/container/column-collapsible/o-column-collapsible.component';
import { OColumnModule } from '../components/container/column/o-column.component';
import { OComboModule } from '../components/input/combo/o-combo.component';
import { OContextMenuModule } from '../components/contextmenu/o-context-menu.module';
import { OCurrencyInputModule } from '../components/input/currency-input/o-currency-input.component';
import { ODateInputModule } from '../components/input/date-input/o-date-input.component';
import { ODialogModule } from '../components/dialog/o-dialog.component';
import { OEmailInputModule } from '../components/input/email-input/o-email-input.component';
import { OErrorModule } from '../components/input/validation/o-error.component';
import { OFileInputModule } from '../components/input/file-input/o-file-input.component';
import { OFormContainerModule } from '../components/form/o-form-container.component';
import { OFormModule } from '../components/form/o-form.component';
import { OGridModule } from '../components/grid/o-grid.component';
import { OHourInputModule } from '../components/input/hour-input/o-hour-input.component';
import { OHTMLInputModule } from '../components/input/html-input/o-html-input.component';
import { OImageModule } from '../components/image/o-image.component';
import { OIntegerInputModule } from '../components/input/integer-input/o-integer-input.component';
import { OLanguageSelectorModule } from '../components/language-selector/o-language-selector.component';
import { OListItemAvatarModule } from '../components/list/renderers/o-list-item-avatar.component';
import { OListItemCardImageModule } from '../components/list/renderers/o-list-item-card-image.component';
import { OListItemCardModule } from '../components/list/renderers/o-list-item-card.component';
import { OListItemModule } from '../components/list/list-item/o-list-item.component';
import { OListItemTextModule } from '../components/list/renderers/o-list-item-text.component';
import { OListPickerModule } from '../components/input/listpicker/o-list-picker.component';
import { OLocaleBarMenuItemModule } from '../components/bar-menu/locale-menu-item/o-locale-bar-menu-item.component';
import { ONIFInputModule } from '../components/input/nif-input/o-nif-input.component';
import { OPasswordInputModule } from '../components/input/password-input/o-password-input.component';
import { OPercentInputModule } from '../components/input/percent-input/o-percent-input.component';
import { ORadioModule } from '../components/input/radio/o-radio.component';
import { ORealInputModule } from '../components/input/real-input/o-real-input.component';
import { ORowCollapsibleModule } from '../components/container/row-collapsible/o-row-collapsible.component';
import { OSearchInputModule } from '../components/input/search-input/o-search-input.component';
import { OSliderModule } from '../components/input/slider/o-slider.component';
import { OSlideToggleModule } from '../components/input/slide-toggle/o-slide-toggle.component';
import { OSnackBarModule } from '../components/snackbar/o-snackbar.component';
import { OTableModule } from '../components/table/o-table.component';
import { OTextareaInputModule } from '../components/input/textarea-input/o-textarea-input.component';
import { OTextInputModule } from '../components/input/text-input/o-text-input.component';
import { OTimeInputModule } from '../components/input/time-input/o-time-input.component';
import { OUserInfoModule } from '../components/user-info/o-user-info.component';
import { OValidatorModule } from '../components/input/validation/o-validator.component';
import { ORowModule } from '../components/container/row/o-row.component';
import { OListModule } from '../components/list/o-list.component';

import { OFilterBuilderModule } from '../components/filter-builder/o-filter-builder.module';
import { ODateRangeInputModule } from '../components/input/date-range/o-daterange-input.component';
import { AppConfig, APP_CONFIG } from '../config/app-config';
import { OAppLayoutModule } from '../layouts/app-layout/o-app-layout.component';
import { OFormLayoutManagerModule } from '../layouts/form-layout/o-form-layout-manager.component';
import { OCardMenuLayoutModule } from '../layouts/card-menu-layout/o-card-menu-layout.component';
import { OTranslateService } from '../services/translate/o-translate.service';
import { OTranslateHttpLoader } from '../services/translate/o-translate-http-loader';
import { OPermissionsModule } from '../services/permissions/o-permissions.module';
import { OTranslateParser } from '../services/translate/o-translate.parser';
import { OSharedModule } from '../shared/shared.module';
import { Util } from '../util/util';
import { appInitializerFactory } from './o-providers';


export const INTERNAL_ONTIMIZE_MODULES_EXPORTED: any = [
  // Standard modules
  HttpModule,
  HttpClientModule,
  OSharedModule,

  // Ontimize modules
  OBarMenuModule,
  OBarMenuGroupModule,
  OBarMenuItemModule,
  OLocaleBarMenuItemModule,
  OBarMenuSeparatorModule,
  OBarMenuNestedModule,
  OBreadcrumbModule,
  OButtonModule,
  OButtonToggleModule,
  OCheckboxModule,
  OComboModule,
  OColumnModule,
  OColumnCollapsibleModule,
  OContextMenuModule,
  ORowModule,
  ORowCollapsibleModule,
  ODialogModule,
  OSnackBarModule,
  OFilterBuilderModule,
  OFormModule,
  OFormContainerModule,
  OImageModule,
  OCurrencyInputModule,
  ODateInputModule,
  OEmailInputModule,
  OFileInputModule,
  OHTMLInputModule,
  OIntegerInputModule,
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORealInputModule,
  OTextInputModule,
  OTextareaInputModule,
  OValidatorModule,
  OErrorModule,
  OListModule,
  OListItemModule,
  OListItemAvatarModule,
  OListItemTextModule,
  OListItemCardModule,
  OListItemCardImageModule,
  OSearchInputModule,
  OTableModule,
  OAppLayoutModule,
  OFormLayoutManagerModule,
  OUserInfoModule,
  OLanguageSelectorModule,
  OCardMenuItemModule,
  OCardMenuLayoutModule,
  OHourInputModule,
  OTimeInputModule,
  OGridModule,
  ORadioModule,
  OSlideToggleModule,
  OSliderModule,
  ODateRangeInputModule
];

// AoT requires an exported function for factories
export function OHttpLoaderFactory(http: HttpClient, injector: Injector, appConfig: AppConfig) {
  let i18nConf = appConfig.getI18nAssetsConfiguration();
  let i18nPath = undefined;
  let i18nExtension = undefined;
  if (Util.isDefined(i18nConf)) {
    if (Util.isDefined(i18nConf.path)) {
      i18nPath = i18nConf.path;
    }
    if (Util.isDefined(i18nConf.extension)) {
      i18nExtension = i18nConf.extension;
    }
  }
  return new OTranslateHttpLoader(http, i18nPath, i18nExtension, injector);
}

export function OTranslateParserFactory() {
  return new OTranslateParser();
}

export const INTERNAL_ONTIMIZE_MODULES: any = [
  HttpModule,
  HttpClientModule,

  // Ngx-translate
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: OHttpLoaderFactory,
      deps: [HttpClient, Injector, AppConfig]
    },
    parser: {
      provide: TranslateParser,
      useFactory: OTranslateParserFactory
    }
  }),
  DndModule.forRoot(),
  NgxMaterialTimepickerModule, // Removed forRoot()
  OSharedModule,

  // Ontimize modules
  OBarMenuModule,
  OBarMenuGroupModule,
  OBarMenuItemModule,
  OLocaleBarMenuItemModule,
  OBarMenuSeparatorModule,
  OBarMenuNestedModule,
  OBreadcrumbModule,
  OButtonModule,
  OButtonToggleModule,
  OCheckboxModule,
  OComboModule,
  OColumnModule,
  OColumnCollapsibleModule,
  OContextMenuModule,
  ORowModule,
  ORowCollapsibleModule,
  ODialogModule,
  OSnackBarModule,
  OFilterBuilderModule,
  OFormModule,
  OFormContainerModule,
  OImageModule,
  OCurrencyInputModule,
  ODateInputModule,
  OEmailInputModule,
  OFileInputModule,
  OHTMLInputModule,
  OIntegerInputModule,
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORealInputModule,
  OTextInputModule,
  OTextareaInputModule,
  OValidatorModule,
  OErrorModule,
  OListModule,
  OListItemModule,
  OListItemAvatarModule,
  OListItemTextModule,
  OListItemCardModule,
  OListItemCardImageModule,
  OSearchInputModule,
  OTableModule,
  OAppLayoutModule,
  OFormLayoutManagerModule,
  OUserInfoModule,
  OLanguageSelectorModule,
  OCardMenuItemModule,
  OCardMenuLayoutModule,
  OHourInputModule,
  OTimeInputModule,
  OGridModule,
  ORadioModule,
  OSlideToggleModule,
  ODateRangeInputModule
];

@NgModule({
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [Injector, APP_CONFIG, OTranslateService],
    multi: true
  }]
})
export class OntimizeWebTranslateModule { }

export const ONTIMIZE_MODULES: any = [
  BrowserModule,
  BrowserAnimationsModule,
  OntimizeWebTranslateModule,
  OPermissionsModule
];

export const ONTIMIZE_MODULES_WITHOUT_ANIMATIONS: any = [
  NoopAnimationsModule,
  OntimizeWebTranslateModule,
  OPermissionsModule
];

