import { TestBed } from '@angular/core/testing';
import { IconService } from './icon.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        IconService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of IconService', () => {
    expect(service).toBeInstanceOf(IconService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
