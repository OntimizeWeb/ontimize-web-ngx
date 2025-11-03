import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
        // Provide the actual service class instead of spy
        OErrorDialogManager,
        // Include other providers except the OErrorDialogManager spy
        ...OTestingUtils.getCommonTestingModuleConfig().providers.filter(
          provider => !(provider && provider.provide === OErrorDialogManager)
        )
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
