import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DefaultComponentStateService } from './o-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('DefaultComponentStateService', () => {
  let service: DefaultComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        DefaultComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(DefaultComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of DefaultComponentStateService', () => {
    expect(service).toBeInstanceOf(DefaultComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
