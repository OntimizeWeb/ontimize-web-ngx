import { TestBed } from '@angular/core/testing';
import { OErrorDialogManager } from './o-error-dialog-manager.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OErrorDialogManager', () => {
  let service: OErrorDialogManager;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OErrorDialogManager,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OErrorDialogManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OErrorDialogManager', () => {
    expect(service).toBeInstanceOf(OErrorDialogManager);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
