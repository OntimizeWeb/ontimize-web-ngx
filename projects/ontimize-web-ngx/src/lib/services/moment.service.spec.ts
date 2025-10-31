import { TestBed } from '@angular/core/testing';
import { MomentService } from './moment.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('MomentService', () => {
  let service: MomentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        MomentService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(MomentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of MomentService', () => {
    expect(service).toBeInstanceOf(MomentService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
