import { TestBed } from '@angular/core/testing';
import { OntimizeAuthService } from './o-auth.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeAuthService', () => {
  let service: OntimizeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeAuthService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeAuthService', () => {
    expect(service).toBeInstanceOf(OntimizeAuthService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
