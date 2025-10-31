import { TestBed } from '@angular/core/testing';
import { OFormLayoutManagerService } from './o-form-layout-manager.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OFormLayoutManagerService', () => {
  let service: OFormLayoutManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFormLayoutManagerService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OFormLayoutManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OFormLayoutManagerService', () => {
    expect(service).toBeInstanceOf(OFormLayoutManagerService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
