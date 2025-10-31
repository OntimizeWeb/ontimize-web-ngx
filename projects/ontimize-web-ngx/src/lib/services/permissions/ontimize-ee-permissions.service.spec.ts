import { TestBed } from '@angular/core/testing';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeEEPermissionsService', () => {
  let service: OntimizeEEPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeEEPermissionsService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeEEPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeEEPermissionsService', () => {
    expect(service).toBeInstanceOf(OntimizeEEPermissionsService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
