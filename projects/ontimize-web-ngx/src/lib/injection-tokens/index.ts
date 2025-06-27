/* ----------------------------------------------------------------------------------------------------
 * ----------------------------------------- INJECTION TOKENS -----------------------------------------
 * ---------------------------------------------------------------------------------------------------- */

import { InjectionToken } from "@angular/core";
import { IServiceResponseAdapter } from "../interfaces/service-response-adapter.interface";
import { BaseServiceResponse } from "../services/base-service-response.class";
import { IFileService } from "../interfaces/file-service.interface";
import { ILocalStorageService } from "../interfaces/local-service.interface";
import { IExportService } from "../interfaces/export-service.interface";
import { IPermissionsService } from "../interfaces/permissions-service.interface";
import { DefaultComponentStateService } from "../services/state/o-component-state.service";
import { IChartOnDemandService } from "../interfaces/chart-on-demand.interface";
import { IReportService } from "../interfaces/report-on-demand-service.interface";
import { OErrorDialogManager } from "../services/o-error-dialog-manager.service";
import { OMatErrorOptions } from "../types/o-mat-error.type";
import { IExportDataProvider } from "../interfaces/export-data-provider.interface";
import { IAuthService } from "../interfaces/auth-service.interface";
import { IBaseRequestArgument } from "../services/request-adapter";
import { IFilterManagerService } from "../interfaces/filter-manager.interface";


/**
 * Injection token that can be used to replace the data service `OntimizeService` or `OntimizeEEService`.
 */
export const O_DATA_SERVICE = new InjectionToken('Ontimize data service');

export const O_RESPONSE_ADAPTER = new InjectionToken<IServiceResponseAdapter<BaseServiceResponse>>('Service response adapter');

export const O_REQUEST_ADAPTER = new InjectionToken<IBaseRequestArgument>('Service request adapter');

/**
 * Injection token that can be used to replace the translate service `OTranslateService`.
 */
export const O_TRANSLATE_SERVICE = new InjectionToken('Translate service');

/**
 * Injection token that can be used to replace the file service `OntimizeFileService`.
 */
export const O_FILE_SERVICE = new InjectionToken<IFileService>('File uploader service');

/**
 * Injection token that can be used to replace the localstorage service `LocalStorageService`.
 */
export const O_LOCALSTORAGE_SERVICE = new InjectionToken<ILocalStorageService>('Local storage service');

/**
 * Injection token that can be used to replace the exportation service `OntimizeExportService`.
 */
export const O_EXPORT_SERVICE = new InjectionToken<IExportService>('Export service');

/**
 * Injection token that can be used to replace the permission service `OntimizePermissionsService or OntimizeEEPermissionsService`.
 */
export const O_PERMISSION_SERVICE = new InjectionToken<IPermissionsService>('Permission service');

/**
 * Injection token that can be used to replace the authentication service `AuthService`.
 */
export const O_AUTH_SERVICE = new InjectionToken<IAuthService>('Authentication service');

/**
* Injection token that can be used to replace the component state service `DefaultComponentStateService`.
*/
export const O_COMPONENT_STATE_SERVICE = new InjectionToken<DefaultComponentStateService>('Component state service');

export const O_FILTER_MANAGER_SERVICE = new InjectionToken<IFilterManagerService>('o-table filter service');

/**
* Injection token that can be used to replace the component state service `DefaultComponentStateService`.
*/
export const O_CHART_ON_DEMAND_SERVICE = new InjectionToken<IChartOnDemandService>('Chart on demand service');

export const O_REPORT_SERVICE = new InjectionToken<IReportService>('Report service');

export const O_ERROR_DIALOG_MANAGER = new InjectionToken<OErrorDialogManager>('Error dialog manager');

export const O_EXPORT_DATA_SERVICE = new InjectionToken<IExportDataProvider>('Export data provider');

export const O_MAT_ERROR_OPTIONS = new InjectionToken<OMatErrorOptions>('o-mat-error-options');

export const O_FORM_MESSAGE_SERVICE = new InjectionToken('Ontimize o-form message service');
