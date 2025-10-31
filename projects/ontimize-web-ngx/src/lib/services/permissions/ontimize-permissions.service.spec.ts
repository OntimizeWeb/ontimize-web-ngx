import { TestBed } from '@angular/core/testing';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizePermissionsService', () => {
  let service: OntimizePermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizePermissionsService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizePermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizePermissionsService', () => {
    expect(service).toBeInstanceOf(OntimizePermissionsService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
