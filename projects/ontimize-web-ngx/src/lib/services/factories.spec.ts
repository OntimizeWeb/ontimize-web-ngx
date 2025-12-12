import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import {
  O_AUTH_SERVICE,
  O_COMPONENT_STATE_SERVICE,
  O_DATA_SERVICE,
  O_EXPORT_DATA_SERVICE,
  O_EXPORT_SERVICE,
  O_FILE_SERVICE,
  O_LOCALSTORAGE_SERVICE,
  O_PERMISSION_SERVICE,
  O_RESPONSE_ADAPTER,
  O_REQUEST_ADAPTER
} from '../injection-tokens';
import { IExportDataProvider } from '../interfaces/export-data-provider.interface';
import { IExportService } from '../interfaces/export-service.interface';
import { IFileService } from '../interfaces/file-service.interface';
import { ILocalStorageService } from '../interfaces/local-service.interface';
import { INameConvention } from '../interfaces/name-convention.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { IPreferencesService } from '../interfaces/prefereces-service.interface';
import { IServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { Util } from '../util/util';
import { FactoryUtil } from '../util/factory.util';
import { AuthService } from './auth.service';
import { BaseServiceResponse } from './base-service-response.class';
import { JSONAPIPreferencesService } from './jsonapi/jsonapi-preferences.service';
import { JSONAPIServiceResponseAdapter } from './jsonapi/jsonapi-service-response.adapter';
import { LocalStorageService } from './local-storage.service';
import { NameConventionLower } from './name-convention/name-convention-lower.service';
import { NameConventionUpper } from './name-convention/name-convention-upper.service';
import { NameConvention } from './name-convention/name-convention.service';
import { OntimizeAuthService } from './o-auth.service';
import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OntimizeExportDataProviderService } from './ontimize-export-data-provider.service';
import { OntimizeExportService3X } from './ontimize/ontimize-export-3xx.service';
import { OntimizeExportService } from './ontimize/ontimize-export.service';
import { OntimizeFileService } from './ontimize/ontimize-file.service';
import { OntimizePreferencesService } from './ontimize/ontimize-preferences.service';
import { OntimizeServiceResponseAdapter } from './ontimize/ontimize-service-response.adapter';
import { OntimizeService } from './ontimize/ontimize.service';
import { OntimizeEEPermissionsService } from './permissions/ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './permissions/ontimize-permissions.service';
import { IBaseRequestArgument } from './request-adapter/base-request-argument.interface';
import { JSONAPIRequestArgumentsAdapter } from './request-adapter/jsonapi-request-arguments.adapter';
import { OntimizeRequestArgumentsAdapter } from './request-adapter/ontimize-request-arguments.adapter';
import { AbstractComponentStateService, DefaultComponentStateService } from './state/o-component-state.service';
import { BaseRequestArgument } from './request-adapter/base-request-argument.adapter';
import { BaseServiceResponseAdapter } from './base-service-response.adapter';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

import {
  dataServiceFactory,
  createServiceInstance,
  fileServiceFactory,
  localStorageServiceFactory,
  exportServiceFactory,
  exportDataFactory,
  serviceRequestAdapterFactory,
  serviceResponseAdapterFactory,
  permissionsServiceFactory,
  preferencesServiceFactory,
  authServiceFactory,
  componentStateFactory,
  nameConventionServiceFactory
} from './factories';

describe('Factories', () => {
  let injector: Injector;
  let mockAppConfig: jasmine.SpyObj<AppConfig>;

  beforeEach(() => {
    const configSpy = jasmine.createSpyObj('AppConfig', ['getConfiguration']);
    
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        { provide: AppConfig, useValue: configSpy },
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });

    injector = TestBed.inject(Injector);
    mockAppConfig = TestBed.inject(AppConfig) as jasmine.SpyObj<AppConfig>;
    
    // Set default return value to prevent undefined returnValue errors
    mockAppConfig.getConfiguration.and.returnValue(createMockConfig());
  });

  // Helper function to create mock configuration
  function createMockConfig(overrides: any = {}): any {
    return {
      uuid: 'com.ontimize.web.test',
      title: 'Ontimize Web Testing',
      locale: 'en',
      ...overrides
    };
  }

  describe('dataServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
      spyOn(FactoryUtil, 'createServiceInstanceByType').and.returnValue(new OntimizeService(injector));
    });

    it('should return custom service when injection token is defined', () => {
      const customService = new OntimizeService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = dataServiceFactory(injector);

      expect(result).toBe(customService);
    });

    it('should create service by type when no custom service', () => {
      const defaultService = new OntimizeService(injector);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'ontimize' }));

      const result = dataServiceFactory(injector);

      expect(FactoryUtil.createServiceInstanceByType).toHaveBeenCalled();
      expect(result).toBeInstanceOf(OntimizeService);
    });

    it('should handle undefined service type', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = dataServiceFactory(injector);

      expect(FactoryUtil.createServiceInstanceByType).toHaveBeenCalledWith(undefined, injector);
    });
  });

  describe('createServiceInstance', () => {
    it('should delegate to Util.createServiceInstance', () => {
      const serviceClass = OntimizeService;
      const expectedResult = new OntimizeService(injector);
      spyOn(Util, 'createServiceInstance').and.returnValue(expectedResult);

      const result = createServiceInstance(serviceClass, injector);

      expect(Util.createServiceInstance).toHaveBeenCalledWith(serviceClass, injector);
      expect(result).toBe(expectedResult);
    });
  });

  describe('fileServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom file service when defined', () => {
      const customFileService = new OntimizeFileService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customFileService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = fileServiceFactory(injector);

      expect(result).toBe(customFileService);
    });

    it('should return default OntimizeFileService when no custom service', () => {
      const result = fileServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeFileService);
    });
  });

  describe('localStorageServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom local storage service when defined', () => {
      const customService = new LocalStorageService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = localStorageServiceFactory(injector);

      expect(result).toBe(customService);
    });

    it('should return default LocalStorageService when no custom service', () => {
      const result = localStorageServiceFactory(injector);

      expect(result).toBeInstanceOf(LocalStorageService);
    });
  });

  describe('exportServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom export service when defined', () => {
      const customService = new OntimizeExportService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = exportServiceFactory(injector);

      expect(result).toBe(customService);
    });

    it('should return OntimizeExportService3X when exportConfiguration is defined', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        exportConfiguration: { path: '/export' } 
      }));

      const result = exportServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeExportService3X);
    });

    it('should return OntimizeExportService when no exportConfiguration', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = exportServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeExportService);
    });

    it('should use custom exportServiceType when defined', () => {
      const customServiceType = OntimizeExportService3X;
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        exportServiceType: customServiceType 
      }));
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(new OntimizeExportService3X(injector));

      const result = exportServiceFactory(injector);

      expect(Util.createServiceInstance).toHaveBeenCalledWith(customServiceType, injector);
    });
  });

  describe('exportDataFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom export data provider when defined', () => {
      const customProvider = new OntimizeExportDataProviderService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customProvider);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = exportDataFactory(injector);

      expect(result).toBe(customProvider);
    });

    it('should return OntimizeExportDataProviderService3X when exportConfiguration is defined', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        exportConfiguration: { path: '/export' } 
      }));

      const result = exportDataFactory(injector);

      expect(result).toBeInstanceOf(OntimizeExportDataProviderService3X);
    });

    it('should return OntimizeExportDataProviderService when no exportConfiguration', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = exportDataFactory(injector);

      expect(result).toBeInstanceOf(OntimizeExportDataProviderService);
    });
  });

  describe('serviceRequestAdapterFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
      spyOn(FactoryUtil, 'isOntimizeEEService').and.returnValue(false);
      spyOn(FactoryUtil, 'isJsonApiService').and.returnValue(false);
    });

    it('should return custom request adapter when defined', () => {
      const customAdapter = new OntimizeRequestArgumentsAdapter();
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customAdapter);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = serviceRequestAdapterFactory(injector);

      expect(result).toBe(customAdapter);
    });

    it('should return OntimizeRequestArgumentsAdapter for OntimizeEE service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'ontimize-ee' }));

      const result = serviceRequestAdapterFactory(injector);

      expect(result).toBeInstanceOf(OntimizeRequestArgumentsAdapter);
    });

    it('should return JSONAPIRequestArgumentsAdapter for JsonApi service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(true);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'jsonapi' }));

      const result = serviceRequestAdapterFactory(injector);

      expect(result).toBeInstanceOf(JSONAPIRequestArgumentsAdapter);
    });

    it('should return BaseRequestArgument as fallback', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'unknown' }));

      const result = serviceRequestAdapterFactory(injector);

      expect(result).toBeInstanceOf(BaseRequestArgument);
    });

    it('should return OntimizeRequestArgumentsAdapter when serviceType is undefined', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = serviceRequestAdapterFactory(injector);

      expect(result).toBeInstanceOf(OntimizeRequestArgumentsAdapter);
    });
  });

  describe('serviceResponseAdapterFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
      spyOn(FactoryUtil, 'isOntimizeEEService').and.returnValue(false);
      spyOn(FactoryUtil, 'isJsonApiService').and.returnValue(false);
    });

    it('should return custom response adapter when defined', () => {
      const customAdapter = new OntimizeServiceResponseAdapter();
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customAdapter);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = serviceResponseAdapterFactory(injector);

      expect(result).toBe(customAdapter);
    });

    it('should return OntimizeServiceResponseAdapter for OntimizeEE service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'ontimize-ee' }));

      const result = serviceResponseAdapterFactory(injector);

      expect(result).toBeInstanceOf(OntimizeServiceResponseAdapter);
    });

    it('should return JSONAPIServiceResponseAdapter for JsonApi service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(true);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'jsonapi' }));

      const result = serviceResponseAdapterFactory(injector);

      expect(result).toBeInstanceOf(JSONAPIServiceResponseAdapter);
    });

    it('should return BaseServiceResponseAdapter as fallback', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'unknown' }));

      const result = serviceResponseAdapterFactory(injector);

      expect(result).toBeInstanceOf(BaseServiceResponseAdapter);
    });

    it('should return OntimizeServiceResponseAdapter when serviceType is undefined', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = serviceResponseAdapterFactory(injector);

      expect(result).toBeInstanceOf(OntimizeServiceResponseAdapter);
    });
  });

  describe('permissionsServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom permissions service when defined', () => {
      const customService = new OntimizeEEPermissionsService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = permissionsServiceFactory(injector);

      expect(result).toBe(customService);
    });

    it('should return OntimizeEEPermissionsService when permissionsServiceType is undefined', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = permissionsServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeEEPermissionsService);
    });

    it('should return OntimizeEEPermissionsService when permissionsServiceType is "OntimizeEEPermissions"', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        permissionsServiceType: 'OntimizeEEPermissions' 
      }));

      const result = permissionsServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeEEPermissionsService);
    });

    it('should return OntimizePermissionsService when permissionsServiceType is "OntimizePermissions"', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        permissionsServiceType: 'OntimizePermissions' 
      }));

      const result = permissionsServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizePermissionsService);
    });

    it('should create custom service instance for custom permissionsServiceType', () => {
      const customServiceType = OntimizePermissionsService;
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        permissionsServiceType: customServiceType 
      }));
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(new OntimizePermissionsService(injector));

      const result = permissionsServiceFactory(injector);

      expect(Util.createServiceInstance).toHaveBeenCalledWith(customServiceType, injector);
    });
  });

  describe('preferencesServiceFactory', () => {
    beforeEach(() => {
      spyOn(FactoryUtil, 'isOntimizeEEService').and.returnValue(false);
      spyOn(FactoryUtil, 'isJsonApiService').and.returnValue(false);
    });

    it('should return OntimizePreferencesService for OntimizeEE service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'ontimize-ee' }));

      const result = preferencesServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizePreferencesService);
    });

    it('should return JSONAPIPreferencesService for JsonApi service', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(true);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'jsonapi' }));

      const result = preferencesServiceFactory(injector);

      expect(result).toBeInstanceOf(JSONAPIPreferencesService);
    });

    it('should return JSONAPIPreferencesService as fallback', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(false);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ serviceType: 'unknown' }));

      const result = preferencesServiceFactory(injector);

      expect(result).toBeInstanceOf(JSONAPIPreferencesService);
    });

    it('should return OntimizePreferencesService when serviceType is undefined', () => {
      (FactoryUtil.isOntimizeEEService as jasmine.Spy).and.returnValue(true);
      (FactoryUtil.isJsonApiService as jasmine.Spy).and.returnValue(false);
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = preferencesServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizePreferencesService);
    });
  });

  describe('authServiceFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom auth service when defined', () => {
      const customService = new OntimizeAuthService(injector);
      (Util.createServiceInstance as jasmine.Spy).and.returnValue(customService);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);

      const result = authServiceFactory(injector);

      expect(result).toBe(customService);
    });

    it('should return default OntimizeAuthService when no custom service', () => {
      const result = authServiceFactory(injector);

      expect(result).toBeInstanceOf(OntimizeAuthService);
    });
  });

  describe('componentStateFactory', () => {
    beforeEach(() => {
      spyOn(Util, 'isDefined').and.returnValue(false);
    });

    it('should return custom component state service when defined', () => {
      const customService = new DefaultComponentStateService(injector);
      (Util.isDefined as jasmine.Spy).and.returnValue(true);
      spyOn(injector, 'get').and.returnValue(customService);

      const result = componentStateFactory(injector);

      expect(result).toBe(customService);
    });

    it('should return DefaultComponentStateService when no custom service', () => {
      const result = componentStateFactory(injector);

      expect(result).toBeInstanceOf(DefaultComponentStateService);
    });
  });

  describe('nameConventionServiceFactory', () => {
    it('should return NameConventionLower when nameConvention is "lower"', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        nameConvention: 'lower' 
      }));

      const result = nameConventionServiceFactory(injector);

      expect(result).toBeInstanceOf(NameConventionLower);
    });

    it('should return NameConventionUpper when nameConvention is "upper"', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        nameConvention: 'upper' 
      }));

      const result = nameConventionServiceFactory(injector);

      expect(result).toBeInstanceOf(NameConventionUpper);
    });

    it('should return default NameConvention when nameConvention is undefined', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      const result = nameConventionServiceFactory(injector);

      expect(result).toBeInstanceOf(NameConvention);
    });

    it('should return default NameConvention when nameConvention is unknown', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({ 
        nameConvention: 'unknown' 
      }));

      const result = nameConventionServiceFactory(injector);

      expect(result).toBeInstanceOf(NameConvention);
    });

    it('should handle null config gracefully', () => {
      mockAppConfig.getConfiguration.and.returnValue(null);

      const result = nameConventionServiceFactory(injector);

      expect(result).toBeInstanceOf(NameConvention);
    });
  });

  describe('Integration tests', () => {
    beforeEach(() => {
      spyOn(Util, 'createServiceInstance').and.returnValue(null);
      spyOn(Util, 'isDefined').and.returnValue(false);
      spyOn(FactoryUtil, 'createServiceInstanceByType').and.returnValue(new OntimizeService(injector));
      spyOn(FactoryUtil, 'isOntimizeEEService').and.returnValue(false);
      spyOn(FactoryUtil, 'isJsonApiService').and.returnValue(false);
    });

    it('should handle all factory functions without errors', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({
        serviceType: 'ontimize',
        permissionsServiceType: 'OntimizeEEPermissions',
        nameConvention: 'lower'
      }));

      // Test that all factory functions can be called without throwing errors
      expect(() => dataServiceFactory(injector)).not.toThrow();
      expect(() => createServiceInstance(OntimizeService, injector)).not.toThrow();
      expect(() => fileServiceFactory(injector)).not.toThrow();
      expect(() => localStorageServiceFactory(injector)).not.toThrow();
      expect(() => exportServiceFactory(injector)).not.toThrow();
      expect(() => exportDataFactory(injector)).not.toThrow();
      expect(() => serviceRequestAdapterFactory(injector)).not.toThrow();
      expect(() => serviceResponseAdapterFactory(injector)).not.toThrow();
      expect(() => permissionsServiceFactory(injector)).not.toThrow();
      expect(() => preferencesServiceFactory(injector)).not.toThrow();
      expect(() => authServiceFactory(injector)).not.toThrow();
      expect(() => componentStateFactory(injector)).not.toThrow();
      expect(() => nameConventionServiceFactory(injector)).not.toThrow();
    });

    it('should handle factory calls with minimal configuration', () => {
      mockAppConfig.getConfiguration.and.returnValue(createMockConfig({}));

      // Verify factories work with empty configuration
      const dataService = dataServiceFactory(injector);
      const fileService = fileServiceFactory(injector);
      const localStorageService = localStorageServiceFactory(injector);
      const exportService = exportServiceFactory(injector);

      expect(dataService).toBeDefined();
      expect(fileService).toBeDefined();
      expect(localStorageService).toBeDefined();
      expect(exportService).toBeDefined();
    });
  });
});