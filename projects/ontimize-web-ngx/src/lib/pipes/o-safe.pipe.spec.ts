import { TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { OSafePipe } from './o-safe.pipe';

describe('OSafePipe', () => {
  let pipe: OSafePipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule]
    });
    sanitizer = TestBed.inject(DomSanitizer);
    const mockInjector = { get: (token: any) => sanitizer } as any;
    pipe = new OSafePipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should call bypassSecurityTrustHtml for type "html"', () => {
      spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
      pipe.transform('<b>bold</b>', 'html');
      expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('<b>bold</b>');
    });

    it('should call bypassSecurityTrustUrl for type "url"', () => {
      spyOn(sanitizer, 'bypassSecurityTrustUrl').and.callThrough();
      pipe.transform('https://example.com', 'url');
      expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('https://example.com');
    });

    it('should call bypassSecurityTrustResourceUrl for type "resourceUrl"', () => {
      spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();
      pipe.transform('https://example.com/embed', 'resourceUrl');
      expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('https://example.com/embed');
    });

    it('should throw an error for an unknown type', () => {
      expect(() => pipe.transform('value', 'script')).toThrowError('Invalid safe type specified: script');
    });

    it('should return a SafeHtml object for html type', () => {
      const result = pipe.transform('<i>italic</i>', 'html');
      expect(result).toBeTruthy();
    });
  });
});
