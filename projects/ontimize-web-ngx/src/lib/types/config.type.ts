import { OExportConfiguration } from './export-configuration.type';
import { MenuRootItem } from './menu-root-item.type';
import { OntimizeEEPermissionsConfig } from './ontimize-ee-permissions-config.type';
import { OntimizePermissionsConfig } from './ontimize-permissions-config.type';
import { ORemoteConfiguration } from './remote-configuration.type';

export type Config = {
  // apiEndpoint [string]: The base path of the URL used by app services.
  apiEndpoint?: string;

  bundle?: {
    // endpoint [string]: The base path of the URL used by bundle service.
    endpoint?: string;
    // path [string]: The path of the URL to remote bundle method.
    path?: string;
  };

  /** Remote configuration storage parameter */
  remoteConfig?: ORemoteConfiguration;

  // startSessionPath [string]: The path of the URL to startsession method.
  startSessionPath?: string;

  // uuid [string]: Application identifier. Is the unique package identifier of the app. It is used when storing or managing temporal data related with the app. By default is set as 'ontimize-web-uuid'./
  uuid?: string;

  // title [string]: Title of the app. By default 'Ontimize Web App'.
  title: string;

  // locale [string][en|es]: Language of the application. By default 'en'
  locale?: string;

  // locale [string]: Location of application translation assets. Default 'assets/i18n/'
  assets?: {
    i18n?: {
      path?: string;
      extension?: string;
    }
    css?: string;
    images?: string;
    js?: string;
  };

  applicationLocales?: string[];
  defaultLocale?: string;

  // serviceType [ undefined | '' | class ]: The service type used (Ontimize REST standart, Ontimize REST JEE or custom implementation) in the whole application. By default 'undefined', that is, Ontimize REST standard service.
  serviceType?: any;

  // exportServiceType [ undefined | '' | class ]: The service used for exportation in the whole application. It shold implement `IExportService` interface. By default 'undefined' OntimizeExportService.
  exportServiceType?: any;

  // servicesConfiguration: [Object]: Configuration parameters of application services.
  servicesConfiguration?: object;

  // appMenuConfiguration?: MenuGroup[];
  appMenuConfiguration?: MenuRootItem[];

  // permissionsConfiguration [Object]: Configuration parameters of application permissions.
  permissionsConfiguration?: OntimizePermissionsConfig | OntimizeEEPermissionsConfig;

  // permissionsServiceType [ undefined | '' | class ]: The permissions service type used (Ontimize REST standart 'OntimizePermissions', Ontimize REST JEE 'OntimizeEEPermissions' or custom implementation) in the whole application. By default 'OntimizePermissions'.
  permissionsServiceType?: any;

  exportConfiguration?: OExportConfiguration,

  nameConvention?: 'upper' | 'lower' | 'database'
};
