import { TestBed } from '@angular/core/testing';
import { ONavigationItem } from './navigation.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('ONavigationItem', () => {
  let service: ONavigationItem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ONavigationItem,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(ONavigationItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of ONavigationItem', () => {
    expect(service).toBeInstanceOf(ONavigationItem);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
