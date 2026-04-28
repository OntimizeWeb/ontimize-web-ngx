import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Subscriber } from 'rxjs';

import { AppConfig } from '../../config/app-config';
import { OntimizeServiceResponseParser } from './o-service-response.parser';
import { NameConvention } from '../name-convention/name-convention.service';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeResponse(overrides: Partial<{
  successful: boolean;
  failed: boolean;
  unauthorized: boolean;
  data: any;
  message: string;
}>): any {
  return {
    isSuccessful: () => !!overrides.successful,
    isFailed: () => !!overrides.failed,
    isUnauthorized: () => !!overrides.unauthorized,
    data: overrides.data ?? null,
    message: overrides.message ?? ''
  };
}

function makeService(): any {
  return {
    clientErrorFallback: jasmine.createSpy('clientErrorFallback'),
    serverErrorFallback: jasmine.createSpy('serverErrorFallback')
  };
}

function makeSubscriber(): jasmine.SpyObj<Subscriber<any>> {
  return jasmine.createSpyObj<Subscriber<any>>('Subscriber', ['next', 'error']);
}

// ─────────────────────────────────────────────────────────────────────────────

describe('OntimizeServiceResponseParser', () => {
  let parser: OntimizeServiceResponseParser<any>;
  let nameConvention: NameConvention;

  beforeEach(() => {
    nameConvention = new NameConvention();

    TestBed.configureTestingModule({
      providers: [
        OntimizeServiceResponseParser,
        { provide: NameConvention, useValue: nameConvention },
        { provide: AppConfig, useValue: {} },
      ]
    });

    parser = TestBed.inject(OntimizeServiceResponseParser);
  });

  // ─── Creation ──────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should be created', () => {
      expect(parser).toBeTruthy();
    });

    it('should have appConfig defined', () => {
      expect((parser as any).appConfig).toBeDefined();
    });

    it('should have nameConvention defined', () => {
      expect((parser as any).nameConvention).toBe(nameConvention);
    });
  });

  // ─── parseSuccessfulResponse() ─────────────────────────────────────────────

  describe('Method: parseSuccessfulResponse()', () => {
    it('should call clientErrorFallback(401) when response is unauthorized', () => {
      const resp = makeResponse({ unauthorized: true });
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(service.clientErrorFallback).toHaveBeenCalledWith(401);
      expect(subscriber.next).not.toHaveBeenCalled();
      expect(subscriber.error).not.toHaveBeenCalled();
    });

    it('should call subscriber.error with message when response isFailed', () => {
      const resp = makeResponse({ failed: true, message: 'Something went wrong' });
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(subscriber.error).toHaveBeenCalledWith('Something went wrong');
      expect(subscriber.next).not.toHaveBeenCalled();
    });

    it('should call subscriber.next when response isSuccessful', () => {
      const resp = makeResponse({ successful: true, data: [{ id: 1 }] });
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(subscriber.next).toHaveBeenCalledWith(resp);
      expect(subscriber.error).not.toHaveBeenCalled();
    });

    it('should call parseData before notifying subscriber on success', () => {
      const resp = makeResponse({ successful: true, data: [{ id: 1 }] });
      const subscriber = makeSubscriber();
      const service = makeService();
      spyOn(nameConvention, 'parseResultToNameConvention').and.callThrough();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(nameConvention.parseResultToNameConvention).toHaveBeenCalled();
    });

    it('should call subscriber.error with "Service unavailable" for unknown state', () => {
      const resp = makeResponse({}); // all flags false
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(subscriber.error).toHaveBeenCalledWith('Service unavailable');
      expect(subscriber.next).not.toHaveBeenCalled();
    });

    it('should prioritise unauthorized over failed when both are true', () => {
      const resp = makeResponse({ unauthorized: true, failed: true });
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseSuccessfulResponse(resp, subscriber, service);

      expect(service.clientErrorFallback).toHaveBeenCalledWith(401);
      expect(subscriber.error).not.toHaveBeenCalled();
    });

    it('should handle null response without throwing', () => {
      const subscriber = makeSubscriber();
      const service = makeService();

      expect(() => parser.parseSuccessfulResponse(null, subscriber, service)).not.toThrow();
      expect(subscriber.error).toHaveBeenCalledWith('Service unavailable');
    });
  });

  // ─── parseData() ───────────────────────────────────────────────────────────

  describe('Method: parseData()', () => {
    it('should return the same primitive value unchanged', () => {
      expect(parser.parseData('hello')).toBe('hello');
      expect(parser.parseData(42)).toBe(42);
      expect(parser.parseData(null)).toBeNull();
    });

    it('should call parseResultToNameConvention for each element in an array', () => {
      spyOn(nameConvention, 'parseResultToNameConvention').and.callThrough();
      const data = [{ a: 1 }, { b: 2 }];

      parser.parseData(data);

      expect(nameConvention.parseResultToNameConvention).toHaveBeenCalledTimes(2);
    });

    it('should map each array element through nameConvention', () => {
      spyOn(nameConvention, 'parseResultToNameConvention').and.callFake((d: any) => ({ ...d, _parsed: true }));
      const result = parser.parseData([{ id: 1 }, { id: 2 }]);

      expect(result[0]._parsed).toBe(true);
      expect(result[1]._parsed).toBe(true);
    });

    it('should call parseResultToNameConvention for a plain object', () => {
      spyOn(nameConvention, 'parseResultToNameConvention').and.callThrough();
      parser.parseData({ key: 'value' });

      expect(nameConvention.parseResultToNameConvention).toHaveBeenCalledWith({ key: 'value' });
    });

    it('should return nameConvention-transformed object', () => {
      spyOn(nameConvention, 'parseResultToNameConvention').and.returnValue({ transformed: true });
      const result = parser.parseData({ original: true });

      expect(result).toEqual({ transformed: true });
    });

    it('should handle empty array', () => {
      expect(parser.parseData([])).toEqual([]);
    });

    it('should handle empty object', () => {
      const result = parser.parseData({});
      expect(result).toBeDefined();
    });

    it('should return undefined as-is (not an array or object)', () => {
      expect(parser.parseData(undefined)).toBeUndefined();
    });
  });

  // ─── parseUnsuccessfulResponse() ───────────────────────────────────────────

  describe('Method: parseUnsuccessfulResponse()', () => {
    const clientErrorCodes = [401, 403, 404, 405];
    const serverErrorCodes = [500, 501, 502, 503, 504];

    clientErrorCodes.forEach(status => {
      it(`should call clientErrorFallback for HTTP ${status}`, () => {
        const error = new HttpErrorResponse({ status });
        const subscriber = makeSubscriber();
        const service = makeService();

        parser.parseUnsuccessfulResponse(error, subscriber, service);

        expect(service.clientErrorFallback).toHaveBeenCalledWith(status);
        expect(subscriber.error).not.toHaveBeenCalled();
        expect(service.serverErrorFallback).not.toHaveBeenCalled();
      });
    });

    serverErrorCodes.forEach(status => {
      it(`should call subscriber.error and serverErrorFallback for HTTP ${status}`, () => {
        const error = new HttpErrorResponse({ status });
        const subscriber = makeSubscriber();
        const service = makeService();

        parser.parseUnsuccessfulResponse(error, subscriber, service);

        expect(subscriber.error).toHaveBeenCalledWith(error);
        expect(service.serverErrorFallback).toHaveBeenCalledWith(status);
        expect(service.clientErrorFallback).not.toHaveBeenCalled();
      });
    });

    it('should call subscriber.error and serverErrorFallback for an unexpected status (default)', () => {
      const error = new HttpErrorResponse({ status: 418 });
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseUnsuccessfulResponse(error, subscriber, service);

      expect(subscriber.error).toHaveBeenCalledWith(error);
      expect(service.serverErrorFallback).toHaveBeenCalledWith(418);
    });

    it('should call subscriber.error with null when error is null/undefined', () => {
      const subscriber = makeSubscriber();
      const service = makeService();

      parser.parseUnsuccessfulResponse(null as any, subscriber, service);

      expect(subscriber.error).toHaveBeenCalledWith(null);
      expect(service.clientErrorFallback).not.toHaveBeenCalled();
      expect(service.serverErrorFallback).not.toHaveBeenCalled();
    });

    it('should not throw when called with a zero-status error', () => {
      const error = new HttpErrorResponse({ status: 0 });
      const subscriber = makeSubscriber();
      const service = makeService();

      expect(() => parser.parseUnsuccessfulResponse(error, subscriber, service)).not.toThrow();
    });
  });
});
