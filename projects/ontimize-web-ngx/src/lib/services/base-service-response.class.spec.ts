import { BaseServiceResponse } from './base-service-response.class';
import { Codes } from '../util/codes';

// Create a concrete implementation for testing since BaseServiceResponse is abstract
class TestServiceResponse extends BaseServiceResponse {
  constructor(
    code: number,
    data: any,
    message: string,
    sqlTypes?: { [key: string]: number; },
    startRecordIndex?: number,
    totalQueryRecordsNumber?: number
  ) {
    super(code, data, message, sqlTypes, startRecordIndex, totalQueryRecordsNumber);
  }
}

describe('BaseServiceResponse', () => {
  let serviceResponse: TestServiceResponse;
  const mockData = { test: 'data' };
  const mockMessage = 'Test message';
  const mockSqlTypes = { field1: 1, field2: 2 };

  describe('Constructor', () => {
    it('should create instance with basic parameters', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_SUCCESSFUL_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse).toBeTruthy();
      expect(serviceResponse.code).toBe(Codes.ONTIMIZE_SUCCESSFUL_CODE);
      expect(serviceResponse.data).toBe(mockData);
      expect(serviceResponse.message).toBe(mockMessage);
      expect(serviceResponse.sqlTypes).toBeUndefined();
      expect(serviceResponse.startRecordIndex).toBeUndefined();
      expect(serviceResponse.totalQueryRecordsNumber).toBeUndefined();
    });

    it('should create instance with all parameters', () => {
      const startIndex = 10;
      const totalRecords = 100;

      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_FAILED_CODE,
        mockData,
        mockMessage,
        mockSqlTypes,
        startIndex,
        totalRecords
      );

      expect(serviceResponse).toBeTruthy();
      expect(serviceResponse.code).toBe(Codes.ONTIMIZE_FAILED_CODE);
      expect(serviceResponse.data).toBe(mockData);
      expect(serviceResponse.message).toBe(mockMessage);
      expect(serviceResponse.sqlTypes).toBe(mockSqlTypes);
      expect(serviceResponse.startRecordIndex).toBe(startIndex);
      expect(serviceResponse.totalQueryRecordsNumber).toBe(totalRecords);
    });

    it('should handle null and undefined values', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_UNAUTHORIZED_CODE,
        null,
        undefined as any
      );

      expect(serviceResponse.code).toBe(Codes.ONTIMIZE_UNAUTHORIZED_CODE);
      expect(serviceResponse.data).toBeNull();
      expect(serviceResponse.message).toBeUndefined();
    });
  });

  describe('isSuccessful()', () => {
    it('should return true for successful code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_SUCCESSFUL_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isSuccessful()).toBe(true);
    });

    it('should return false for failed code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_FAILED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isSuccessful()).toBe(false);
    });

    it('should return false for unauthorized code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_UNAUTHORIZED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isSuccessful()).toBe(false);
    });

    it('should return false for any other code', () => {
      serviceResponse = new TestServiceResponse(
        999,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isSuccessful()).toBe(false);
    });
  });

  describe('isFailed()', () => {
    it('should return true for failed code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_FAILED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isFailed()).toBe(true);
    });

    it('should return false for successful code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_SUCCESSFUL_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isFailed()).toBe(false);
    });

    it('should return false for unauthorized code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_UNAUTHORIZED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isFailed()).toBe(false);
    });

    it('should return false for any other code', () => {
      serviceResponse = new TestServiceResponse(
        999,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isFailed()).toBe(false);
    });
  });

  describe('isUnauthorized()', () => {
    it('should return true for unauthorized code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_UNAUTHORIZED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isUnauthorized()).toBe(true);
    });

    it('should return false for successful code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_SUCCESSFUL_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isUnauthorized()).toBe(false);
    });

    it('should return false for failed code', () => {
      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_FAILED_CODE,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isUnauthorized()).toBe(false);
    });

    it('should return false for any other code', () => {
      serviceResponse = new TestServiceResponse(
        999,
        mockData,
        mockMessage
      );

      expect(serviceResponse.isUnauthorized()).toBe(false);
    });
  });

  describe('Edge cases and integration', () => {
    it('should work correctly with zero values', () => {
      serviceResponse = new TestServiceResponse(
        0, // This is actually ONTIMIZE_SUCCESSFUL_CODE
        0,
        '',
        {},
        0,
        0
      );

      expect(serviceResponse.isSuccessful()).toBe(true);
      expect(serviceResponse.isFailed()).toBe(false);
      expect(serviceResponse.isUnauthorized()).toBe(false);
      expect(serviceResponse.data).toBe(0);
      expect(serviceResponse.message).toBe('');
      expect(serviceResponse.startRecordIndex).toBe(0);
      expect(serviceResponse.totalQueryRecordsNumber).toBe(0);
    });

    it('should work correctly with negative values', () => {
      serviceResponse = new TestServiceResponse(
        -1,
        -100,
        'Negative test',
        undefined,
        -5,
        -10
      );

      expect(serviceResponse.code).toBe(-1);
      expect(serviceResponse.data).toBe(-100);
      expect(serviceResponse.startRecordIndex).toBe(-5);
      expect(serviceResponse.totalQueryRecordsNumber).toBe(-10);
      expect(serviceResponse.isSuccessful()).toBe(false);
      expect(serviceResponse.isFailed()).toBe(false);
      expect(serviceResponse.isUnauthorized()).toBe(false);
    });

    it('should handle complex data objects', () => {
      const complexData = {
        array: [1, 2, 3],
        nested: {
          property: 'value',
          number: 42
        },
        boolean: true
      };

      serviceResponse = new TestServiceResponse(
        Codes.ONTIMIZE_SUCCESSFUL_CODE,
        complexData,
        'Complex data test'
      );

      expect(serviceResponse.data).toEqual(complexData);
      expect(serviceResponse.data.array).toEqual([1, 2, 3]);
      expect(serviceResponse.data.nested.property).toBe('value');
      expect(serviceResponse.data.boolean).toBe(true);
    });
  });
});