import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { OErrorDialogManager } from './o-error-dialog-manager.service';
import { ODialogInternalComponent } from '../shared/components/dialog/o-dialog-internal.component';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OErrorDialogManager', () => {
  let service: OErrorDialogManager;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ODialogInternalComponent>>;
  let mockDialogComponent: jasmine.SpyObj<any>;

  beforeEach(() => {
    // Create spies for MatDialog and MatDialogRef
    mockDialogComponent = jasmine.createSpyObj('ODialogInternalComponent', ['alert']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.componentInstance = mockDialogComponent;
    
    // Use Subject instead of of() to allow async completion
    const afterClosedSubject = new Subject<any>();
    mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
    // Emit value after a microtask to ensure dialog methods are called first
    Promise.resolve().then(() => afterClosedSubject.next(true));

    matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    matDialog.open.and.returnValue(mockDialogRef);

    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OErrorDialogManager,
        { provide: MatDialog, useValue: matDialog },
        ...OTestingUtils.getCommonTestingModuleConfig().providers.filter(
          provider => !(provider && provider.provide === OErrorDialogManager)
        )
      ]
    });
    service = TestBed.inject(OErrorDialogManager);
  });

  afterEach(() => {
    // Clean up dialog ref after each test
    if (service.dialogRef) {
      service.dialogRef = null;
    }
    // Reset error dialog subscription
    service['errorDialogSubscription'] = null;
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be instance of OErrorDialogManager', () => {
      expect(service).toBeInstanceOf(OErrorDialogManager);
    });

    it('should have MatDialog injected', () => {
      expect(service['ng2Dialog']).toBeTruthy();
    });

    it('should have expected methods', () => {
      expect(typeof service.openErrorDialog).toBe('function');
      expect(typeof service.alert).toBe('function');
    });

    it('should initialize with no active error dialog subscription', () => {
      expect(service['errorDialogSubscription']).toBeUndefined();
    });
  });

  describe('openErrorDialog method', () => {
    it('should open error dialog with default message when no error provided', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog();

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });

    it('should open error dialog with custom error message', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(false));
      const customError = 'Custom error message';

      const result = await service.openErrorDialog(customError);

      expect(service.alert).toHaveBeenCalledWith('ERROR', customError);
      expect(result).toBe(false);
    });

    it('should open error dialog with default message when error is object', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));
      const errorObj = { message: 'Object error', code: 500 };

      const result = await service.openErrorDialog(errorObj);

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });

    it('should return same promise for multiple calls before dialog is closed', () => {
      spyOn(service, 'alert').and.returnValue(new Promise(() => {})); // Never resolves

      const promise1 = service.openErrorDialog('Error 1');
      const promise2 = service.openErrorDialog('Error 2');

      expect(promise1).toBe(promise2);
      expect(service.alert).toHaveBeenCalledTimes(1);
    });

    it('should allow new dialog after previous is closed', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result1 = await service.openErrorDialog('Error 1');
      const result2 = await service.openErrorDialog('Error 2');

      expect(service.alert).toHaveBeenCalledTimes(2);
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should handle empty string error', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog('');

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });

    it('should handle null error', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog(null);

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });

    it('should handle undefined error', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog(undefined);

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });
  });

  describe('alert method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogInternalComponent', ['alert']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should open dialog and call alert on component', async () => {
      const title = 'Error Title';
      const message = 'Error Message';
      const config = { alertType: 'error' as const };

      const promise = service.alert(title, message, config);

      expect(matDialog.open).toHaveBeenCalledWith(ODialogInternalComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(mockDialogComponent.alert).toHaveBeenCalledWith(title, message, config);
      expect(mockDialogRef.afterClosed).toHaveBeenCalled();

      await promise;
      expect(service.dialogRef).toBeNull();
    });

    it('should handle alert without config', async () => {
      const title = 'Error Title';
      const message = 'Error Message';

      const promise = service.alert(title, message);

      expect(mockDialogComponent.alert).toHaveBeenCalledWith(title, message, undefined);
      await promise;
    });

    it('should return false when dialog is closed without result', async () => {
      mockDialogRef.afterClosed.and.returnValue(of(undefined));

      const result = await service.alert('Title', 'Message');
      expect(result).toBe(false);
    });

    it('should return actual result when dialog is closed with result', async () => {
      mockDialogRef.afterClosed.and.returnValue(of('test-result'));

      const result = await service.alert('Title', 'Message');
      expect(result).toBe('test-result');
    });
  });

  describe('openDialog method', () => {
    beforeEach(() => {
      // Reset matDialog spy
      matDialog.open.calls.reset();
      // Recreate fresh mocks for each test
      mockDialogComponent = jasmine.createSpyObj('ODialogInternalComponent', ['alert']);
      mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialogRef.componentInstance = mockDialogComponent;
      
      // Use Subject instead of of() to allow async completion
      const afterClosedSubject = new Subject<any>();
      mockDialogRef.afterClosed.and.returnValue(afterClosedSubject.asObservable());
      // Emit value after a microtask to ensure dialog methods are called first
      Promise.resolve().then(() => afterClosedSubject.next(true));
      
      matDialog.open.and.returnValue(mockDialogRef);
    });

    it('should configure dialog with correct parameters', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };

      service['openDialog'](mockObserver);

      expect(matDialog.open).toHaveBeenCalledWith(ODialogInternalComponent, {
        role: 'alertdialog',
        disableClose: true,
        panelClass: ['o-dialog-class', 'o-dialog-service']
      });
      expect(service.dialogRef).toBe(mockDialogRef);
    });

    it('should handle dialog close with result', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };
      const testResult = 'test-result';
      mockDialogRef.afterClosed.and.returnValue(of(testResult));

      service['openDialog'](mockObserver);

      expect(mockObserver.next).toHaveBeenCalledWith(testResult);
      expect(mockObserver.complete).toHaveBeenCalled();
      expect(service.dialogRef).toBeNull();
    });

    it('should handle dialog close without result (convert undefined to false)', () => {
      const mockObserver = { next: jasmine.createSpy(), complete: jasmine.createSpy() };
      mockDialogRef.afterClosed.and.returnValue(of(undefined));

      service['openDialog'](mockObserver);

      expect(mockObserver.next).toHaveBeenCalledWith(false);
      expect(mockObserver.complete).toHaveBeenCalled();
      expect(service.dialogRef).toBeNull();
    });
  });

  describe('restart method', () => {
    it('should reset error dialog subscription', () => {
      service['errorDialogSubscription'] = Promise.resolve(true);

      service['restart']();

      expect(service['errorDialogSubscription']).toBeNull();
    });
  });

  describe('Integration tests', () => {
    it('should handle multiple sequential error dialogs', async () => {
      spyOn(service, 'alert').and.returnValues(
        Promise.resolve(true),
        Promise.resolve(false)
      );

      // First error dialog
      const result1 = await service.openErrorDialog('Error 1');
      expect(result1).toBe(true);

      // Second error dialog (should be allowed after first is closed)
      const result2 = await service.openErrorDialog('Error 2');
      expect(result2).toBe(false);

      expect(service.alert).toHaveBeenCalledTimes(2);
    });

    it('should handle complex error objects correctly', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const complexError = {
        error: {
          message: 'Nested error',
          details: ['Detail 1', 'Detail 2']
        },
        status: 500
      };

      const result = await service.openErrorDialog(complexError);

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });

    it('should handle numeric errors', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog(404);

      expect(service.alert).toHaveBeenCalledWith('ERROR', jasmine.any(Number));
      expect(result).toBe(true);
    });

    it('should handle boolean errors', async () => {
      spyOn(service, 'alert').and.returnValue(Promise.resolve(true));

      const result = await service.openErrorDialog(false);

      expect(service.alert).toHaveBeenCalledWith('ERROR', 'MESSAGES.ERROR_QUERY');
      expect(result).toBe(true);
    });
  });
});
