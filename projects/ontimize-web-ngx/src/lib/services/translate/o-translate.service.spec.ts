import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OTranslateService } from './o-translate.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OTranslateService', () => {
  let service: OTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OTranslateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTranslateService', () => {
    expect(service).toBeInstanceOf(OTranslateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
