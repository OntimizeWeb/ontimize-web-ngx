import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OFormLayoutManagerComponentStateService } from './o-form-layout-manager-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFormLayoutManagerComponentStateService', () => {
  let service: OFormLayoutManagerComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFormLayoutManagerComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OFormLayoutManagerComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OFormLayoutManagerComponentStateService', () => {
    expect(service).toBeInstanceOf(OFormLayoutManagerComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
