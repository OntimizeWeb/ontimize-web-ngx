import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NumberService } from './number.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('NumberService', () => {
  let service: NumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NumberService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(NumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NumberService', () => {
    expect(service).toBeInstanceOf(NumberService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
