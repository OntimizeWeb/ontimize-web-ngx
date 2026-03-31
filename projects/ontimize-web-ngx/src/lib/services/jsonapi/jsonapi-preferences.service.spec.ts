import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { JSONAPIPreferencesService } from './jsonapi-preferences.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('JSONAPIPreferencesService', () => {
  let service: JSONAPIPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        JSONAPIPreferencesService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(JSONAPIPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of JSONAPIPreferencesService', () => {
    expect(service).toBeInstanceOf(JSONAPIPreferencesService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
