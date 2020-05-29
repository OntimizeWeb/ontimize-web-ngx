
export interface ServiceResponse {
  code: number;
  data: any;
  message: string;
  sqlTypes?: { [key: string]: number; };
  startRecordIndex?: number;
  totalQueryRecordsNumber?: number;

  isSuccessful(): boolean;
  isFailed(): boolean;
  isUnauthorized(): boolean;
}
