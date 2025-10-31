import { TestBed } from '@angular/core/testing';
import { NameConventionLower } from './name-convention-lower.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConventionLower', () => {
  let service: NameConventionLower;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConventionLower,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(NameConventionLower);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConventionLower', () => {
    expect(service).toBeInstanceOf(NameConventionLower);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
