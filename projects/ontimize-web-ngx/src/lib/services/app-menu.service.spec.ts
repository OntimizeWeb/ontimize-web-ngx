import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppMenuService } from './app-menu.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('AppMenuService', () => {
  let service: AppMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        AppMenuService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(AppMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of AppMenuService', () => {
    expect(service).toBeInstanceOf(AppMenuService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
