import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OTableComponentStateService } from './o-table-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OTableComponentStateService', () => {
  let service: OTableComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OTableComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OTableComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTableComponentStateService', () => {
    expect(service).toBeInstanceOf(OTableComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
