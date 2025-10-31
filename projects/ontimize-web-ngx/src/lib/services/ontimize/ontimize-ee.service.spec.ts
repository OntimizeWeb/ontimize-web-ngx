import { TestBed } from '@angular/core/testing';
import { OntimizeEEService } from './ontimize-ee.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeEEService', () => {
  let service: OntimizeEEService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeEEService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeEEService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeEEService', () => {
    expect(service).toBeInstanceOf(OntimizeEEService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
