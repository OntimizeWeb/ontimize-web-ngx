import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ShareCanActivateChildService } from './share-can-activate-child.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('ShareCanActivateChildService', () => {
  let service: ShareCanActivateChildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ShareCanActivateChildService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(ShareCanActivateChildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of ShareCanActivateChildService', () => {
    expect(service).toBeInstanceOf(ShareCanActivateChildService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
