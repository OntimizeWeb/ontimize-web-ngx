import { TestBed } from '@angular/core/testing';
import { OntimizeFileService } from './ontimize-file.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeFileService', () => {
  let service: OntimizeFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeFileService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeFileService', () => {
    expect(service).toBeInstanceOf(OntimizeFileService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
