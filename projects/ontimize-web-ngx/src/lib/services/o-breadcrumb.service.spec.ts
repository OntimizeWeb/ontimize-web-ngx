import { TestBed } from '@angular/core/testing';
import { OBreadcrumbService } from './o-breadcrumb.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OBreadcrumbService', () => {
  let service: OBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OBreadcrumbService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OBreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OBreadcrumbService', () => {
    expect(service).toBeInstanceOf(OBreadcrumbService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
