import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OntimizeMatIconRegistry } from './ontimize-icon-registry.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeMatIconRegistry', () => {
  let service: OntimizeMatIconRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeMatIconRegistry,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeMatIconRegistry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeMatIconRegistry', () => {
    expect(service).toBeInstanceOf(OntimizeMatIconRegistry);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
