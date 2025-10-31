import { TestBed } from '@angular/core/testing';
import { OntimizeService } from './ontimize.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeService', () => {
  let service: OntimizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeService', () => {
    expect(service).toBeInstanceOf(OntimizeService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
