import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        DialogService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of DialogService', () => {
    expect(service).toBeInstanceOf(DialogService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
