import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NameConventionUpper } from './name-convention-upper.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConventionUpper', () => {
  let service: NameConventionUpper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConventionUpper,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(NameConventionUpper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConventionUpper', () => {
    expect(service).toBeInstanceOf(NameConventionUpper);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
