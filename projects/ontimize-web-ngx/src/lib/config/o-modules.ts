import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { OBarMenuModule } from '../components/bar-menu/o-bar-menu.module';
import { OBreadcrumbModule } from '../components/breadcrumb/o-breadcrumb.module';
import { OButtonToggleModule } from '../components/button-toggle/o-button-toggle.module';
import { OButtonModule } from '../components/button/o-button.module';
import { OCardMenuItemModule } from '../components/card-menu-item/o-card-menu-item.module';
import { OColumnCollapsibleModule } from '../components/container/column-collapsible/o-column-collapsible.module';
import { OColumnModule } from '../components/container/column/o-column.module';
import { ORowCollapsibleModule } from '../components/container/row-collapsible/o-row-collapsible.module';
import { ORowModule } from '../components/container/row/o-row.module';
import { OContextMenuModule } from '../components/contextmenu/o-context-menu.module';
import { OFilterBuilderModule } from '../components/filter-builder/o-filter-builder.module';
import { OFormContainerModule } from '../components/form-container/o-form-container.module';
import { OFormModule } from '../components/form/o-form.module';
import { OGridModule } from '../components/grid/o-grid.module';
import { OImageModule } from '../components/image/o-image.module';
import { OCheckboxModule } from '../components/input/checkbox/o-checkbox.module';
import { OComboModule } from '../components/input/combo/o-combo.module';
import { OCurrencyInputModule } from '../components/input/currency-input/o-currency-input.module';
import { ODateInputModule } from '../components/input/date-input/o-date-input.module';
import { ODateRangeInputModule } from '../components/input/date-range/o-daterange-input.module';
import { OEmailInputModule } from '../components/input/email-input/o-email-input.module';
import { OPhoneInputModule} from '../components/input/phone-input/o-phone-input.module';
import { OFileInputModule } from '../components/input/file-input/o-file-input.module';
import { OHourInputModule } from '../components/input/hour-input/o-hour-input.module';
import { OHTMLInputModule } from '../components/input/html-input/o-html-input.module';
import { OIntegerInputModule } from '../components/input/integer-input/o-integer-input.module';
import { OListPickerModule } from '../components/input/listpicker/o-list-picker.module';
import { ONIFInputModule } from '../components/input/nif-input/o-nif-input.module';
import { OPasswordInputModule } from '../components/input/password-input/o-password-input.module';
import { OPercentInputModule } from '../components/input/percent-input/o-percent-input.module';
import { ORadioModule } from '../components/input/radio/o-radio.module';
import { ORealInputModule } from '../components/input/real-input/o-real-input.module';
import { OSearchInputModule } from '../components/input/search-input/o-search-input.module';
import { OSlideToggleModule } from '../components/input/slide-toggle/o-slide-toggle.module';
import { OSliderModule } from '../components/input/slider/o-slider.module';
import { OTextInputModule } from '../components/input/text-input/o-text-input.module';
import { OTextareaInputModule } from '../components/input/textarea-input/o-textarea-input.module';
import { OTimeInputModule } from '../components/input/time-input/o-time-input.module';
import { OLanguageSelectorModule } from '../components/language-selector/o-language-selector.module';
import { OListModule } from '../components/list/o-list.module';
import { OTableModule } from '../components/table/o-table.module';
import { OUserInfoModule } from '../components/user-info/o-user-info.module';
import { APP_CONFIG, AppConfig } from '../config/app-config';
import { OAppLayoutModule } from '../layouts/app-layout/o-app-layout.module';
import { OCardMenuLayoutModule } from '../layouts/card-menu-layout/o-card-menu-layout.module';
import { OFormLayoutManagerModule } from '../layouts/form-layout/o-form-layout-manager.module';
import { OPermissionsModule } from '../services/permissions/o-permissions.module';
import { OTranslateHttpLoader } from '../services/translate/o-translate-http-loader';
import { OTranslateParser } from '../services/translate/o-translate.parser';
import { OTranslateService } from '../services/translate/o-translate.service';
import { OSharedModule } from '../shared/shared.module';
import { Util } from '../util/util';
import { appInitializerFactory } from './o-providers';
import { OExpandableContainerModule } from '../components/expandable-container/o-expandable-container.module';
import { ODualListSelectorModule } from '../components/dual-list-selector/o-dual-list-selector.module';
import { ODataToolbarModule } from '../components/o-data-toolbar/o-data-toolbar.module';

@NgModule({
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [Injector, APP_CONFIG, OTranslateService],
    multi: true
  }]
})
export class OntimizeWebTranslateModule { }

export const INTERNAL_ONTIMIZE_MODULES_EXPORTED: any = [
  OntimizeWebTranslateModule,
  OPermissionsModule,
  // Standard modules
  HttpClientModule,
  OSharedModule,

  // Ontimize modules
  OBarMenuModule,
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
  OFilterBuilderModule,
  OFormModule,
  OFormContainerModule,
  OImageModule,
  OCurrencyInputModule,
  ODateInputModule,
  OEmailInputModule,
  OPhoneInputModule,
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
  OListModule,
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
  ODateRangeInputModule,
  OExpandableContainerModule,
  ODualListSelectorModule,
  ODataToolbarModule
];

// AoT requires an exported function for factories
export function OHttpLoaderFactory(http: HttpClient, injector: Injector, appConfig: AppConfig) {
  const i18nConf = appConfig.getI18nAssetsConfiguration();
  let i18nPath;
  let i18nExtension;
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
  HttpClientModule,

  // // Ngx-translate
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
  // DndModule.forRoot(),
  NgxMaterialTimepickerModule,
  OSharedModule,

  // Ontimize modules
  OBarMenuModule,
  OBreadcrumbModule,
  OButtonModule,
  OButtonToggleModule,
  OCardMenuItemModule,
  OColumnModule,
  OColumnCollapsibleModule,
  ORowModule,
  ORowCollapsibleModule,
  OContextMenuModule,
  OFilterBuilderModule,
  OFormModule,
  OFormContainerModule,
  OGridModule,
  OImageModule,

  OCheckboxModule,
  OComboModule,
  OCurrencyInputModule,
  ODateInputModule,
  ODateRangeInputModule,
  OEmailInputModule,
  OPhoneInputModule,
  OFileInputModule,
  OHourInputModule,
  OHTMLInputModule,
  OIntegerInputModule,
  OListPickerModule,
  ONIFInputModule,
  OPasswordInputModule,
  OPercentInputModule,
  ORadioModule,
  ORealInputModule,
  OSearchInputModule,
  OSlideToggleModule,
  OTextInputModule,
  OTextareaInputModule,
  OTimeInputModule,

  OLanguageSelectorModule,
  OListModule,
  OTableModule,
  OUserInfoModule,

  OAppLayoutModule,
  OCardMenuLayoutModule,
  OFormLayoutManagerModule,
  OExpandableContainerModule,
  ODualListSelectorModule
];

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

