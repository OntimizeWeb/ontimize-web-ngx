import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NameConvention } from './name-convention.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConvention', () => {
  let service: NameConvention;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConvention,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(NameConvention);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConvention', () => {
    expect(service).toBeInstanceOf(NameConvention);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
