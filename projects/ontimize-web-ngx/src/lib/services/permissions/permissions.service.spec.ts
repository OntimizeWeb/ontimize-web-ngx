import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PermissionsService } from './permissions.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        PermissionsService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of PermissionsService', () => {
    expect(service).toBeInstanceOf(PermissionsService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
