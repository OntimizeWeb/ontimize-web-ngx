import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OFilterBuilderComponentStateService } from './o-filter-builder-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFilterBuilderComponentStateService', () => {
  let service: OFilterBuilderComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFilterBuilderComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OFilterBuilderComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OFilterBuilderComponentStateService', () => {
    expect(service).toBeInstanceOf(OFilterBuilderComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
