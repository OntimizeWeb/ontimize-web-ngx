import { TestBed } from '@angular/core/testing';
import { SnackBarService } from './snackbar.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('SnackBarService', () => {
  let service: SnackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        SnackBarService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(SnackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of SnackBarService', () => {
    expect(service).toBeInstanceOf(SnackBarService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
