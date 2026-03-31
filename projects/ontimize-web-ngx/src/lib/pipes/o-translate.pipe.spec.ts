import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { OTranslatePipe } from './o-translate.pipe';
import { OTranslateService } from '../services/translate/o-translate.service';

describe('OTranslatePipe', () => {
  let pipe: OTranslatePipe;
  let mockTranslateService: jasmine.SpyObj<OTranslateService>;
  let mockCdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    mockTranslateService = jasmine.createSpyObj('OTranslateService', ['get'], {
      onLanguageChanged: new EventEmitter<any>()
    });
    mockTranslateService.get.and.callFake((key: string) => `translated_${key}`);

    mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck']);

    const mockInjector = {
      get: (token: any) => {
        if (token === OTranslateService) return mockTranslateService;
        return mockCdr;
      }
    } as any;

    pipe = new OTranslatePipe(mockInjector);
  });

  afterEach(() => {
    pipe.ngOnDestroy();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });

    it('should have empty value initially', () => {
      expect(pipe.value).toBe('');
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should return empty text when input is empty string', () => {
      expect(pipe.transform('')).toBe('');
    });

    it('should return falsy text unchanged (null)', () => {
      expect(pipe.transform(null)).toBeNull();
    });

    it('should translate a key by calling oTranslateService.get', () => {
      const result = pipe.transform('GREETING');
      expect(mockTranslateService.get).toHaveBeenCalledWith('GREETING', []);
      expect(result).toBe('translated_GREETING');
    });

    it('should return the key itself when service returns undefined', () => {
      mockTranslateService.get.and.returnValue(undefined);
      const result = pipe.transform('MISSING_KEY');
      expect(result).toBe('MISSING_KEY');
    });

    it('should return cached value when called twice with the same key and args', () => {
      pipe.transform('GREETING');
      mockTranslateService.get.calls.reset();
      const result = pipe.transform('GREETING');
      expect(mockTranslateService.get).not.toHaveBeenCalled();
      expect(result).toBe('translated_GREETING');
    });

    it('should re-translate when the key changes', () => {
      pipe.transform('KEY_ONE');
      const result = pipe.transform('KEY_TWO');
      expect(result).toBe('translated_KEY_TWO');
    });

    it('should call markForCheck on the ChangeDetectorRef', () => {
      pipe.transform('GREETING');
      expect(mockCdr.markForCheck).toHaveBeenCalled();
    });

    it('should pass values array from args to the service', () => {
      pipe.transform('MSG', { values: ['Alice'] });
      expect(mockTranslateService.get).toHaveBeenCalledWith('MSG', ['Alice']);
    });
  });

  // --- updateValue() ---

  describe('Method: updateValue()', () => {
    it('should update this.value with the translated result', () => {
      pipe.updateValue('HELLO');
      expect(pipe.value).toBe('translated_HELLO');
    });
  });

  // --- ngOnDestroy() ---

  describe('Method: ngOnDestroy()', () => {
    it('should not throw when destroyed before subscribing', () => {
      expect(() => pipe.ngOnDestroy()).not.toThrow();
    });

    it('should unsubscribe from onLanguageChanged on destroy', () => {
      pipe.transform('HELLO');
      expect(() => pipe.ngOnDestroy()).not.toThrow();
      expect(pipe.onLanguageChanged).toBeUndefined();
    });
  });
});
