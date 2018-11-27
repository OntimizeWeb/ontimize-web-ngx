import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateParser } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injector, NgModule, APP_INITIALIZER } from '@angular/core';
import { appInitializerFactory } from './o-providers';
import { OTranslateService, OTranslateHttpLoader } from '../services';
import { APP_CONFIG, AppConfig } from '../config/app-config';

import {
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
  OContextMenuModule,
  ORowModule,
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
  OUserInfoModule,
  OLanguageSelectorModule,
  OCardMenuItemModule,
  OHourInputModule,
  OTimeInputModule,
  OGridModule,
  ORadioModule,
  OSlideToggleModule,
  OSliderModule
} from '../components';

import {
  OAppLayoutModule,
  OFormLayoutManagerModule,
  OCardMenuLayoutModule
} from '../layouts';

import { OSharedModule } from '../shared';
import { OTranslateParser } from '../services/translate/o-translate.parser';
import { Util } from '../utils';

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
  OContextMenuModule,
  ORowModule,
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
  OSliderModule
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
  OContextMenuModule,
  ORowModule,
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
  OSlideToggleModule
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
  OntimizeWebTranslateModule
];
