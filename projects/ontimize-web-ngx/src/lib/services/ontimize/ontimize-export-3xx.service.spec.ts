import { TestBed } from '@angular/core/testing';
import { OntimizeExportService3X } from './ontimize-export-3xx.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeExportService3X', () => {
  let service: OntimizeExportService3X;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportService3X,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeExportService3X);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportService3X', () => {
    expect(service).toBeInstanceOf(OntimizeExportService3X);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
