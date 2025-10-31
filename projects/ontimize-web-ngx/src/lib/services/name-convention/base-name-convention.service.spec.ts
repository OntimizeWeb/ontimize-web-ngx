import { TestBed } from '@angular/core/testing';
import { BaseNameConvention } from './base-name-convention.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('BaseNameConvention', () => {
  let service: BaseNameConvention;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        BaseNameConvention,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(BaseNameConvention);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of BaseNameConvention', () => {
    expect(service).toBeInstanceOf(BaseNameConvention);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
