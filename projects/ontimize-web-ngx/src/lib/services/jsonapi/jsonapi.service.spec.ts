import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JSONAPIService } from './jsonapi.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('JSONAPIService', () => {
  let service: JSONAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        JSONAPIService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(JSONAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of JSONAPIService', () => {
    expect(service).toBeInstanceOf(JSONAPIService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
