import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OntimizeExportService } from './ontimize-export.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeExportService', () => {
  let service: OntimizeExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportService', () => {
    expect(service).toBeInstanceOf(OntimizeExportService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
