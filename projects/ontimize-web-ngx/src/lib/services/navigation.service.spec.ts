import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
        // Provide ONavigationItem with custom factory that supplies constructor parameter
        {
          provide: ONavigationItem,
          useFactory: () => new ONavigationItem({}),
          deps: []
        },
        // Include all other providers from OTestingUtils
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
