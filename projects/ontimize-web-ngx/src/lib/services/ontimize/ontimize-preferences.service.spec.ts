import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OntimizePreferencesService } from './ontimize-preferences.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizePreferencesService', () => {
  let service: OntimizePreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizePreferencesService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizePreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizePreferencesService', () => {
    expect(service).toBeInstanceOf(OntimizePreferencesService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
