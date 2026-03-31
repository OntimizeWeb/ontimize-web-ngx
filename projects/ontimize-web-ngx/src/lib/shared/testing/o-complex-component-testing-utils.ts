import { Subject } from 'rxjs';

// Import base testing utils
import { OTestingUtils } from './o-testing-utils';

// Import complex component specific services
import { OTableComponentStateService } from '../../services/state/o-table-component-state.service';
import { OListComponentStateService } from '../../services/state/o-list-component-state.service';
import { OGridComponentStateService } from '../../services/state/o-grid-component-state.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { OUserInfoService } from '../../services/o-user-info.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { IconService } from '../../services/icon.service';

/**
 * Specialized testing utilities for complex Ontimize components (Table, List, Grid)
 * These components have additional dependencies that might break simpler component tests
 */
export class OComplexComponentTestingUtils extends OTestingUtils {

  /**
   * Get testing module configuration specifically for complex components (Table, List, Grid)
   * Includes all base providers plus complex component specific services
   */
  static getComplexComponentTestingModuleConfig() {
    const baseConfig = OTestingUtils.getCommonTestingModuleConfig();
    
    return {
      imports: [
        ...baseConfig.imports
      ],
      providers: [
        ...baseConfig.providers,
        // Additional providers for complex components
        {
          provide: OTableComponentStateService,
          useClass: OTableComponentStateService
        },
        {
          provide: OListComponentStateService,
          useClass: OListComponentStateService
        },
        {
          provide: OGridComponentStateService,
          useClass: OGridComponentStateService
        },
        // Additional complex component services
        {
          provide: OntimizeService,
          useClass: OntimizeService
        },
        {
          provide: OUserInfoService,
          useClass: OUserInfoService
        },
        {
          provide: OModulesInfoService,
          useClass: OModulesInfoService
        },
        {
          provide: IconService,
          useClass: IconService
        }
      ]
    };
  }

  /**
   * Create mock for complex component state service
   */
  static createMockComplexComponentStateService(): jasmine.SpyObj<any> {
    return jasmine.createSpyObj('ComplexComponentStateService', [
      'initialize',
      'getState',
      'setState',
      'initializeState',
      'getSelectionState',
      'setSelectionState',
      'getFilterState',
      'setFilterState'
    ]);
  }

  /**
   * Create mock for table specific services
   */
  static createMockTableServices() {
    return {
      mockStateService: OComplexComponentTestingUtils.createMockComplexComponentStateService(),
      mockExportService: jasmine.createSpyObj('OTableExportButtonService', [], {
        export$: new Subject<string>()
      }),
      mockVirtualScrollStrategy: jasmine.createSpyObj('OTableVirtualScrollStrategy', [
        'attach',
        'detach',
        'scrolledIndexChange',
        'renderedRangeChange'
      ])
    };
  }

  /**
   * Create mock for list specific services
   */
  static createMockListServices() {
    return {
      mockStateService: OComplexComponentTestingUtils.createMockComplexComponentStateService()
    };
  }

  /**
   * Create mock for grid specific services
   */
  static createMockGridServices() {
    return OComplexComponentTestingUtils.createMockListServices();
  }
}